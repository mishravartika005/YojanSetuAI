import { evaluateEligibility } from './eligibilityService.js';

/**
 * Evaluates and ranks schemes based on the user's profile.
 *
 * @param {Object} profile - Authenticated user profile object
 * @param {Array} schemes - Array of active scheme documents
 * @returns {Array} Ranked recommendations with score, status, and criteria explanations
 */
export function getRecommendations(profile, schemes = []) {
  const recommendations = schemes.map((scheme) => {
    const evaluation = evaluateEligibility(profile, scheme);
    return {
      scheme,
      score: evaluation.score,
      status: evaluation.status,
      statusLabel: evaluation.statusLabel,
      matchedCriteria: evaluation.matchedCriteria,
      unmatchedCriteria: evaluation.unmatchedCriteria,
    };
  });

  return recommendations.sort((a, b) => b.score - a.score);
}