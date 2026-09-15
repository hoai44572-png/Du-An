import { NextResponse } from 'next/server';
import { handleChatRoute } from '@/server/routes/chat.routes.js';

async function processRequest(req: Request) {
  try {
    const result = await handleChatRoute(req);
    return NextResponse.json(result, { status: result.statusCode || 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Server Internal Error', error: err.message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return processRequest(req);
}

export async function POST(req: Request) {
  return processRequest(req);
}

export async function PUT(req: Request) {
  return processRequest(req);
}

export async function DELETE(req: Request) {
  return processRequest(req);
}
