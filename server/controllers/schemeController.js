import mongoose from 'mongoose';
import Scheme from '../models/Scheme.js';
import { evaluateEligibility } from '../services/eligibilityService.js';

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function listSchemes(request, response) {
  const { state, category, schemeType, level } = request.query;
  const page = Math.max(1, parseInt(request.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(request.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const query = { isActive: true };

  if (category) {
    query.category = category.trim().toLowerCase();
  }

  if (level) {
    query.level = level.trim().toLowerCase();
  }

  if (schemeType) {
    query.schemeType = { $regex: new RegExp(`^${escapeRegex(schemeType.trim())}$`, 'i') };
  }

  if (state) {
    const stateRegex = new RegExp(`^${escapeRegex(state.trim())}$`, 'i');
    query.$or = [
      { state: stateRegex },
      { eligibleStates: { $in: [stateRegex, 'all', 'All'] } },
    ];
  }

  const [schemes, total] = await Promise.all([
    Scheme.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Scheme.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit) || (total === 0 ? 0 : 1);

  return response.json({
    success: true,
    data: {
      schemes,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    },
  });
}

export async function getScheme(request, response) {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(404).json({ success: false, message: 'Scheme not found' });
  }

  const scheme = await Scheme.findOne({ _id: id, isActive: true });
  if (!scheme) {
    return response.status(404).json({ success: false, message: 'Scheme not found' });
  }

  let eligibility = null;
  if (request.user) {
    const evaluation = evaluateEligibility(request.user, scheme);
    eligibility = {
      score: evaluation.score,
      status: evaluation.status,
      statusLabel: evaluation.statusLabel,
      matchedCriteria: evaluation.matchedCriteria,
      unmatchedCriteria: evaluation.unmatchedCriteria,
      missingCriteria: evaluation.missingCriteria,
      disclaimer: 'Preliminary guidance only. Final eligibility is determined by the relevant government authority.'
    };
  }

  return response.json({
    success: true,
    data: {
      scheme,
      eligibility,
    },
  });
}

export async function searchSchemes(request, response) {
  const { q } = request.query;
  const page = Math.max(1, parseInt(request.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(request.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  if (!q || !q.trim()) {
    return response.json({
      success: true,
      data: {
        schemes: [],
        pagination: {
          total: 0,
          page,
          limit,
          totalPages: 0,
        },
      },
    });
  }

  const sanitized = escapeRegex(q.trim());
  const regex = new RegExp(sanitized, 'i');

  const query = {
    isActive: true,
    $or: [
      { name: regex },
      { shortDescription: regex },
      { description: regex },
      { ministry: regex },
      { category: regex },
      { schemeType: regex },
      { benefits: regex },
      { eligibility: regex },
      { eligibleOccupations: regex },
    ],
  };

  const [schemes, total] = await Promise.all([
    Scheme.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Scheme.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit) || (total === 0 ? 0 : 1);

  return response.json({
    success: true,
    data: {
      schemes,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    },
  });
}