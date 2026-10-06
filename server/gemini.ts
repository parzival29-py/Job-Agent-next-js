import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

export function getGemini(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY || '';
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

const SUPPORTED_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];

export async function askGemini(prompt: string, requestedModel?: string): Promise<string> {
  const ai = getGemini();
  const modelsToTry = requestedModel ? [requestedModel, ...SUPPORTED_MODELS.filter((m) => m !== requestedModel)] : SUPPORTED_MODELS;
  let lastErr: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });
        return response.text || '';
      } catch (err: any) {
        lastErr = err;
        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
      }
    }
  }
  throw lastErr;
}

export async function askGeminiJson<T = any>(prompt: string, requestedModel?: string): Promise<T> {
  const ai = getGemini();
  const modelsToTry = requestedModel ? [requestedModel, ...SUPPORTED_MODELS.filter((m) => m !== requestedModel)] : SUPPORTED_MODELS;
  let lastErr: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        const text = (response.text || '').trim();
        try {
          return JSON.parse(text) as T;
        } catch {
          const cleaned = text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
          return JSON.parse(cleaned) as T;
        }
      } catch (err: any) {
        lastErr = err;
        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
      }
    }
  }
  throw lastErr;
}
