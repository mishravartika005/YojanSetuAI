import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import schemeRoutes from './routes/schemeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

const app = express();
app.use(cors()); app.use(express.json());
app.get('/health', (_request, response) => response.json({ status: 'ok' }));
app.use('/api/auth', authRoutes); app.use('/api/users', userRoutes); app.use('/api/schemes', schemeRoutes);
app.use('/api/ai', aiRoutes); app.use('/api/applications', applicationRoutes); app.use(errorMiddleware);
app.listen(env.port, () => console.log(`YojanSetu API listening on port ${env.port}`));
export default app;