import express from 'express';
import cors from 'cors';
import { handleChatRoute } from './routes/chat.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Express Middleware for /api/chat Routes
app.all(/^\/api\/chat/, async (req, res) => {
  try {
    const protocol = req.protocol || 'http';
    const host = req.headers.host || `localhost:${PORT}`;
    const fullUrl = `${protocol}://${host}${req.originalUrl || req.url}`;

    const mockRequest = {
      url: fullUrl,
      method: req.method,
      headers: req.headers,
      json: async () => req.body,
    };

    const result = await handleChatRoute(mockRequest);
    return res.status(result.statusCode || 200).json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Express Server Internal Error',
      error: err.message,
    });
  }
});

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({
    name: 'Swift Coffee Backend API Service',
    status: 'Running',
    version: '1.0.0',
    endpoints: [
      'GET /api/chat/conversations',
      'GET /api/chat/messages/:conversationId',
      'POST /api/chat/send',
      'PUT /api/chat/read/:conversationId',
      'PUT /api/chat/typing',
      'PUT /api/chat/online',
      'DELETE /api/chat/message/:id',
      'PUT /api/chat/close/:conversationId',
      'PUT /api/chat/open/:conversationId',
      'GET /api/chat/unread',
    ],
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Swift Coffee Express.js Server running on port ${PORT}`);
  });
}

export default app;
