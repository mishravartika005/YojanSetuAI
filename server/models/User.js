import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({ name: String, email: { type: String, unique: true }, password: String, age: Number, gender: String, state: String, district: String, annualIncome: Number, occupation: String, education: String, category: String }, { timestamps: true });
export default mongoose.model('User', userSchema);