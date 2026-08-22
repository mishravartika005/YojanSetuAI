/**
 * Deterministically evaluates a user profile against a scheme's criteria.
 * Returns an explainable matching score, status, and matched/unmatched explanations.
 *
 * @param {Object} user - Authenticated user profile object
 * @param {Object} scheme - Scheme document object
 * @returns {Object} { score, status, statusLabel, matchedCriteria, unmatchedCriteria }
 */
export function evaluateEligibility(user = {}, scheme = {}) {
  const matchedCriteria = [];
  const unmatchedCriteria = [];

  let totalWeight = 0;
  let earnedScore = 0;

  // 1. Age Evaluation (Weight: 15)
  const ageWeight = 15;
  totalWeight += ageWeight;
  const ageMin = typeof scheme.ageMin === 'number' ? scheme.ageMin : 0;
  const ageMax = typeof scheme.ageMax === 'number' ? scheme.ageMax : 120;
  const hasSpecificAgeRule = ageMin > 0 || ageMax < 120;

  if (user.age !== undefined && user.age !== null) {
    if (user.age >= ageMin && user.age <= ageMax) {
      earnedScore += ageWeight;
      matchedCriteria.push(`Age criterion met (Your age: ${user.age}, Eligible range: ${ageMin} - ${ageMax} years)`);
    } else {
      unmatchedCriteria.push(`Age not in eligible range (Your age: ${user.age}, Required: ${ageMin} - ${ageMax} years)`);
    }
  } else {
    if (!hasSpecificAgeRule) {
      earnedScore += ageWeight;
      matchedCriteria.push('Age criterion: Open to all age groups');
    } else {
      unmatchedCriteria.push(`Age not specified in profile (Required range: ${ageMin} - ${ageMax} years)`);
    }
  }

  // 2. Annual Income Evaluation (Weight: 20)
  const incomeWeight = 20;
  totalWeight += incomeWeight;
  const incomeLimit = scheme.incomeLimit;

  if (incomeLimit === null || incomeLimit === undefined) {
    earnedScore += incomeWeight;
    matchedCriteria.push('Income criterion: No income ceiling limit');
  } else if (user.annualIncome !== undefined && user.annualIncome !== null) {
    if (user.annualIncome <= incomeLimit) {
      earnedScore += incomeWeight;
      matchedCriteria.push(`Annual income within limit (Your income: ₹${user.annualIncome.toLocaleString('en-IN')}, Max limit: ₹${incomeLimit.toLocaleString('en-IN')})`);
    } else {
      unmatchedCriteria.push(`Annual income exceeds limit (Your income: ₹${user.annualIncome.toLocaleString('en-IN')}, Max limit: ₹${incomeLimit.toLocaleString('en-IN')})`);
    }
  } else {
    unmatchedCriteria.push(`Annual income not specified in profile (Scheme income ceiling: ₹${incomeLimit.toLocaleString('en-IN')})`);
  }

  // 3. State / Location Evaluation (Weight: 15)
  const stateWeight = 15;
  totalWeight += stateWeight;
  const eligibleStates = Array.isArray(scheme.eligibleStates) ? scheme.eligibleStates : [];
  const isCentral = scheme.level === 'central' || eligibleStates.some(s => s.toLowerCase() === 'all');
  const targetState = scheme.state;

  if (isCentral && (!targetState || eligibleStates.some(s => s.toLowerCase() === 'all'))) {
    earnedScore += stateWeight;
    matchedCriteria.push('Location criterion: Pan-India (All states and union territories eligible)');
  } else {
    const userState = user.state ? user.state.trim().toLowerCase() : null;
    const schemeStateLower = targetState ? targetState.trim().toLowerCase() : null;
    const eligibleStatesLower = eligibleStates.map(s => s.trim().toLowerCase());

    const isStateMatch = userState && (
      userState === schemeStateLower ||
      eligibleStatesLower.includes(userState)
    );

    if (isStateMatch) {
      earnedScore += stateWeight;
      matchedCriteria.push(`State requirement met (${user.state})`);
    } else if (user.state) {
      unmatchedCriteria.push(`State-specific scheme for ${targetState || eligibleStates.join(', ')} (Your state: ${user.state})`);
    } else {
      unmatchedCriteria.push(`State not specified in profile (Required: ${targetState || eligibleStates.join(', ')})`);
    }
  }

  // 4. Gender Evaluation (Weight: 10)
  const genderWeight = 10;
  totalWeight += genderWeight;
  const eligibleGenders = Array.isArray(scheme.eligibleGenders)
    ? scheme.eligibleGenders.map(g => g.toLowerCase())
    : ['all'];
  const isOpenToAllGenders = eligibleGenders.includes('all') || eligibleGenders.length === 0;

  if (isOpenToAllGenders) {
    earnedScore += genderWeight;
    matchedCriteria.push('Gender criterion: Open to all genders');
  } else if (user.gender) {
    const userGender = user.gender.trim().toLowerCase();
    if (eligibleGenders.includes(userGender)) {
      earnedScore += genderWeight;
      matchedCriteria.push(`Gender requirement met (${user.gender})`);
    } else {
      unmatchedCriteria.push(`Gender-specific scheme for ${eligibleGenders.join(', ')} (Your gender: ${user.gender})`);
    }
  } else {
    unmatchedCriteria.push(`Gender not specified in profile (Required: ${eligibleGenders.join(', ')})`);
  }

  // 5. Social Category Evaluation (Weight: 15)
  const categoryWeight = 15;
  totalWeight += categoryWeight;
  const eligibleCategories = Array.isArray(scheme.eligibleCategories)
    ? scheme.eligibleCategories.map(c => c.toLowerCase())
    : ['all'];
  const isOpenToAllCategories = eligibleCategories.includes('all') || eligibleCategories.length === 0;

  if (isOpenToAllCategories) {
    earnedScore += categoryWeight;
    matchedCriteria.push('Social category: Open to all categories');
  } else if (user.category) {
    const userCategory = user.category.trim().toLowerCase();
    if (eligibleCategories.includes(userCategory)) {
      earnedScore += categoryWeight;
      matchedCriteria.push(`Social category requirement met (${user.category})`);
    } else {
      unmatchedCriteria.push(`Category-specific scheme for ${eligibleCategories.join(', ')} (Your category: ${user.category})`);
    }
  } else {
    unmatchedCriteria.push(`Social category not specified in profile (Required: ${eligibleCategories.join(', ')})`);
  }

  // 6. Occupation Evaluation (Weight: 15)
  const occupationWeight = 15;
  totalWeight += occupationWeight;
  const eligibleOccupations = Array.isArray(scheme.eligibleOccupations)
    ? scheme.eligibleOccupations.map(o => o.toLowerCase())
    : ['all'];
  const isOpenToAllOccupations = eligibleOccupations.includes('all') || eligibleOccupations.length === 0;

  if (isOpenToAllOccupations) {
    earnedScore += occupationWeight;
    matchedCriteria.push('Occupation criterion: Open to all occupations');
  } else if (user.occupation) {
    const userOcc = user.occupation.trim().toLowerCase();
    if (eligibleOccupations.includes(userOcc)) {
      earnedScore += occupationWeight;
      matchedCriteria.push(`Occupation requirement met (${user.occupation})`);
    } else {
      unmatchedCriteria.push(`Occupation-specific scheme for ${eligibleOccupations.join(', ')} (Your occupation: ${user.occupation})`);
    }
  } else {
    unmatchedCriteria.push(`Occupation not specified in profile (Required: ${eligibleOccupations.join(', ')})`);
  }

  // 7. Education Evaluation (Weight: 10)
  const educationWeight = 10;
  totalWeight += educationWeight;
  const eligibleEducation = Array.isArray(scheme.eligibleEducation)
    ? scheme.eligibleEducation.map(e => e.toLowerCase())
    : ['all'];
  const isOpenToAllEducation = eligibleEducation.includes('all') || eligibleEducation.length === 0;

  if (isOpenToAllEducation) {
    earnedScore += educationWeight;
    matchedCriteria.push('Education criterion: Open to all education levels');
  } else if (user.education) {
    const userEdu = user.education.trim().toLowerCase();
    if (eligibleEducation.includes(userEdu)) {
      earnedScore += educationWeight;
      matchedCriteria.push(`Education requirement met (${user.education})`);
    } else {
      unmatchedCriteria.push(`Education-specific scheme for ${eligibleEducation.join(', ')} (Your education: ${user.education})`);
    }
  } else {
    unmatchedCriteria.push(`Education not specified in profile (Required: ${eligibleEducation.join(', ')})`);
  }

  // Calculate final score percentage (0-100)
  const score = Math.round((earnedScore / totalWeight) * 100);

  const matched = [...matchedCriteria];
  const unmatched = [];
  const missing = [];

  for (const criterion of unmatchedCriteria) {
    if (criterion.includes('not specified in profile')) {
      missing.push(criterion);
    } else {
      unmatched.push(criterion);
    }
  }

  let status = 'likely_match';
  let statusLabel = 'Likely match';

  if (unmatched.length > 0) {
    status = 'not_a_match';
    statusLabel = 'Not a match';
  } else if (missing.length > 0) {
    status = 'needs_more_info';
    statusLabel = 'Needs more information';
  }

  return {
    score,
    status,
    statusLabel,
    matchedCriteria: matched,
    unmatchedCriteria: unmatched,
    missingCriteria: missing,
  };
}

export function calculateEligibility(profile, criteria) {
  return evaluateEligibility(profile, criteria);
}