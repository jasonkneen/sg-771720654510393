export const OPENAI_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  model: process.env.NEXT_PUBLIC_OPENAI_MODEL || 'gpt-3.5-turbo',
  maxTokens: parseInt(process.env.NEXT_PUBLIC_OPENAI_MAX_TOKENS, 10) || 150,
  temperature: parseFloat(process.env.NEXT_PUBLIC_OPENAI_TEMPERATURE) || 0.7,
};