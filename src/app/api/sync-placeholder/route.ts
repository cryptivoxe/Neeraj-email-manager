import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Sync Webhook received raw payload:', body);

    // Placeholder actions: In the future, this handler would fetch details from the provider 
    // and insert an Email record into our database.
    return NextResponse.json({ 
      success: true, 
      message: 'Gmail/Outlook Sync placeholder webhook received successfully.',
      receivedPayload: body
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error processing sync webhook placeholder:', error);
    return NextResponse.json(
      { error: 'Failed to process sync webhook stub: ' + error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Gmail/Outlook Sync Webhook API endpoint is ready. Send POST request with notification payload.'
  }, { status: 200 });
}
