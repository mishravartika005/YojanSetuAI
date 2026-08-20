import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    ministry: {
      type: String,
      trim: true,
    },
    level: {
      type: String,
      enum: ['central', 'state'],
      required: true,
      default: 'central',
    },
    state: {
      type: String,
      trim: true,
      default: null,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    schemeType: {
      type: String,
      trim: true,
    },
    benefits: {
      type: [String],
      default: [],
    },
    eligibility: {
      type: String,
      trim: true,
    },
    ageMin: {
      type: Number,
      min: 0,
      max: 120,
      default: 0,
    },
    ageMax: {
      type: Number,
      min: 0,
      max: 120,
      default: 120,
    },
    incomeLimit: {
      type: Number,
      min: 0,
      default: null,
    },
    eligibleGenders: {
      type: [String],
      default: ['all'],
    },
    eligibleCategories: {
      type: [String],
      default: ['all'],
    },
    eligibleOccupations: {
      type: [String],
      default: ['all'],
    },
    eligibleEducation: {
      type: [String],
      default: ['all'],
    },
    eligibleStates: {
      type: [String],
      default: ['all'],
    },
    requiredDocuments: {
      type: [String],
      default: [],
    },
    applicationProcess: {
      type: String,
      trim: true,
    },
    applicationUrl: {
      type: String,
      trim: true,
    },
    officialSource: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

schemeSchema.index({ category: 1, level: 1, state: 1, isActive: 1 });

export default mongoose.model('Scheme', schemeSchema);