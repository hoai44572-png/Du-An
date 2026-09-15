import { ChatController } from '../controllers/chat.controller.js';

export async function handleChatRoute(req) {
  const url = new URL(req.url);
  const path = url.pathname.replace('/api/chat', '');
  const method = req.method;

  if (path === '/conversations' && method === 'GET') {
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');
    return ChatController.getConversations({ query: { status, search } });
  }

  if (path === '/unread' && method === 'GET') {
    const role = url.searchParams.get('role');
    return ChatController.getUnread({ query: { role } });
  }

  if (path.startsWith('/conversations/') && method === 'GET') {
    const id = path.replace('/conversations/', '');
    return ChatController.getConversationById({ params: { id } });
  }

  if (path.startsWith('/messages/') && method === 'GET') {
    const conversationId = path.replace('/messages/', '');
    return ChatController.getMessages({ params: { conversationId } });
  }

  if (path === '/send' && method === 'POST') {
    const body = await req.json();
    return ChatController.sendMessage({ body });
  }

  if (path.startsWith('/read/') && method === 'PUT') {
    const conversationId = path.replace('/read/', '');
    const body = await req.json().catch(() => ({}));
    return ChatController.markRead({ params: { conversationId }, body });
  }

  if (path === '/typing' && method === 'PUT') {
    const body = await req.json();
    return ChatController.setTyping({ body });
  }

  if (path === '/online' && method === 'PUT') {
    const body = await req.json();
    return ChatController.setOnline({ body });
  }

  if (path.startsWith('/message/') && method === 'DELETE') {
    const id = path.replace('/message/', '');
    return ChatController.deleteMessage({ params: { id } });
  }

  if (path.startsWith('/close/') && method === 'PUT') {
    const conversationId = path.replace('/close/', '');
    return ChatController.closeConversation({ params: { conversationId } });
  }

  if (path.startsWith('/open/') && method === 'PUT') {
    const conversationId = path.replace('/open/', '');
    return ChatController.openConversation({ params: { conversationId } });
  }

  return { success: false, message: 'Endpoint không tồn tại', statusCode: 404 };
}
