export class SocketService {
  private static instance: SocketService;
  private isConnected: boolean = false;
  private listeners: Map<string, Function[]> = new Map();

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(url: string = 'http://localhost:3000', options: any = {}) {
    console.log(`[SocketService Placeholder] Connecting to Socket.IO server at ${url}...`);
    this.isConnected = true;
    this.emitLocal('connect', { socketId: 'mock-socket-id-99', status: 'connected' });
  }

  disconnect() {
    console.log('[SocketService Placeholder] Disconnected from Socket.IO server.');
    this.isConnected = false;
    this.emitLocal('disconnect', { status: 'disconnected' });
  }

  joinConversation(conversationId: string) {
    console.log(`[SocketService Placeholder] Joined room: conversation_${conversationId}`);
  }

  leaveConversation(conversationId: string) {
    console.log(`[SocketService Placeholder] Left room: conversation_${conversationId}`);
  }

  sendMessage(message: any) {
    console.log('[SocketService Placeholder] Emitted socket event: send_message', message);
  }

  receiveMessage(callback: (message: any) => void) {
    this.on('receive_message', callback);
  }

  typing(conversationId: string, isTyping: boolean) {
    console.log(`[SocketService Placeholder] Emitted socket event: typing`, { conversationId, isTyping });
  }

  online(conversationId: string, isOnline: boolean) {
    console.log(`[SocketService Placeholder] Emitted socket event: user_online`, { conversationId, isOnline });
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    if (this.listeners.has(event)) {
      const filtered = this.listeners.get(event)!.filter((cb) => cb !== callback);
      this.listeners.set(event, filtered);
    }
  }

  private emitLocal(event: string, payload: any) {
    const cbs = this.listeners.get(event) || [];
    cbs.forEach((cb) => cb(payload));
  }
}

export const socketService = SocketService.getInstance();
