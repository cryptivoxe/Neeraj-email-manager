'use server';

import { db } from '@/lib/db';
import {
  ACTION_TYPE,
  EMAIL_STATUS,
  type ActionType,
  type EmailStatus,
  type Priority,
} from '@/lib/constants';
import { revalidatePath } from 'next/cache';

async function getOrCreateManager() {
  let manager = await db.user.findFirst({
    where: { role: 'MANAGER' },
  });

  if (!manager) {
    manager = await db.user.create({
      data: {
        email: 'neeraj.kumar@company.com',
        name: 'Neeraj Kumar',
        role: 'MANAGER',
      },
    });
  }

  return manager;
}

export async function createEmail(formData: {
  subject: string;
  senderName: string;
  senderEmail: string;
  company?: string;
  body: string;
  priority: Priority;
  status: EmailStatus;
  dueDate?: string;
  assignedContactText?: string;
}) {
  try {
    const manager = await getOrCreateManager();

    const bodySnippet =
      formData.body.length > 150
        ? formData.body.substring(0, 150) + '...'
        : formData.body;

    const email = await db.email.create({
      data: {
        subject: formData.subject,
        senderName: formData.senderName,
        senderEmail: formData.senderEmail,
        company: formData.company || null,
        bodySnippet,
        body: formData.body,
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
        assignedContactText: formData.assignedContactText?.trim() || null,
      },
    });

    await db.auditLog.create({
      data: {
        emailId: email.id,
        actionType: 'CREATED',
        details: `Manual entry created. Status: ${formData.status}, Priority: ${formData.priority}.`,
        performedById: manager.id,
      },
    });

    revalidatePath('/');
    revalidatePath('/emails');
    revalidatePath('/emails/new');

    return { success: true, emailId: email.id };
  } catch (error: unknown) {
    console.error('Error in createEmail server action:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create email',
    };
  }
}

export async function addEmailAction(
  emailId: string,
  type: ActionType,
  description: string
) {
  try {
    const manager = await getOrCreateManager();

    await db.action.create({
      data: {
        emailId,
        type,
        description,
        performedById: manager.id,
      },
    });

    let detailsStr = `Action '${type}' recorded: "${description.substring(0, 50)}${
      description.length > 50 ? '...' : ''
    }"`;
    let statusToUpdate: EmailStatus | null = null;

    if (type === ACTION_TYPE.CLOSE) {
      statusToUpdate = EMAIL_STATUS.CLOSED;
      detailsStr = 'Action CLOSE recorded. Status updated to CLOSED.';
    } else if (type === ACTION_TYPE.FORWARD) {
      statusToUpdate = EMAIL_STATUS.FORWARDED;
      detailsStr = `Action FORWARD recorded. Status updated to FORWARDED. Description: "${description.substring(0, 50)}"`;
    } else if (type === ACTION_TYPE.REPLY) {
      statusToUpdate = EMAIL_STATUS.WAITING_REPLY;
      detailsStr = `Action REPLY sent. Status updated to WAITING_REPLY. Description: "${description.substring(0, 50)}"`;
    }

    if (statusToUpdate) {
      await db.email.update({
        where: { id: emailId },
        data: { status: statusToUpdate },
      });
    }

    await db.auditLog.create({
      data: {
        emailId,
        actionType: `ACTION_${type}`,
        details: detailsStr,
        performedById: manager.id,
      },
    });

    revalidatePath('/');
    revalidatePath('/emails');
    revalidatePath(`/emails/${emailId}`);

    return { success: true };
  } catch (error: unknown) {
    console.error('Error in addEmailAction:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to log action',
    };
  }
}

export async function addExternalReply(
  emailId: string,
  sender: string,
  body: string
) {
  try {
    const manager = await getOrCreateManager();

    await db.reply.create({
      data: {
        emailId,
        sender,
        body,
        receivedAt: new Date(),
      },
    });

    await db.email.update({
      where: { id: emailId },
      data: { status: EMAIL_STATUS.NEEDS_ACTION },
    });

    await db.auditLog.create({
      data: {
        emailId,
        actionType: 'REPLY_RECEIVED',
        details: `Received reply from "${sender}". Reset email status to NEEDS_ACTION.`,
        performedById: manager.id,
      },
    });

    revalidatePath('/');
    revalidatePath('/emails');
    revalidatePath(`/emails/${emailId}`);

    return { success: true };
  } catch (error: unknown) {
    console.error('Error in addExternalReply:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to record reply',
    };
  }
}

export async function updateEmailAssignee(
  emailId: string,
  assignedContactText: string | null
) {
  try {
    const manager = await getOrCreateManager();

    const cleanAssignedContact =
      assignedContactText && assignedContactText.trim().length > 0
        ? assignedContactText.trim()
        : null;

    const newStatus = cleanAssignedContact
      ? EMAIL_STATUS.FORWARDED
      : EMAIL_STATUS.NEEDS_ACTION;

    await db.email.update({
      where: { id: emailId },
      data: {
        assignedContactText: cleanAssignedContact,
        status: newStatus,
      },
    });

    await db.action.create({
      data: {
        emailId,
        type: ACTION_TYPE.ASSIGN,
        description: cleanAssignedContact
          ? `Assigned email to ${cleanAssignedContact}.`
          : 'Assignment removed from email.',
        performedById: manager.id,
      },
    });

    await db.auditLog.create({
      data: {
        emailId,
        actionType: 'REASSIGNMENT',
        details: cleanAssignedContact
          ? `Assigned to ${cleanAssignedContact}. Status changed to FORWARDED.`
          : 'Assignment removed. Status reverted to NEEDS_ACTION.',
        performedById: manager.id,
      },
    });

    revalidatePath('/');
    revalidatePath('/emails');
    revalidatePath(`/emails/${emailId}`);

    return { success: true };
  } catch (error: unknown) {
    console.error('Error in updateEmailAssignee:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update assignee',
    };
  }
}

export async function updateEmailStatus(emailId: string, status: EmailStatus) {
  try {
    const manager = await getOrCreateManager();

    const email = await db.email.findUnique({
      where: { id: emailId },
      select: { status: true },
    });

    if (!email) throw new Error('Email not found');

    const oldStatus = email.status;

    await db.email.update({
      where: { id: emailId },
      data: { status },
    });

    await db.auditLog.create({
      data: {
        emailId,
        actionType: 'STATUS_CHANGE',
        details: `Status manually changed from ${oldStatus} to ${status}.`,
        performedById: manager.id,
      },
    });

    revalidatePath('/');
    revalidatePath('/emails');
    revalidatePath(`/emails/${emailId}`);

    return { success: true };
  } catch (error: unknown) {
    console.error('Error in updateEmailStatus:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update status',
    };
  }
}

export async function deleteEmail(emailId: string) {
  try {
    await db.email.delete({
      where: { id: emailId },
    });

    revalidatePath('/');
    revalidatePath('/emails');
    revalidatePath(`/emails/${emailId}`);

    return { success: true };
  } catch (error: unknown) {
    console.error('Error deleting email:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete email',
    };
  }
}

export async function deleteSelectedEmails(emailIds: string[]) {
  try {
    if (!Array.isArray(emailIds) || emailIds.length === 0) {
      return { success: false, error: 'No emails selected.' };
    }

    const result = await db.email.deleteMany({
      where: {
        id: {
          in: emailIds,
        },
      },
    });

    revalidatePath('/');
    revalidatePath('/emails');

    return {
      success: true,
      deletedCount: result.count,
    };
  } catch (error: unknown) {
    console.error('Error deleting selected emails:', error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to delete selected emails',
    };
  }
}