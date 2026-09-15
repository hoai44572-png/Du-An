import { ChatController } from '../controllers/chat.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const routesConfig = [
  { path: '/conversations', method: 'GET', handler: ChatController.getConversations },
  { path: '/conversations/:id', method: 'GET', handler: ChatController.getConversationById },
  { path: '/messages/:conversationId', method: 'GET', handler: ChatController.getMessages },
  { path: '/send', method: 'POST', handler: ChatController.sendMessage },
  { path: '/read/:conversationId', method: 'PUT', handler: ChatController.markRead },
  { path: '/typing', method: 'PUT', handler: ChatController.setTyping },
  { path: '/online', method: 'PUT', handler: ChatController.setOnline },
  { path: '/message/:id', method: 'DELETE', handler: ChatController.deleteMessage },
  { path: '/close/:conversationId', method: 'PUT', handler: ChatController.closeConversation },
  { path: '/open/:conversationId', method: 'PUT', handler: ChatController.openConversation },
  { path: '/unread', method: 'GET', handler: ChatController.getUnread },
];

export async function handleChatRoute(req) {
  const url = new URL(req.url);
  const path = url.pathname.replace('/api/chat', '');
  const method = req.method;

  // 1. GET /conversations
  if (path === '/conversations' && method === 'GET') {
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');
    return ChatController.getConversations({ query: { status, search } });
  }

  // 2. GET /unread
  if (path === '/unread' && method === 'GET') {
    const role = url.searchParams.get('role');
    return ChatController.getUnread({ query: { role } });
  }

  // 3. GET /conversations/:id
  if (path.startsWith('/conversations/') && method === 'GET') {
    const id = path.replace('/conversations/', '');
    return ChatController.getConversationById({ params: { id } });
  }

  // 4. GET /messages/:conversationId
  if (path.startsWith('/messages/') && method === 'GET') {
    const conversationId = path.replace('/messages/', '');
    return ChatController.getMessages({ params: { conversationId } });
  }

  // 5. POST /send
  if (path === '/send' && method === 'POST') {
    const body = await req.json();
    return ChatController.sendMessage({ body });
  }

  // 6. PUT /read/:conversationId
  if (path.startsWith('/read/') && method === 'PUT') {
    const conversationId = path.replace('/read/', '');
    const body = await req.json().catch(() => ({}));
    return ChatController.markRead({ params: { conversationId }, body });
  }

  // 7. PUT /typing
  if (path === '/typing' && method === 'PUT') {
    const body = await req.json();
    return ChatController.setTyping({ body });
  }

  // 8. PUT /online
  if (path === '/online' && method === 'PUT') {
    const body = await req.json();
    return ChatController.setOnline({ body });
  }

  // 9. DELETE /message/:id
  if (path.startsWith('/message/') && method === 'DELETE') {
    const id = path.replace('/message/', '');
    return ChatController.deleteMessage({ params: { id } });
  }

  // 10. PUT /close/:conversationId
  if (path.startsWith('/close/') && method === 'PUT') {
    const conversationId = path.replace('/close/', '');
    return ChatController.closeConversation({ params: { conversationId } });
  }

  // 11. PUT /open/:conversationId
  if (path.startsWith('/open/') && method === 'PUT') {
    const conversationId = path.replace('/open/', '');
    return ChatController.openConversation({ params: { conversationId } });
  }

  return { success: false, message: 'Endpoint không tồn tại', statusCode: 404 };
}
