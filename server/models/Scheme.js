import mongoose from 'mongoose';
const schemeSchema = new mongoose.Schema({ name: String, description: String, category: String, state: String, benefits: [String], eligibility: mongoose.Schema.Types.Mixed, documents: [String], applicationSteps: [String], officialUrl: String }, { timestamps: true });
export default mongoose.model('Scheme', schemeSchema);