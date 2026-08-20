import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';

export async function protect(request, response, next) {
  const authorization = request.headers.authorization;
  if (!authorization?.startsWith('Bearer ') || !env.jwtSecret) {
    return response.status(401).json({ success: false, message: 'Not authorized' });
  }

  try {
    const token = authorization.slice(7).trim();
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.id);
    if (!user) {
      return response.status(401).json({ success: false, message: 'Not authorized' });
    }

    request.user = user;
    return next();
  } catch (_error) {
    return response.status(401).json({ success: false, message: 'Not authorized' });
  }
}