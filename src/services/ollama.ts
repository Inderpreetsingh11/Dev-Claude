import { getSettings } from './storage';

interface OllamaMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  images?: string[];
}

interface ChatOptions {
  temperature?: number;
  format?: object;
}

export async function chat(
  messages: OllamaMessage[],
  options: ChatOptions = {},
): Promise<string> {
  const settings = getSettings();
  const response = await fetch(`${settings.ollamaUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: settings.modelName,
      messages,
      stream: false,
      format: options.format,
      options: { temperature: options.temperature ?? 0.1 },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json() as { message: { content: string } };
  return data.message.content;
}

export async function checkOllamaHealth(): Promise<boolean> {
  try {
    const settings = getSettings();
    const res = await fetch(`${settings.ollamaUrl}/api/tags`);
    return res.ok;
  } catch {
    return false;
  }
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelay = 1000,
): Promise<T> {
  let lastError: Error | undefined;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      if (attempt < maxAttempts - 1) {
        await new Promise((r) => setTimeout(r, baseDelay * Math.pow(2, attempt)));
      }
    }
  }
  throw lastError;
}
