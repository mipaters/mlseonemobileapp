export class CitoApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "CitoApiError";
    this.status = status;
  }
}

export interface CitoApiHistoryEntry {
  role: "user" | "assistant";
  content: string;
}

interface FetchCitoReplyArgs {
  message: string;
  journeyHint: string | null;
  history: CitoApiHistoryEntry[];
  profileName?: string;
}

/**
 * Calls the Azure Functions-backed `/api/cito-chat` endpoint for a real,
 * Azure OpenAI-generated reply. Throws `CitoApiError` on any failure
 * (not configured, network error, upstream error) so callers can fall
 * back to the local scripted response.
 */
export async function fetchCitoReply({ message, journeyHint, history, profileName }: FetchCitoReplyArgs): Promise<string> {
  let response: Response;
  try {
    response = await fetch("/api/cito-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, journeyHint, history, profileName }),
    });
  } catch (err) {
    throw new CitoApiError(`Network error contacting Cito API: ${(err as Error).message}`);
  }

  if (!response.ok) {
    let detail = "";
    try {
      const body = await response.json();
      detail = body?.error ?? "";
    } catch {
      // ignore - body may not be JSON
    }
    throw new CitoApiError(detail || `Cito API responded with ${response.status}`, response.status);
  }

  const data = await response.json();
  if (typeof data?.reply !== "string" || !data.reply) {
    throw new CitoApiError("Cito API returned an empty reply.");
  }

  return data.reply;
}
