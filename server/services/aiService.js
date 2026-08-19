import { env } from '../config/env.js';
/** Provider-independent boundary for explanations grounded in verified scheme data. */
export async function explainScheme(_scheme, _question) { if (!env.aiProvider) throw new Error('AI provider is not configured.'); throw new Error('AI integration is not implemented.'); }