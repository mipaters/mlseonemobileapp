const { app } = require("@azure/functions");

const DEFAULT_API_VERSION = "2024-06-01";

/**
 * Secure server-side proxy to Azure OpenAI chat completions.
 * The Azure OpenAI key never reaches the browser; it is read from
 * Application Settings configured on the Azure Static Web App / Function App.
 */
app.http("citoChat", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "cito-chat",
  handler: async (request, context) => {
    let body;
    try {
      body = await request.json();
    } catch {
      return { status: 400, jsonBody: { error: "Request body must be JSON." } };
    }

    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const history = Array.isArray(body?.history) ? body.history : [];
    const profileName = typeof body?.profileName === "string" ? body.profileName : "Mike";
    const journeyHint = typeof body?.journeyHint === "string" ? body.journeyHint : null;

    if (!message) {
      return { status: 400, jsonBody: { error: "message is required." } };
    }

    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION || DEFAULT_API_VERSION;

    if (!endpoint || !apiKey || !deployment) {
      context.warn("Azure OpenAI is not fully configured (missing endpoint/key/deployment).");
      return {
        status: 503,
        jsonBody: { error: "Azure OpenAI is not configured on the server." },
      };
    }

    const systemPrompt = [
      `You are Cito, the friendly AI concierge inside the "MLSE One" fan app.`,
      `You are speaking with ${profileName}, a fan who follows the Toronto Maple Leafs (NHL) and Toronto Blue Jays (MLB).`,
      "Keep replies conversational, concise (2-4 sentences), upbeat, and specific to Toronto sports, game day, rewards, highlights, tickets, or merchandise.",
      "This is a fictional concept demo — all game, ticket, and reward data is illustrative, not real.",
      journeyHint ? `The app has already matched this request to the "${journeyHint}" experience, which will render as a card below your reply — keep your reply complementary to that, not redundant with a list.` : "",
    ]
      .filter(Boolean)
      .join(" ");

    const messages = [
      { role: "system", content: systemPrompt },
      ...history
        .filter((entry) => entry && (entry.role === "user" || entry.role === "assistant") && typeof entry.content === "string")
        .slice(-8),
      { role: "user", content: message },
    ];

    const url = `${endpoint.replace(/\/$/, "")}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          messages,
          temperature: 0.7,
          max_tokens: 300,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        context.error("Azure OpenAI request failed", response.status, errText);
        return { status: 502, jsonBody: { error: "Azure OpenAI request failed." } };
      }

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content?.trim();

      return {
        status: 200,
        jsonBody: { reply: reply || "I'm not sure how to help with that yet, but I'm listening." },
      };
    } catch (err) {
      context.error("Unexpected error calling Azure OpenAI", err);
      return { status: 500, jsonBody: { error: "Unexpected server error contacting Azure OpenAI." } };
    }
  },
});
