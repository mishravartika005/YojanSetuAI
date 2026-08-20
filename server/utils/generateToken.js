import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function generateToken(userId) {
  if (!env.jwtSecret) {
    throw new Error('JWT_SECRET is not configured.');
  }

  return jwt.sign({ id: String(userId) }, env.jwtSecret, { expiresIn: '7d' });
}