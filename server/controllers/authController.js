import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { isEmail } from '../utils/validators.js';
import { generateToken } from '../utils/generateToken.js';

function safeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    age: user.age,
    gender: user.gender,
    state: user.state,
    district: user.district,
    annualIncome: user.annualIncome,
    occupation: user.occupation,
    education: user.education,
    category: user.category,
    preferredLanguage: user.preferredLanguage,
  };
}

function authenticationError() {
  const error = new Error('Invalid email or password');
  error.statusCode = 401;
  return error;
}

export async function register(request, response) {
  const { name, email, password, ...profile } = request.body;

  if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !isEmail(email.trim()) || typeof password !== 'string' || password.length < 6) {
    return response.status(400).json({ success: false, message: 'Name, a valid email, and a password of at least 6 characters are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return response.status(409).json({ success: false, message: 'An account with this email already exists' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      ...profile,
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    return response.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user: safeUser(user), token: generateToken(user._id) },
    });
  } catch (error) {
    if (error?.code === 11000) {
      return response.status(409).json({ success: false, message: 'An account with this email already exists' });
    }
    throw error;
  }
}

export async function login(request, response) {
  const { email, password } = request.body;
  if (typeof email !== 'string' || !isEmail(email.trim()) || typeof password !== 'string' || !password) {
    throw authenticationError();
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw authenticationError();
  }

  return response.json({
    success: true,
    message: 'Login successful',
    data: { user: safeUser(user), token: generateToken(user._id) },
  });
}

export async function me(request, response) {
  return response.json({ success: true, data: { user: safeUser(request.user) } });
}