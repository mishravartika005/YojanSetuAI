import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';

const DEFAULT_SYSTEM_PROMPT = [
	'You explain verified government scheme information in simple, neutral language using short sentences.',
	'Avoid unnecessary technical terms, and explain government terminology in simple words when needed.',
	'Use bullet points to clearly separate important information.',
	'Preserve complete factual accuracy, but avoid unnecessarily complicated words.',
	'For Hindi and Marathi, write in natural, simple, colloquial language rather than a word-for-word translation.',
	'Use only the supplied scheme context and user question.',
	'Do not make or imply an official eligibility decision.',
	'Say when the supplied information is insufficient and direct the user to the official source.',
].join(' ');

export class AIServiceError extends Error {
	constructor(message, statusCode = 502) {
		super(message);
		this.name = 'AIServiceError';
		this.statusCode = statusCode;
	}
}

function getSchemeContext(scheme = {}) {
	const context = {
		name: scheme.name,
		shortDescription: scheme.shortDescription,
		description: scheme.description,
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

	return Object.fromEntries(Object.entries(context).filter(([, value]) => value !== undefined && value !== null));
}

function getProviderErrorMessage(error) {
	const status = error?.status || error?.code;

	if (status === 429) {
		return 'AI service rate limit reached.';
	}

	if (status === 401 || status === 403) {
		return 'AI service authentication failed.';
	}

	return 'AI provider request failed.';
}

export async function generateAIResponse(prompt, options = {}) {
	if (typeof prompt !== 'string' || !prompt.trim()) {
		throw new AIServiceError('A prompt is required.', 400);
	}

	if (!env.geminiApiKey) {
		throw new AIServiceError('AI service is not configured.', 503);
	}

	const model = options.model || env.geminiModel;
	const timeoutMs = options.timeoutMs || env.aiTimeoutMs;
	const ai = new GoogleGenAI({ apiKey: env.geminiApiKey });
	const languageInstruction = options.language === 'hi'
		? ' You must respond only in Hindi (हिंदी).'
		: options.language === 'mr'
		? ' You must respond only in Marathi (मराठी).'
		: ' You must respond only in English.';

	let providerResponse;
	try {
		providerResponse = await Promise.race([
			ai.models.generateContent({
				model,
				contents: prompt.trim(),
				config: {
					systemInstruction: (options.systemPrompt || DEFAULT_SYSTEM_PROMPT) + languageInstruction,
					temperature: options.temperature ?? 0.2,
				},
			}),
			new Promise((_, reject) => {
				const timeout = setTimeout(() => reject(new AIServiceError('AI service request timed out.', 504)), Math.max(1000, timeoutMs));
				timeout.unref?.();
			}),
		]);
	} catch (error) {
		console.error('Gemini API call failed:', error);
		if (error instanceof AIServiceError) {
			throw error;
		}
		throw new AIServiceError(getProviderErrorMessage(error), error?.status === 429 ? 429 : 502);
	}

	const content = providerResponse?.text;
	if (typeof content !== 'string' || !content.trim()) {
		throw new AIServiceError('AI provider returned an invalid response.');
	}

	return content.trim();
}

export async function explainScheme(scheme, question) {
	const context = JSON.stringify(getSchemeContext(scheme), null, 2);
	const prompt = [
		'Explain the following verified government scheme information for a citizen.',
		'Keep the answer concise and distinguish scheme facts from general guidance.',
		`Scheme context:\n${context}`,
		`Citizen question:\n${question || 'Summarize the benefits, key requirements, and application process.'}`,
	].join('\n\n');

	return generateAIResponse(prompt);
}