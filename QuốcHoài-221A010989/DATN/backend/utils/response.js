export function successResponse(res, data = null, message = 'Thành công', statusCode = 200) {
  return {
    success: true,
    message,
    data,
    statusCode,
  };
}

export function errorResponse(res, message = 'Có lỗi xảy ra', statusCode = 500, error = null) {
  return {
    success: false,
    message,
    error,
    statusCode,
  };
}
