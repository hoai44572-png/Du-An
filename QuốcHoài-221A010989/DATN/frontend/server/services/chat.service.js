import conversationsData from '../data/mockConversations.json';
import messagesData from '../data/mockMessages.json';

let conversationsStore = [...conversationsData];
let messagesStore = [...messagesData];

export class ChatService {
  static getConversations(filter = {}) {
    let result = [...conversationsStore];
    if (filter.status && filter.status !== 'ALL') {
      result = result.filter((c) => c.status === filter.status);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.userName.toLowerCase().includes(q) ||
          c.userEmail.toLowerCase().includes(q) ||
          c.lastMessage.toLowerCase().includes(q)
      );
    }
    return result;
  }

  static getConversationById(id) {
    let conv = conversationsStore.find((c) => c.id === id);
    if (!conv) {
      // Create new conversation if user starts chat
      conv = {
        id: id || `conv-${Date.now()}`,
        userId: 'user-01',
        userName: 'Nguyễn Văn An',
        userEmail: 'an.nguyen@gmail.com',
        userPhone: '0988 123 456',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
        assignedStaffId: 'staff-01',
        assignedStaffName: 'Swift Coffee Support',
        assignedStaffAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        lastMessage: 'Bắt đầu cuộc trò chuyện',
        lastMessageTime: new Date().toISOString(),
        unreadCountUser: 0,
        unreadCountAdmin: 0,
        isOnline: true,
        isTyping: false,
        status: 'open',
        createdAt: new Date().toISOString(),
      };
      conversationsStore.unshift(conv);
    }
    return conv;
  }

  static getMessages(conversationId) {
    return messagesStore.filter((m) => m.conversationId === conversationId);
  }

  static sendMessage({ conversationId, senderId, senderRole, senderName, senderAvatar, content, attachments = [] }) {
    const newMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: senderId || (senderRole === 'ADMIN' ? 'staff-01' : 'user-01'),
      senderRole: senderRole || 'USER',
      senderName: senderName || (senderRole === 'ADMIN' ? 'Swift Coffee Support' : 'Khách hàng'),
      senderAvatar: senderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      content: content || '',
      attachments: attachments || [],
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    messagesStore.push(newMessage);

    // Update conversation last message
    const convIndex = conversationsStore.findIndex((c) => c.id === conversationId);
    if (convIndex !== -1) {
      conversationsStore[convIndex] = {
        ...conversationsStore[convIndex],
        lastMessage: content || (attachments.length ? '[Tệp đính kèm]' : ''),
        lastMessageTime: newMessage.createdAt,
        unreadCountAdmin: senderRole === 'USER' ? conversationsStore[convIndex].unreadCountAdmin + 1 : conversationsStore[convIndex].unreadCountAdmin,
        unreadCountUser: senderRole === 'ADMIN' ? conversationsStore[convIndex].unreadCountUser + 1 : conversationsStore[convIndex].unreadCountUser,
        status: 'open',
      };
    }

    return newMessage;
  }

  static markRead(conversationId, role = 'USER') {
    const conv = conversationsStore.find((c) => c.id === conversationId);
    if (conv) {
      if (role === 'ADMIN') conv.unreadCountAdmin = 0;
      else conv.unreadCountUser = 0;
    }
    messagesStore.forEach((m) => {
      if (m.conversationId === conversationId) m.isRead = true;
    });
    return { success: true, conversationId };
  }

  static setTyping(conversationId, isTyping) {
    const conv = conversationsStore.find((c) => c.id === conversationId);
    if (conv) conv.isTyping = Boolean(isTyping);
    return { conversationId, isTyping };
  }

  static setOnline(conversationId, isOnline) {
    const conv = conversationsStore.find((c) => c.id === conversationId);
    if (conv) conv.isOnline = Boolean(isOnline);
    return { conversationId, isOnline };
  }

  static deleteMessage(id) {
    messagesStore = messagesStore.filter((m) => m.id !== id);
    return { success: true, messageId: id };
  }

  static closeConversation(conversationId) {
    const conv = conversationsStore.find((c) => c.id === conversationId);
    if (conv) conv.status = 'closed';
    return conv;
  }

  static openConversation(conversationId) {
    const conv = conversationsStore.find((c) => c.id === conversationId);
    if (conv) conv.status = 'open';
    return conv;
  }

  static getUnreadCount(role = 'USER') {
    const total = conversationsStore.reduce((acc, c) => {
      return acc + (role === 'ADMIN' ? c.unreadCountAdmin : c.unreadCountUser);
    }, 0);
    return { unread: total };
  }
}
