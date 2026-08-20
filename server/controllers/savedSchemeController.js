import mongoose from 'mongoose';
import SavedScheme from '../models/SavedScheme.js';
import Scheme from '../models/Scheme.js';

export async function saveScheme(request, response) {
  const { schemeId } = request.params;
  const userId = request.user._id;

  if (!mongoose.Types.ObjectId.isValid(schemeId)) {
    return response.status(400).json({ success: false, message: 'Invalid scheme ID' });
  }

  const scheme = await Scheme.findById(schemeId);
  if (!scheme) {
    return response.status(404).json({ success: false, message: 'Scheme not found' });
  }

  if (!scheme.isActive) {
    return response.status(400).json({ success: false, message: 'Cannot save an inactive scheme' });
  }

  // Application-level duplicate check
  const existing = await SavedScheme.findOne({ user: userId, scheme: schemeId });
  if (existing) {
    return response.status(200).json({
      success: true,
      message: 'Scheme is already saved',
      data: {
        savedScheme: existing,
      },
    });
  }

  try {
    const savedScheme = await SavedScheme.create({
      user: userId,
      scheme: schemeId,
    });

    return response.status(201).json({
      success: true,
      message: 'Scheme saved successfully',
      data: {
        savedScheme,
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      const alreadySaved = await SavedScheme.findOne({ user: userId, scheme: schemeId });
      return response.status(200).json({
        success: true,
        message: 'Scheme is already saved',
        data: {
          savedScheme: alreadySaved,
        },
      });
    }
    throw error;
  }
}

export async function removeSavedScheme(request, response) {
  const { schemeId } = request.params;
  const userId = request.user._id;

  if (!mongoose.Types.ObjectId.isValid(schemeId)) {
    return response.status(400).json({ success: false, message: 'Invalid scheme ID' });
  }

  const result = await SavedScheme.findOneAndDelete({ user: userId, scheme: schemeId });
  if (!result) {
    return response.status(404).json({ success: false, message: 'Saved scheme not found' });
  }

  return response.json({
    success: true,
    message: 'Saved scheme removed successfully',
  });
}

export async function getSavedSchemes(request, response) {
  const userId = request.user._id;

  const savedRecords = await SavedScheme.find({ user: userId })
    .populate('scheme')
    .sort({ createdAt: -1 });

  const schemes = savedRecords
    .filter(record => record.scheme)
    .map(record => ({
      ...record.scheme.toObject(),
      savedAt: record.createdAt,
    }));

  return response.json({
    success: true,
    data: {
      schemes,
    },
  });
}

export async function checkSavedScheme(request, response) {
  const { schemeId } = request.params;
  const userId = request.user._id;

  if (!mongoose.Types.ObjectId.isValid(schemeId)) {
    return response.status(400).json({ success: false, message: 'Invalid scheme ID' });
  }

  const saved = await SavedScheme.exists({ user: userId, scheme: schemeId });

  return response.json({
    success: true,
    data: {
      saved: !!saved,
    },
  });
}
