import { AuditLog } from '../models/index.js';

/**
 * Middleware ghi nhat kyAudit Log
 */
export const auditLogMiddleware = async (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    res.json = originalJson; // Restore
    
    // Ghi async sau khi response gui di
    setImmediate(async () => {
      try {
        if (req.originalUrl && (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE')) {
          const userId = req.user ? String(req.user.id) : null;
          const userEmail = req.user ? req.user.email : null;
          const status = res.statusCode >= 200 && res.statusCode < 400 ? 'SUCCESS' : 'FAILED';
          
          await AuditLog.create({
            userId,
            userEmail,
            action: `${req.method} ${req.originalUrl}`,
            endpoint: req.originalUrl,
            ip: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
            status,
            details: JSON.stringify({ body: req.body, responseMessage: data?.message }),
          }).catch(() => {});
        }
      } catch (err) {
        // Quiet catch to avoid throwing in response
      }
    });

    return originalJson.call(this, data);
  };

  next();
};
