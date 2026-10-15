export interface WalkthroughStep {
  id: string;
  title: string;
  narration: string;
  route: string;
  highlight: string[];
  action?: "highlightBuilder" | "citoWeekend" | "venueArrival" | "seatUpgrade" | "completeMission" | "personalizationCycle";
}

export const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    id: "step-1",
    title: "One Fan, Two Teams",
    narration:
      "Meet Mike, a fan of the Maple Leafs and Blue Jays. Instead of treating Mike as separate team accounts and disconnected transactions, MLSE One creates one continuously evolving sports relationship.",
    route: "/home",
    highlight: ["profile", "leafs-affinity", "jays-affinity", "platinum-status"],
  },
  {
    id: "step-2",
    title: "A Mobile Experience Built for Mike",
    narration:
      "SportsIQ ranks content, tickets, rewards and experiences using Mike's current interests and behaviour. The result is a mobile home screen that is personal to him.",
    route: "/home",
    highlight: ["hero-card", "daily-recap", "recommended-experiences"],
  },
  {
    id: "step-3",
    title: "Personalized Video",
    narration:
      "Mike does not receive a generic highlights feed. SportsIQ assembles a recap around the teams, players and moments he values.",
    route: "/watch",
    highlight: ["daily-recap-player", "highlight-builder"],
    action: "highlightBuilder",
  },
  {
    id: "step-4",
    title: "Ask Cito",
    narration:
      "Cito becomes Mike's personal sports concierge. It helps him discover content, understand rewards, plan game day, find merchandise, and complete relevant actions.",
    route: "/cito",
    highlight: ["cito-chat", "suggested-prompts"],
    action: "citoWeekend",
  },
  {
    id: "step-5",
    title: "Game-Day Mode",
    narration:
      "As Mike approaches the venue, the application changes from a content experience into a mobile game-day companion.",
    route: "/gameday",
    highlight: ["venue-arrival-button"],
    action: "venueArrival",
  },
  {
    id: "step-6",
    title: "Mobile Conversion",
    narration:
      "SportsIQ recognizes that Mike is attending and has a high seat-upgrade propensity. It presents a relevant offer at the moment it is most useful.",
    route: "/gameday",
    highlight: ["seat-upgrade"],
    action: "seatUpgrade",
  },
  {
    id: "step-7",
    title: "Unified Rewards",
    narration:
      "Mike earns status through content, attendance, purchases, predictions and partner experiences across both teams.",
    route: "/rewards",
    highlight: ["platinum-status", "active-missions", "rewards-wallet"],
    action: "completeMission",
  },
  {
    id: "step-8",
    title: "Fan DNA",
    narration:
      "Every consented interaction improves Mike's Fan DNA. Recommendations remain explainable, and Mike controls how his data is used.",
    route: "/profile/fan-dna",
    highlight: ["affinities", "recent-signals", "next-best-action", "privacy-controls"],
  },
  {
    id: "step-9",
    title: "Coordinated Agents",
    narration:
      "MLSE One is more than a chatbot. Coordinated agents update the fan profile, rank content, assemble video, orchestrate game day, select rewards, recommend commerce, and measure outcomes.",
    route: "/profile/agent-activity",
    highlight: ["agent-sequence", "final-recommendation"],
    action: "personalizationCycle",
  },
  {
    id: "step-10",
    title: "Business Value",
    narration:
      "One unified profile improves ticketing, upgrades, content, commerce, food and beverage, loyalty, sponsorship and premium experiences.",
    route: "/executive",
    highlight: ["kpis", "fan-funnel", "revenue-pools"],
  },
  {
    id: "step-11",
    title: "Microsoft Architecture",
    narration:
      "Microsoft Fabric provides the unified data and intelligence foundation. Azure AI Foundry supports SportsIQ and Ask Cito. Existing ticketing, venue, video, commerce and partner platforms connect through an extensible integration layer.",
    route: "/executive/architecture",
    highlight: ["fabric", "foundry", "sportsiq", "cito", "operational-sources", "security"],
  },
  {
    id: "step-12",
    title: "Executive Close",
    narration:
      "MLSE One transforms separate Leafs and Jays interactions into one intelligent fan relationship. The mobile experience creates value for the fan while the unified intelligence foundation creates measurable value across the business.",
    route: "/executive",
    highlight: ["closing-message"],
  },
];
