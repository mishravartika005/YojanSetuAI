export function errorMiddleware(error, _request, response, _next) {
  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 && process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : error.message || 'Server error';

  response.status(statusCode).json({ success: false, message });
}