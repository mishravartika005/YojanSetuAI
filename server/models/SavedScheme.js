import mongoose from 'mongoose';

const savedSchemeSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  },
);

// Compound unique index preventing duplicate saves per user per scheme
savedSchemeSchema.index({ user: 1, scheme: 1 }, { unique: true });

export default mongoose.model('SavedScheme', savedSchemeSchema);