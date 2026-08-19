import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
export function generateToken(payload) { if (!env.jwtSecret) throw new Error('JWT_SECRET is not configured.'); return jwt.sign(payload, env.jwtSecret, { expiresIn: '7d' }); }