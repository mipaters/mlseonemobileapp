import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

export class SpeechApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SpeechApiError";
  }
}

interface SpeechTokenCache {
  token: string;
  region: string;
  fetchedAt: number;
}

let tokenCache: SpeechTokenCache | null = null;
const TOKEN_TTL_MS = 8 * 60 * 1000; // Azure STS tokens are valid ~10 minutes; refresh a little early.

async function getSpeechToken(): Promise<{ token: string; region: string }> {
  if (tokenCache && Date.now() - tokenCache.fetchedAt < TOKEN_TTL_MS) {
    return tokenCache;
  }

  let response: Response;
  try {
    response = await fetch("/api/speech-token");
  } catch (err) {
    throw new SpeechApiError(`Network error contacting Speech API: ${(err as Error).message}`);
  }

  if (!response.ok) {
    throw new SpeechApiError(`Speech token API responded with ${response.status}`);
  }

  const data = await response.json();
  if (!data?.token || !data?.region) {
    throw new SpeechApiError("Speech token API returned an incomplete response.");
  }

  tokenCache = { token: data.token, region: data.region, fetchedAt: Date.now() };
  return tokenCache;
}

/**
 * Captures a single utterance from the default microphone and returns the
 * recognized text. Rejects with `SpeechApiError` if Speech isn't configured,
 * the mic is unavailable, or recognition fails/times out.
 */
export async function recognizeSpeechOnce(): Promise<string> {
  const { token, region } = await getSpeechToken();

  const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(token, region);
  speechConfig.speechRecognitionLanguage = "en-US";

  let audioConfig: SpeechSDK.AudioConfig;
  try {
    audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
  } catch (err) {
    throw new SpeechApiError(`Microphone unavailable: ${(err as Error).message}`);
  }

  const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

  return new Promise<string>((resolve, reject) => {
    recognizer.recognizeOnceAsync(
      (result) => {
        recognizer.close();
        if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech && result.text) {
          resolve(result.text);
        } else if (result.reason === SpeechSDK.ResultReason.NoMatch) {
          reject(new SpeechApiError("No speech could be recognized."));
        } else {
          reject(new SpeechApiError(`Speech recognition failed (reason: ${result.reason}).`));
        }
      },
      (err) => {
        recognizer.close();
        reject(new SpeechApiError(`Speech recognition error: ${err}`));
      }
    );
  });
}

/**
 * Speaks the given text aloud through the default audio output using Azure
 * neural text-to-speech. Rejects with `SpeechApiError` on failure.
 */
export async function speakText(text: string): Promise<void> {
  const { token, region } = await getSpeechToken();

  const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(token, region);
  speechConfig.speechSynthesisVoiceName = "en-US-AndrewMultilingualNeural";

  const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);

  return new Promise<void>((resolve, reject) => {
    synthesizer.speakTextAsync(
      text,
      (result) => {
        synthesizer.close();
        if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
          resolve();
        } else {
          reject(new SpeechApiError(`Speech synthesis failed (reason: ${result.reason}).`));
        }
      },
      (err) => {
        synthesizer.close();
        reject(new SpeechApiError(`Speech synthesis error: ${err}`));
      }
    );
  });
}
