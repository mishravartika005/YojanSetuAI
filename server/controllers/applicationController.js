import mongoose from 'mongoose';
import Application from '../models/Application.js';
import Scheme from '../models/Scheme.js';

const ALLOWED_STATUSES = [
  'interested',
  'saved',
  'applied',
  'under_review',
  'approved',
  'rejected',
  'completed',
];

export async function createApplication(request, response) {
  const { schemeId, status, notes } = request.body;
  const userId = request.user._id;

  if (!schemeId || !mongoose.Types.ObjectId.isValid(schemeId)) {
    return response.status(400).json({ success: false, message: 'Valid schemeId is required' });
  }

  const scheme = await Scheme.findById(schemeId);
  if (!scheme) {
    return response.status(404).json({ success: false, message: 'Scheme not found' });
  }

  const appStatus = status || 'interested';
  if (!ALLOWED_STATUSES.includes(appStatus)) {
    return response.status(400).json({
      success: false,
      message: `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(', ')}`,
    });
  }

  const application = await Application.create({
    user: userId,
    scheme: schemeId,
    status: appStatus,
    notes: typeof notes === 'string' ? notes.trim() : '',
    appliedAt: appStatus === 'applied' ? new Date() : null,
    lastUpdatedAt: new Date(),
  });

  const populatedApp = await Application.findById(application._id).populate('scheme');

  return response.status(201).json({
    success: true,
    message: 'Application created successfully',
    data: {
      application: populatedApp,
    },
  });
}

export async function getApplications(request, response) {
  const userId = request.user._id;

  const applications = await Application.find({ user: userId })
    .populate('scheme')
    .sort({ updatedAt: -1 });

  return response.json({
    success: true,
    data: {
      applications,
    },
  });
}

export async function getApplicationById(request, response) {
  const { id } = request.params;
  const userId = request.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ success: false, message: 'Invalid application ID' });
  }

  const application = await Application.findOne({ _id: id, user: userId }).populate('scheme');
  if (!application) {
    return response.status(404).json({ success: false, message: 'Application not found' });
  }

  return response.json({
    success: true,
    data: {
      application,
    },
  });
}

export async function updateApplication(request, response) {
  const { id } = request.params;
  const userId = request.user._id;
  const { status, notes } = request.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ success: false, message: 'Invalid application ID' });
  }

  const application = await Application.findOne({ _id: id, user: userId });
  if (!application) {
    return response.status(404).json({ success: false, message: 'Application not found' });
  }

  if (status !== undefined) {
    if (!ALLOWED_STATUSES.includes(status)) {
      return response.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(', ')}`,
      });
    }
    application.status = status;
    if (status === 'applied' && !application.appliedAt) {
      application.appliedAt = new Date();
    }
  }

  if (notes !== undefined) {
    application.notes = typeof notes === 'string' ? notes.trim() : notes;
  }

  application.lastUpdatedAt = new Date();
  await application.save();

  const populatedApp = await Application.findById(application._id).populate('scheme');

  return response.json({
    success: true,
    message: 'Application updated successfully',
    data: {
      application: populatedApp,
    },
  });
}

export async function deleteApplication(request, response) {
  const { id } = request.params;
  const userId = request.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ success: false, message: 'Invalid application ID' });
  }

  const result = await Application.findOneAndDelete({ _id: id, user: userId });
  if (!result) {
    return response.status(404).json({ success: false, message: 'Application not found' });
  }

  return response.json({
    success: true,
    message: 'Application deleted successfully',
  });
}