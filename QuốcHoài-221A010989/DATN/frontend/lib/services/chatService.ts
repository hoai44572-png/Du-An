export interface ChatConversation {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userAvatar: string;
  assignedStaffId: string;
  assignedStaffName: string;
  assignedStaffAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCountUser: number;
  unreadCountAdmin: number;
  isOnline: boolean;
  isTyping: boolean;
  status: 'open' | 'closed' | 'completed';
  createdAt: string;
}

export interface ChatAttachment {
  type: 'image' | 'file';
  url: string;
  name: string;
}

export interface ChatMessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: 'USER' | 'ADMIN';
  senderName: string;
  senderAvatar: string;
  content: string;
  attachments?: ChatAttachment[];
  isRead: boolean;
  createdAt: string;
}

class ChatServiceFrontend {
  private async request(url: string, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' : '';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    };

    const res = await fetch(url, { ...options, headers });
    return res.json();
  }

  async getConversations(status = 'ALL', search = '') {
    const query = new URLSearchParams();
    if (status !== 'ALL') query.append('status', status);
    if (search) query.append('search', search);
    return this.request(`/api/chat/conversations?${query.toString()}`);
  }

  async getConversation(id: string) {
    return this.request(`/api/chat/conversations/${id}`);
  }

  async getMessages(conversationId: string) {
    return this.request(`/api/chat/messages/${conversationId}`);
  }

  async sendMessage(data: {
    conversationId: string;
    senderId?: string;
    senderRole?: 'USER' | 'ADMIN';
    senderName?: string;
    senderAvatar?: string;
    content: string;
    attachments?: ChatAttachment[];
  }) {
    return this.request('/api/chat/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async readMessage(conversationId: string, role = 'USER') {
    return this.request(`/api/chat/read/${conversationId}`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async typing(conversationId: string, isTyping: boolean) {
    return this.request('/api/chat/typing', {
      method: 'PUT',
      body: JSON.stringify({ conversationId, isTyping }),
    });
  }

  async online(conversationId: string, isOnline: boolean) {
    return this.request('/api/chat/online', {
      method: 'PUT',
      body: JSON.stringify({ conversationId, isOnline }),
    });
  }

  async deleteMessage(id: string) {
    return this.request(`/api/chat/message/${id}`, {
      method: 'DELETE',
    });
  }

  async closeConversation(conversationId: string) {
    return this.request(`/api/chat/close/${conversationId}`, {
      method: 'PUT',
    });
  }

  async openConversation(conversationId: string) {
    return this.request(`/api/chat/open/${conversationId}`, {
      method: 'PUT',
    });
  }

  async getUnread(role = 'USER') {
    return this.request(`/api/chat/unread?role=${role}`);
  }
}

export const chatService = new ChatServiceFrontend();
