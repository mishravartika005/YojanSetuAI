import Scheme from '../models/Scheme.js';
import { getRecommendations as rankRecommendations } from '../services/recommendationService.js';

export async function getRecommendations(request, response) {
  const user = request.user;
  const schemes = await Scheme.find({ isActive: true }).lean();

  const recommendations = rankRecommendations(user, schemes);

  return response.json({
    success: true,
    data: {
      recommendations,
      disclaimer: 'Eligibility predictions are estimates based on your profile and scheme criteria. Final eligibility must be confirmed from the official scheme source.',
    },
  });
}
