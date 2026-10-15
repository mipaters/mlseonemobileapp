const { app } = require("@azure/functions");

/**
 * Issues a short-lived (≈10 minute) Azure Speech authorization token so the
 * browser can use the Speech SDK directly without ever seeing the subscription key.
 */
app.http("speechToken", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "speech-token",
  handler: async (request, context) => {
    const key = process.env.AZURE_SPEECH_KEY;
    const region = process.env.AZURE_SPEECH_REGION;

    if (!key || !region) {
      context.warn("Azure Speech is not fully configured (missing key/region).");
      return {
        status: 503,
        jsonBody: { error: "Azure Speech is not configured on the server." },
      };
    }

    try {
      const tokenResponse = await fetch(`https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": key,
          "Content-Length": "0",
        },
      });

      if (!tokenResponse.ok) {
        const errText = await tokenResponse.text();
        context.error("Azure Speech token request failed", tokenResponse.status, errText);
        return { status: 502, jsonBody: { error: "Failed to issue Azure Speech token." } };
      }

      const token = await tokenResponse.text();
      return { status: 200, jsonBody: { token, region } };
    } catch (err) {
      context.error("Unexpected error issuing Azure Speech token", err);
      return { status: 500, jsonBody: { error: "Unexpected server error contacting Azure Speech." } };
    }
  },
});
