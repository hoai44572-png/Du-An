'use client';

import { useState, useEffect, useCallback } from 'react';
import { chatService, ChatConversation, ChatMessageItem } from '@/lib/services/chatService';
import { socketService } from '@/lib/services/socketService';

export function useChat(conversationIdParam?: string, role: 'USER' | 'ADMIN' = 'USER') {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Fetch all conversations (for Admin or User)
  const fetchConversations = useCallback(async (status = 'ALL', search = '') => {
    try {
      const res = await chatService.getConversations(status, search);
      if (res.success) {
        setConversations(res.data);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  }, []);

  // Fetch messages for active conversation
  const fetchMessages = useCallback(async (convId: string) => {
    try {
      setLoading(true);
      const res = await chatService.getMessages(convId);
      if (res.success) {
        setMessages(res.data);
      }
      const convRes = await chatService.getConversation(convId);
      if (convRes.success) {
        setActiveConversation(convRes.data);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch unread count
  const fetchUnread = useCallback(async () => {
    try {
      const res = await chatService.getUnread(role);
      if (res.success) {
        setUnreadCount(res.data.unread);
      }
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  }, [role]);

  // Send Message
  const sendMessage = async (content: string, attachments: any[] = []) => {
    if (!content.trim() && attachments.length === 0) return;
    const targetConvId = activeConversation?.id || conversationIdParam || 'conv-101';

    try {
      const res = await chatService.sendMessage({
        conversationId: targetConvId,
        senderRole: role,
        content,
        attachments,
      });

      if (res.success) {
        setMessages((prev) => [...prev, res.data]);
        socketService.sendMessage(res.data);
        fetchConversations();
        fetchUnread();
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  // Mark Read
  const markRead = async (convId: string) => {
    try {
      await chatService.readMessage(convId, role);
      fetchUnread();
    } catch (err) {
      console.error('Error marking read:', err);
    }
  };

  // Typing action
  const sendTyping = (typingState: boolean) => {
    if (activeConversation) {
      chatService.typing(activeConversation.id, typingState);
      socketService.typing(activeConversation.id, typingState);
    }
  };

  // Close Conversation
  const closeConversation = async (convId: string) => {
    const res = await chatService.closeConversation(convId);
    if (res.success) fetchConversations();
  };

  // Open Conversation
  const openConversation = async (convId: string) => {
    const res = await chatService.openConversation(convId);
    if (res.success) fetchConversations();
  };

  // Initial setup & polling/sockets
  useEffect(() => {
    socketService.connect();
    fetchConversations();
    fetchUnread();

    const currentConvId = conversationIdParam || 'conv-101';
    fetchMessages(currentConvId);

    const interval = setInterval(() => {
      fetchUnread();
    }, 5000);

    return () => {
      clearInterval(interval);
      socketService.disconnect();
    };
  }, [conversationIdParam, fetchConversations, fetchMessages, fetchUnread]);

  return {
    conversations,
    activeConversation,
    setActiveConversation,
    messages,
    loading,
    isTyping,
    unreadCount,
    fetchConversations,
    fetchMessages,
    sendMessage,
    markRead,
    sendTyping,
    closeConversation,
    openConversation,
  };
}
