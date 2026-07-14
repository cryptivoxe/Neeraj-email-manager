'use server';

import { db } from '@/lib/db';
import { type ContactRole } from '@/lib/constants';
import { revalidatePath } from 'next/cache';

/**
 * Server Action to create a new contact (Employee, Vendor, or Client).
 */
export async function createContact(formData: {
  name: string;
  email?: string;
  company?: string;
  role: ContactRole;
}) {
  try {
    if (!formData.name.trim()) {
      throw new Error('Contact name is required.');
    }

    const contact = await db.contact.create({
      data: {
        name: formData.name.trim(),
        email: formData.email?.trim() || null,
        company: formData.company?.trim() || null,
        role: formData.role,
      },
    });

    revalidatePath('/contacts');
    revalidatePath('/emails');
    revalidatePath('/emails/new');

    return { success: true, contactId: contact.id };
  } catch (error: unknown) {
    console.error('Error in createContact server action:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create contact.',
    };
  }
}