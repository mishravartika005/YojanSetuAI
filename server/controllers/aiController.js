import Scheme from '../models/Scheme.js';
import { getRecommendations } from '../services/recommendationService.js';
import { generateAIResponse } from '../services/aiService.js';

const MAX_MESSAGE_LENGTH = 2000;

function safeProfile(user = {}) {
	return {
		age: user.age,
		gender: user.gender,
		state: user.state,
		district: user.district,
		annualIncome: user.annualIncome,
		occupation: user.occupation,
		education: user.education,
		category: user.category,
		preferredLanguage: user.preferredLanguage,
	};
}

function safeScheme(scheme = {}) {
	return {
		name: scheme.name,
		shortDescription: scheme.shortDescription,
		ministry: scheme.ministry,
		level: scheme.level,
		state: scheme.state,
		category: scheme.category,
		schemeType: scheme.schemeType,
		benefits: scheme.benefits,
		eligibility: scheme.eligibility,
		requiredDocuments: scheme.requiredDocuments,
		applicationProcess: scheme.applicationProcess,
		applicationUrl: scheme.applicationUrl,
		officialSource: scheme.officialSource,
	};
}

export async function askQuestion(request, response) {
	const { message, language } = request.body || {};

	if (typeof message !== 'string' || !message.trim()) {
		return response.status(400).json({ success: false, message: 'Message is required' });
	}

	if (message.trim().length > MAX_MESSAGE_LENGTH) {
		return response.status(400).json({ success: false, message: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer` });
	}

	const schemes = await Scheme.find({ isActive: true }).lean();
	const recommendations = getRecommendations(request.user, schemes)
		.slice(0, 10)
		.map((recommendation) => ({
			scheme: safeScheme(recommendation.scheme),
			score: recommendation.score,
			status: recommendation.status,
			statusLabel: recommendation.statusLabel,
			matchedCriteria: recommendation.matchedCriteria,
			unmatchedCriteria: recommendation.unmatchedCriteria,
		}));

	const prompt = [
		'Answer the citizen question using only the verified context below.',
		'Explain scheme information clearly and do not claim that a citizen is officially eligible.',
		'The deterministic score and status are guidance only; final eligibility must be confirmed with the official source.',
		`Citizen question:\n${message.trim()}`,
		`Relevant profile fields:\n${JSON.stringify(safeProfile(request.user), null, 2)}`,
		`Deterministic recommendation context:\n${JSON.stringify(recommendations, null, 2)}`,
	].join('\n\n');

	const answer = await generateAIResponse(prompt, { language });

	return response.json({
		success: true,
		data: {
			message: answer,
		},
	});
}

export async function navigateNeed(request, response) {
  const { textNeed, selectedCategory } = request.body || {};

  let category = selectedCategory ? selectedCategory.trim().toLowerCase() : null;
  let keywords = '';

  const allowedCategories = ['agriculture', 'education', 'employment', 'healthcare', 'housing', 'skill_development', 'women'];

  if (textNeed && textNeed.trim()) {
    const prompt = [
      'You are a classification assistant for Indian government schemes.',
      'Analyze the following citizen query expressing a public service need:',
      `"${textNeed.trim()}"`,
      '',
      'Classify it into one of these exact categories: agriculture, education, employment, healthcare, housing, skill_development, women.',
      'Also extract 1-3 key terms for searching schemes related to this need.',
      'Respond ONLY with a valid JSON object. Do not include markdown code blocks, backticks, or any explanation.',
      'Format:',
      '{ "category": "agriculture", "keywords": "financial support" }'
    ].join('\n');

    try {
      const aiResponse = await generateAIResponse(prompt);
      const cleanJson = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed.category) {
        category = parsed.category.toLowerCase().trim();
      }
      if (parsed.keywords) {
        keywords = parsed.keywords.trim();
      }
    } catch (err) {
      console.error('Gemini navigator classification failed, falling back to selectedCategory:', err);
    }
  }

  // Synonyms/Mapping
  if (category === 'farming') category = 'agriculture';
  else if (category === 'women & child welfare') category = 'women';
  else if (category === 'small business') category = 'employment';
  else if (category === 'disability support') category = 'healthcare';

  // Query schemes from DB
  const query = { isActive: true };
  if (category && allowedCategories.includes(category)) {
    query.category = category;
  }

  let schemes = await Scheme.find(query).lean();

  // If we have keywords, calculate match weights
  if (keywords && schemes.length > 0) {
    const keywordArray = keywords.toLowerCase().split(/\s+/).filter(k => k.length > 2);
    if (keywordArray.length > 0) {
      schemes = schemes.map(scheme => {
        let weight = 0;
        const nameLower = scheme.name.toLowerCase();
        const descLower = (scheme.description || scheme.shortDescription || '').toLowerCase();
        keywordArray.forEach(word => {
          if (nameLower.includes(word)) weight += 10;
          if (descLower.includes(word)) weight += 2;
        });
        return { ...scheme, searchWeight: weight };
      });
      
      const matched = schemes.filter(s => s.searchWeight > 0);
      if (matched.length > 0) {
        schemes = matched;
      }
    }
  }

  // Run through recommendation evaluation engine
  const recommendations = getRecommendations(request.user, schemes);

  return response.json({
    success: true,
    data: {
      category,
      keywords,
      recommendations,
    }
  });
}