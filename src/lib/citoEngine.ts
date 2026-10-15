// Deterministic local intent matcher for Ask Cito.
// Structured so it can later be swapped for an Azure AI Foundry / Azure OpenAI backed
// orchestration without changing the calling interface (matchIntent -> CitoJourney).

export type CitoJourney =
  | "weekend"
  | "leafsGameday"
  | "jaysGameday"
  | "combinedHighlight"
  | "rewards"
  | "seatUpgrade"
  | "merchandise"
  | "venueHelp"
  | "showTicket"
  | "whatToWatch"
  | "fallback";

interface IntentRule {
  journey: CitoJourney;
  keywords: string[];
}

const RULES: IntentRule[] = [
  {
    journey: "weekend",
    keywords: ["weekend", "happening this weekend", "sports weekend", "are the leafs or jays playing", "plan my sports weekend"],
  },
  {
    journey: "leafsGameday",
    keywords: ["plan my leafs game", "leafs game", "night at the leafs", "ready for the leafs", "leafs tonight"],
  },
  {
    journey: "jaysGameday",
    keywords: ["plan my jays game", "jays game", "afternoon at the jays", "ready for the jays", "batting practice"],
  },
  {
    journey: "combinedHighlight",
    keywords: ["matthews and guerrero", "matthews and vladdy", "vladdy and matthews", "best matthews and", "highlight reel", "five-minute highlight", "build me a"],
  },
  {
    journey: "rewards",
    keywords: ["points", "rewards", "redeem", "what can i get"],
  },
  {
    journey: "seatUpgrade",
    keywords: ["upgrade", "better seats", "move closer", "seat upgrade"],
  },
  {
    journey: "merchandise",
    keywords: ["jersey", "hat", "gear", "buy", "merch", "cap"],
  },
  {
    journey: "venueHelp",
    keywords: ["gate", "eat", "food line", "where is my seat", "merchandise store", "where should i eat", "where can i buy"],
  },
  {
    journey: "showTicket",
    keywords: ["show my ticket", "my ticket", "show ticket"],
  },
  {
    journey: "whatToWatch",
    keywords: ["what should i watch", "which game should i attend", "recap of both teams"],
  },
];

export function matchIntent(input: string): CitoJourney {
  const text = input.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((kw) => text.includes(kw))) {
      return rule.journey;
    }
  }
  return "fallback";
}

export const SUGGESTED_PROMPTS: { text: string; journey: CitoJourney }[] = [
  { text: "What's happening this weekend?", journey: "weekend" },
  { text: "Give me a recap of both teams.", journey: "whatToWatch" },
  { text: "Show me Matthews' best goals.", journey: "whatToWatch" },
  { text: "Show me Vladdy's best home runs.", journey: "whatToWatch" },
  { text: "Build me a five-minute highlight reel.", journey: "combinedHighlight" },
  { text: "Plan my night at the Leafs game.", journey: "leafsGameday" },
  { text: "Plan my afternoon at the Jays game.", journey: "jaysGameday" },
  { text: "Show my ticket.", journey: "showTicket" },
  { text: "Can I upgrade my seats?", journey: "seatUpgrade" },
  { text: "What can I get with my points?", journey: "rewards" },
  { text: "Find me a Leafs jersey.", journey: "merchandise" },
  { text: "Find me a Jays hat.", journey: "merchandise" },
  { text: "What should I watch next?", journey: "whatToWatch" },
  { text: "Which game should I attend?", journey: "whatToWatch" },
  { text: "Where should I eat at the venue?", journey: "venueHelp" },
];

export const CITO_GREETING =
  "Hi Mike. I'm Cito, your personal Toronto sports concierge. I know you follow the Leafs and Jays. What can I help you with?";
