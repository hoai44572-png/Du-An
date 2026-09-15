import { ChatService } from '../services/chat.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export class ChatController {
  static async getConversations(req, res) {
    try {
      const { status, search } = req.query || {};
      const data = ChatService.getConversations({ status, search });
      return successResponse(res, data, 'Lấy danh sách cuộc trò chuyện thành công');
    } catch (err) {
      return errorResponse(res, 'Lỗi lấy danh sách cuộc trò chuyện', 500, err.message);
    }
  }

  static async getConversationById(req, res) {
    try {
      const { id } = req.params || {};
      const data = ChatService.getConversationById(id);
      return successResponse(res, data, 'Lấy chi tiết cuộc trò chuyện thành công');
    } catch (err) {
      return errorResponse(res, 'Lỗi lấy cuộc trò chuyện', 500, err.message);
    }
  }

  static async getMessages(req, res) {
    try {
      const { conversationId } = req.params || {};
      const data = ChatService.getMessages(conversationId);
      return successResponse(res, data, 'Lấy danh sách tin nhắn thành công');
    } catch (err) {
      return errorResponse(res, 'Lỗi lấy tin nhắn', 500, err.message);
    }
  }

  static async sendMessage(req, res) {
    try {
      const body = req.body || {};
      const message = ChatService.sendMessage(body);
      return successResponse(res, message, 'Gửi tin nhắn thành công', 201);
    } catch (err) {
      return errorResponse(res, 'Lỗi gửi tin nhắn', 500, err.message);
    }
  }

  static async markRead(req, res) {
    try {
      const { conversationId } = req.params || {};
      const { role } = req.body || {};
      const result = ChatService.markRead(conversationId, role);
      return successResponse(res, result, 'Đánh dấu đã đọc thành công');
    } catch (err) {
      return errorResponse(res, 'Lỗi cập nhật đã đọc', 500, err.message);
    }
  }

  static async setTyping(req, res) {
    try {
      const { conversationId, isTyping } = req.body || {};
      const result = ChatService.setTyping(conversationId, isTyping);
      return successResponse(res, result, 'Cập nhật trạng thái nhập liệu');
    } catch (err) {
      return errorResponse(res, 'Lỗi cập nhật typing', 500, err.message);
    }
  }

  static async setOnline(req, res) {
    try {
      const { conversationId, isOnline } = req.body || {};
      const result = ChatService.setOnline(conversationId, isOnline);
      return successResponse(res, result, 'Cập nhật trạng thái online');
    } catch (err) {
      return errorResponse(res, 'Lỗi cập nhật online', 500, err.message);
    }
  }

  static async deleteMessage(req, res) {
    try {
      const { id } = req.params || {};
      const result = ChatService.deleteMessage(id);
      return successResponse(res, result, 'Xóa tin nhắn thành công');
    } catch (err) {
      return errorResponse(res, 'Lỗi xóa tin nhắn', 500, err.message);
    }
  }

  static async closeConversation(req, res) {
    try {
      const { conversationId } = req.params || {};
      const result = ChatService.closeConversation(conversationId);
      return successResponse(res, result, 'Đóng cuộc trò chuyện thành công');
    } catch (err) {
      return errorResponse(res, 'Lỗi đóng hội thoại', 500, err.message);
    }
  }

  static async openConversation(req, res) {
    try {
      const { conversationId } = req.params || {};
      const result = ChatService.openConversation(conversationId);
      return successResponse(res, result, 'Mở lại cuộc trò chuyện thành công');
    } catch (err) {
      return errorResponse(res, 'Lỗi mở hội thoại', 500, err.message);
    }
  }

  static async getUnread(req, res) {
    try {
      const { role } = req.query || {};
      const data = ChatService.getUnreadCount(role);
      return successResponse(res, data, 'Lấy số tin nhắn chưa đọc thành công');
    } catch (err) {
      return errorResponse(res, 'Lỗi lấy tin chưa đọc', 500, err.message);
    }
  }
}
