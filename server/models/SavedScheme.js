import mongoose from 'mongoose';
const savedSchemeSchema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, scheme: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true } }, { timestamps: true });
export default mongoose.model('SavedScheme', savedSchemeSchema);