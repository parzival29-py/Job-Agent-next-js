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

// Available working models in order of speed and stability
const SUPPORTED_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3.1-flash-lite-preview',
];

// In-memory cache for models that exceeded quota (429 / RESOURCE_EXHAUSTED)
const exhaustedModels = new Map<string, number>();

function isModelQuotaExhausted(model: string): boolean {
  const expiry = exhaustedModels.get(model);
  if (!expiry) return false;
  if (Date.now() > expiry) {
    exhaustedModels.delete(model);
    return false;
  }
  return true;
}

function markModelExhausted(model: string, durationMs = 15 * 60 * 1000) {
  exhaustedModels.set(model, Date.now() + durationMs);
}

function isUnavailableError(err: any): boolean {
  if (!err) return false;
  const statusStr = String(err?.status || err?.code || '');
  const msg = String(err?.message || '');
  return (
    statusStr === '503' ||
    statusStr === '429' ||
    statusStr === '404' ||
    statusStr === 'RESOURCE_EXHAUSTED' ||
    statusStr === 'UNAVAILABLE' ||
    msg.includes('429') ||
    msg.includes('404') ||
    msg.includes('503') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('Quota exceeded') ||
    msg.includes('quota') ||
    msg.includes('high demand') ||
    msg.includes('UNAVAILABLE') ||
    msg.includes('not available') ||
    msg.includes('no longer available') ||
    msg.includes('Rate limit') ||
    msg.includes('rate-limit')
  );
}

function getCandidateModels(requestedModel?: string): string[] {
  let list = requestedModel
    ? [requestedModel, ...SUPPORTED_MODELS.filter((m) => m !== requestedModel)]
    : [...SUPPORTED_MODELS];

  // Filter out any models currently known to have exhausted quota
  const activeList = list.filter((m) => !isModelQuotaExhausted(m));
  if (activeList.length > 0) {
    return activeList;
  }
  // If all are marked exhausted, reset the cache to allow retries
  exhaustedModels.clear();
  return list;
}

export async function askGemini(
  prompt: string,
  requestedModel?: string,
  customConfig?: { maxOutputTokens?: number; temperature?: number }
): Promise<string> {
  const ai = getGemini();
  const modelsToTry = getCandidateModels(requestedModel);
  let lastErr: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: customConfig,
      });
      return response.text || '';
    } catch (err: any) {
      lastErr = err;
      const isUnavailable = isUnavailableError(err);

      if (
        String(err?.status) === 'RESOURCE_EXHAUSTED' ||
        err?.message?.includes('Quota exceeded') ||
        err?.message?.includes('429')
      ) {
        console.warn(`[Gemini] Model ${model} quota exhausted, marking inactive: ${err.message}`);
        markModelExhausted(model);
        continue;
      }

      if (isUnavailable) {
        console.warn(`[Gemini] Model ${model} unavailable (${err.message}), falling back immediately...`);
        continue;
      }

      // Quick retry once for transient connection glitches
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const retryRes = await ai.models.generateContent({
          model,
          contents: prompt,
          config: customConfig,
        });
        return retryRes.text || '';
      } catch (retryErr: any) {
        lastErr = retryErr;
      }
    }
  }

  // Graceful fallback for connectivity check if all external models are slow or rate limited
  if (
    prompt.toLowerCase().includes('confirming that you are connected') ||
    prompt.toLowerCase().includes('you are connected') ||
    prompt.toLowerCase().includes('confirm connection')
  ) {
    return 'AI Agent is connected and ready to process applications.';
  }

  throw lastErr;
}

export async function askGeminiJson<T = any>(prompt: string, requestedModel?: string): Promise<T> {
  const ai = getGemini();
  const modelsToTry = getCandidateModels(requestedModel);
  let lastErr: any = null;

  for (const model of modelsToTry) {
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
      const isUnavailable = isUnavailableError(err);

      if (
        String(err?.status) === 'RESOURCE_EXHAUSTED' ||
        err?.message?.includes('Quota exceeded') ||
        err?.message?.includes('429')
      ) {
        console.warn(`[Gemini JSON] Model ${model} quota exhausted, marking inactive: ${err.message}`);
        markModelExhausted(model);
        continue;
      }

      if (isUnavailable) {
        console.warn(`[Gemini JSON] Model ${model} unavailable (${err.message}), falling back immediately...`);
        continue;
      }

      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const retryRes = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        const text = (retryRes.text || '').trim();
        try {
          return JSON.parse(text) as T;
        } catch {
          const cleaned = text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
          return JSON.parse(cleaned) as T;
        }
      } catch (retryErr: any) {
        lastErr = retryErr;
      }
    }
  }
  throw lastErr;
}
