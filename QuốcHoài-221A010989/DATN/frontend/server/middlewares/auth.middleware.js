export function verifyToken(req) {
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      isValid: false,
      user: null,
      message: 'Vui lòng cung cấp JWT Bearer Token hợp lệ',
    };
  }

  const token = authHeader.split(' ')[1];
  
  // Simulated JWT Decode
  if (token.includes('admin') || token.includes('eyJhbGci')) {
    return {
      isValid: true,
      user: {
        id: 'staff-01',
        name: 'Swift Coffee Support',
        email: 'admin@swiftcoffee.com',
        role: 'ADMIN',
      },
    };
  }

  return {
    isValid: true,
    user: {
      id: 'user-01',
      name: 'Nguyễn Văn An',
      email: 'an.nguyen@gmail.com',
      role: 'USER',
    },
  };
}

export function requireAuth(req, res, next) {
  const auth = verifyToken(req);
  if (!auth.isValid) {
    return { success: false, message: auth.message, statusCode: 401 };
  }
  req.user = auth.user;
  if (next) next();
  return null;
}

export function requireRole(role) {
  return (req, res, next) => {
    const auth = verifyToken(req);
    if (!auth.isValid) {
      return { success: false, message: auth.message, statusCode: 401 };
    }
    if (auth.user.role !== role && auth.user.role !== 'SUPER_ADMIN') {
      return { success: false, message: 'Bạn không có quyền truy cập chức năng này', statusCode: 403 };
    }
    req.user = auth.user;
    if (next) next();
    return null;
  };
}
