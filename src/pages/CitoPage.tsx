import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Mic, Minimize2, Send, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CITO_GREETING, SUGGESTED_PROMPTS, matchIntent, type CitoJourney } from "../lib/citoEngine";
import { useAppState } from "../store/AppState";
import type { CitoMessage } from "../types";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { CitoMessageBubble } from "../components/cito/CitoMessageBubble";
import {
  CitoFallbackCard,
  CitoGameDayPlanCard,
  CitoHighlightPackageCard,
  CitoMerchandiseCard,
  CitoRewardsCard,
  CitoSeatUpgradeCard,
  CitoStatPills,
  CitoTicketCard,
  CitoVenueHelpCard,
  CitoWatchSuggestionsCard,
  CitoWeekendCard,
} from "../components/cito/JourneyCards";

const SAMPLE_VOICE_PROMPT = "What's happening this weekend?";

function createMessageId() {
  return globalThis.crypto?.randomUUID?.() ?? `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createTimestamp() {
  return new Date().toISOString();
}

function responseForJourney(journey: CitoJourney) {
  switch (journey) {
    case "weekend":
      return "You’ve got a strong Toronto sports weekend lined up, Mike. I mapped out the best Leafs-to-Jays flow so you can move from pregame planning to Sunday recap mode.";
    case "leafsGameday":
      return "I built your Leafs game-night plan with timing, entry, food, and a seat-upgrade option. You’re set up for a smooth run into Scotiabank Arena.";
    case "jaysGameday":
      return "Your Jays afternoon plan is ready with gate timing, batting-practice guidance, food, and a post-game recap idea. You’ll be comfortably ahead of first pitch.";
    case "combinedHighlight":
      return "Absolutely — I can assemble a combined Matthews and Vladdy package for you. Pick a runtime and I’ll stitch together a Toronto-ready reel.";
    case "rewards":
      return "You’ve got enough points to do something fun right now. I pulled the best rewards that fit your balance so you can redeem without overthinking it.";
    case "seatUpgrade":
      return "I found a few stronger seat options for your active game day. Compare the views, apply rewards savings, and upgrade the ticket you already have.";
    case "merchandise":
      return "I picked a few fan-gear options that fit your latest ask and your Toronto preferences. You can save them, cart them, or use points if the math works.";
    case "venueHelp":
      return "I can get you moving around the venue fast. I matched your request to the closest destination and added a simple walking plan.";
    case "showTicket":
      return "Here’s your mobile ticket summary so you can check the essentials at a glance. If you want, I can send you straight into full game-day mode next.";
    case "whatToWatch":
      return "I lined up a few watch picks based on what you asked for and what tends to land well with you. These are the quickest wins for your next viewing session.";
    case "fallback":
      return "I’m ready to help with Toronto sports planning in a few different ways. I can set up game day, build highlights, surface rewards, show tickets, find gear, or help you around the venue.";
    default:
      return "I’ve got a few good options ready for you.";
  }
}

function agentCopy(journey: CitoJourney) {
  switch (journey) {
    case "leafsGameday":
    case "jaysGameday":
    case "venueHelp":
    case "showTicket":
    case "seatUpgrade":
      return {
        agent: "Game-Day Agent",
        thinking: "Game-Day Agent is preparing your plan…",
        activity: journey === "seatUpgrade" ? "Seat upgrade flow prepared" : "Game-day assistance prepared",
      };
    case "combinedHighlight":
      return {
        agent: "Video Assembly Agent",
        thinking: "Video Assembly Agent is lining up the reel…",
        activity: "Highlight journey queued",
      };
    case "whatToWatch":
      return {
        agent: "Content Curation Agent",
        thinking: "Content Curation Agent is picking the best watch list…",
        activity: "Watch suggestions prepared",
      };
    case "rewards":
      return {
        agent: "Rewards Agent",
        thinking: "Rewards Agent is checking your balance and offers…",
        activity: "Rewards options prepared",
      };
    case "merchandise":
      return {
        agent: "Commerce Agent",
        thinking: "Commerce Agent is matching gear to your fan profile…",
        activity: "Merchandise recommendations prepared",
      };
    case "weekend":
      return {
        agent: "Fan Profile Agent",
        thinking: "Fan Profile Agent is shaping your Toronto weekend…",
        activity: "Weekend itinerary prepared",
      };
    case "fallback":
      return {
        agent: "Cito Concierge",
        thinking: "Cito is organizing the best next options…",
        activity: "Follow-up suggestions prepared",
      };
    default:
      return {
        agent: "Cito Concierge",
        thinking: "Cito is getting things ready…",
        activity: "Conversation updated",
      };
  }
}

function findPromptSource(history: CitoMessage[], index: number) {
  for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
    const candidate = history[cursor];
    if (candidate.role === "user") {
      return candidate.text;
    }
  }

  return "";
}

export function CitoPage() {
  const { state, actions } = useAppState();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [pendingJourney, setPendingJourney] = useState<CitoJourney | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const seededRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  const promptRow = useMemo(() => SUGGESTED_PROMPTS, []);

  useEffect(() => {
    if (!seededRef.current && state.citoHistory.length === 0) {
      seededRef.current = true;
      actions.addCitoMessage({
        id: createMessageId(),
        role: "cito",
        text: CITO_GREETING,
        timestamp: createTimestamp(),
      });
    }
  }, [actions, state.citoHistory.length]);

  useEffect(() => {
    const node = listRef.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [isThinking, state.citoHistory]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const scheduleTimer = (callback: () => void, delay: number) => {
    const timer = window.setTimeout(() => {
      timersRef.current = timersRef.current.filter((entry) => entry !== timer);
      callback();
    }, delay);
    timersRef.current.push(timer);
  };

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isThinking || isListening) return;

    const userMessage: CitoMessage = {
      id: createMessageId(),
      role: "user",
      text: trimmed,
      timestamp: createTimestamp(),
    };

    actions.addCitoMessage(userMessage);
    actions.addSignal(`Asked Cito: ${trimmed}`);
    setInputValue("");

    const journey = matchIntent(trimmed);
    const agentDetails = agentCopy(journey);
    setPendingJourney(journey);
    setIsThinking(true);

    scheduleTimer(() => {
      setIsThinking(false);
      setPendingJourney(null);
      actions.addCitoMessage({
        id: createMessageId(),
        role: "cito",
        text: responseForJourney(journey),
        cardId: journey,
        timestamp: createTimestamp(),
      });
      actions.addAgentActivity(agentDetails.agent, agentDetails.activity);
    }, 760);
  };

  const handleVoiceDemo = () => {
    if (isThinking || isListening) return;

    setIsListening(true);
    setInputValue("Listening…");

    scheduleTimer(() => {
      setIsListening(false);
      setInputValue(SAMPLE_VOICE_PROMPT);
      handleSend(SAMPLE_VOICE_PROMPT);
    }, 900);
  };

  const renderCardForJourney = (journey: string | undefined, promptText: string, messageId: string) => {
    switch (journey) {
      case "weekend":
        return <CitoWeekendCard onFocusInput={focusInput} />;
      case "leafsGameday":
        return <CitoGameDayPlanCard team="leafs" />;
      case "jaysGameday":
        return <CitoGameDayPlanCard team="jays" />;
      case "combinedHighlight":
        return <CitoHighlightPackageCard key={messageId} />;
      case "rewards":
        return <CitoRewardsCard />;
      case "seatUpgrade":
        return <CitoSeatUpgradeCard key={messageId} />;
      case "merchandise":
        return <CitoMerchandiseCard userText={promptText} />;
      case "venueHelp":
        return <CitoVenueHelpCard userText={promptText} />;
      case "showTicket":
        return <CitoTicketCard />;
      case "whatToWatch":
        return <CitoWatchSuggestionsCard userText={promptText} />;
      case "fallback":
        return <CitoFallbackCard onPromptSelect={handleSend} />;
      default:
        return null;
    }
  };

  const thinkingText = pendingJourney ? agentCopy(pendingJourney).thinking : "Cito is thinking…";

  return (
    <div className="flex h-full min-h-0 flex-col bg-navy-950 animate-fade-up">
      <header className="border-b border-white/10 px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">Ask Cito</p>
            <h1 className="mt-1 font-display text-2xl font-semibold uppercase tracking-tight text-white">Your Toronto sports concierge</h1>
            <p className="mt-1 text-sm text-silver-300">Chat with Cito for game day, highlights, rewards, tickets, and more.</p>
          </div>
          <Button size="sm" variant="ghost" onClick={() => navigate("/home")}>
            <Minimize2 size={14} className="mr-1 inline" />
            Minimize
          </Button>
        </div>
      </header>

      <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4" data-tour="cito-chat">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-leafs-700/20 via-navy-900 to-jays-700/20 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full border border-accent-gold/30 bg-accent-gold/10 p-2 text-accent-gold">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Cito knows your fan profile</p>
              <p className="mt-1 text-sm text-silver-300">
                Mike follows the Leafs and Jays, so Cito can keep every answer personalized and action-ready.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <CitoStatPills />
          </div>
        </div>

        {state.citoHistory.map((message, index) => {
          const promptText = findPromptSource(state.citoHistory, index);
          const card = message.role === "cito" ? renderCardForJourney(message.cardId, promptText, message.id) : null;

          return (
            <CitoMessageBubble key={message.id} message={message}>
              {card ?? undefined}
            </CitoMessageBubble>
          );
        })}

        {isThinking ? (
          <div className="flex justify-start">
            <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-white/10 bg-navy-800 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-white">
                <Bot size={16} className="text-accent-gold" />
                <span>{thinkingText}</span>
              </div>
              <div className="mt-3 flex gap-1">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-accent-gold [animation-delay:0ms]" />
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-accent-gold [animation-delay:120ms]" />
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-accent-gold [animation-delay:240ms]" />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <footer className="border-t border-white/10 bg-navy-950/95 px-4 pb-4 pt-3 backdrop-blur">
        <div className="overflow-x-auto pb-2" data-tour="suggested-prompts">
          <div className="flex gap-2">
            {promptRow.map((prompt) => (
              <Chip
                key={`${prompt.journey}-${prompt.text}`}
                label={prompt.text}
                onClick={() => handleSend(prompt.text)}
              />
            ))}
          </div>
        </div>

        <div className="mt-2 flex items-end gap-2">
          <button
            type="button"
            aria-label={isListening ? "Listening" : "Use voice demo"}
            onClick={handleVoiceDemo}
            disabled={isThinking || isListening}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition ${
              isListening
                ? "border-accent-gold bg-accent-gold text-navy-950"
                : "border-white/10 bg-white/5 text-silver-200 hover:bg-white/10"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <Mic size={18} />
          </button>

          <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <input
              ref={inputRef}
              value={inputValue}
              disabled={isThinking}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSend(inputValue);
                }
              }}
              placeholder={isListening ? "Listening…" : "Ask Cito about game day, rewards, highlights, tickets, or gear"}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-silver-500"
            />
          </div>

          <button
            type="button"
            aria-label="Send message"
            onClick={() => handleSend(inputValue)}
            disabled={!inputValue.trim() || isThinking || isListening}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-gold text-navy-950 transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}
