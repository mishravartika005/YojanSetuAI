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
	const { message } = request.body || {};

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

	const answer = await generateAIResponse(prompt);

	return response.json({
		success: true,
		data: {
			message: answer,
		},
	});
}