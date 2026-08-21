import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    scheme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scheme',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: [
        'interested',
        'saved',
        'applied',
        'under_review',
        'approved',
        'rejected',
        'completed',
      ],
      default: 'interested',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    appliedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

applicationSchema.index({ user: 1, scheme: 1 });

export default mongoose.model('Application', applicationSchema);
