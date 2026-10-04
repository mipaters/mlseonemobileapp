import type { ContentItem } from "../types";

export const CONTENT_ITEMS: ContentItem[] = [
  // For You
  {
    id: "leafs-gameday-preview",
    title: "Auston Matthews: Highlights from last night's game",
    teamId: "leafs",
    category: "Goals",
    description: "Relive Auston Matthews' hat trick from last night's win.",
    durationMinutes: 4,
    reason: "Because the Leafs play tonight",
    thumbnailGradient: ["#00204e", "#0a3d7a"],
    videoUrl: "/videos/matthews-hat-trick.mp4",
  },
  {
    id: "matthews-top-goals",
    title: "Blue Jays: Highlights from last game",
    teamId: "jays",
    category: "Game Recap",
    description: "The best moments from the Blue Jays' last game.",
    durationMinutes: 6,
    reason: "Because the Jays played last night",
    thumbnailGradient: ["#0a3d7a", "#1c5ca3"],
    videoUrl: "/videos/jayshighlights.mp4",
  },
  // Continue Watching
  // Because you follow both teams
  {
    id: "toronto-weekend-planner",
    title: "Toronto Sports Weekend Planner",
    teamId: "both",
    category: "Experience",
    description: "Plan your perfect Toronto sports weekend across both teams.",
    reason: "Because you follow both teams",
    thumbnailGradient: ["#00204e", "#d4af37"],
  },
  {
    id: "leafs-saturday-jays-sunday",
    title: "Leafs Saturday and Jays Sunday",
    teamId: "both",
    category: "Game Preview",
    description: "Your weekend itinerary: Leafs on Saturday, Jays on Sunday.",
    reason: "Because you follow both teams",
    thumbnailGradient: ["#182742", "#1c5ca3"],
  },
  {
    id: "two-team-rewards-challenge",
    title: "Two-Team Rewards Challenge",
    teamId: "both",
    category: "Reward",
    description: "Earn bonus points by engaging with both the Leafs and Jays this week.",
    reason: "Because you follow both teams",
    thumbnailGradient: ["#d4af37", "#00204e"],
  },
  {
    id: "combined-personalized-recap",
    title: "Combined Personalized Recap",
    teamId: "both",
    category: "Game Recap",
    description: "A single recap combining the best of both of your teams.",
    durationMinutes: 5,
    reason: "Because you follow both teams",
    thumbnailGradient: ["#00204e", "#134a8a"],
  },
  {
    id: "toronto-merch-collection",
    title: "Toronto Sports Merchandise Collection",
    teamId: "both",
    category: "Merchandise",
    description: "A crossover collection featuring both the Leafs and Jays.",
    reason: "Because you follow both teams",
    thumbnailGradient: ["#9aa3b2", "#182742"],
  },
  // Recommended Experiences
  {
    id: "leafs-seat-upgrade-exp",
    title: "Leafs Seat Upgrade",
    teamId: "leafs",
    category: "Experience",
    description: "SportsIQ predicts you'd enjoy a closer view for tonight's game.",
    reason: "Because SportsIQ predicts interest in seat upgrades",
    thumbnailGradient: ["#00204e", "#d4af37"],
  },
  {
    id: "jays-afternoon-ticket-exp",
    title: "Jays Afternoon Ticket",
    teamId: "jays",
    category: "Experience",
    description: "A great-value afternoon ticket for the Jays' upcoming home game.",
    reason: "Because you watched three Jays recaps this week",
    thumbnailGradient: ["#134a8a", "#1c5ca3"],
  },
  {
    id: "arena-dining-offer",
    title: "Personalized Arena Dining Offer",
    teamId: "leafs",
    category: "Experience",
    description: "A dining credit at Scotiabank Arena based on your preferences.",
    reason: "Because you attended a Leafs game",
    thumbnailGradient: ["#16a34a", "#182742"],
  },
  {
    id: "reward-redemption-exp",
    title: "Reward Redemption",
    teamId: "both",
    category: "Reward",
    description: "You're close to your next reward tier. Redeem now.",
    reason: "Because you are close to your next reward",
    thumbnailGradient: ["#d4af37", "#9aa3b2"],
  },
  {
    id: "limited-merch-item",
    title: "Limited Merchandise Item",
    teamId: "jays",
    category: "Merchandise",
    description: "A limited-edition Guerrero Jr. item is available now.",
    reason: "Because you saved a Guerrero Jr. highlight",
    thumbnailGradient: ["#134a8a", "#d4af37"],
  },
];

export const CONTENT_ROWS: { id: string; title: string; itemIds: string[] }[] = [
  {
    id: "forYou",
    title: "For You",
    itemIds: ["leafs-gameday-preview", "matthews-top-goals"],
  },
  {
    id: "becauseYouFollowBoth",
    title: "Because You Follow Both Teams",
    itemIds: [
      "toronto-weekend-planner",
      "leafs-saturday-jays-sunday",
      "two-team-rewards-challenge",
      "combined-personalized-recap",
      "toronto-merch-collection",
    ],
  },
  {
    id: "recommendedExperiences",
    title: "Recommended Experiences",
    itemIds: [
      "leafs-seat-upgrade-exp",
      "jays-afternoon-ticket-exp",
      "arena-dining-offer",
      "reward-redemption-exp",
      "limited-merch-item",
    ],
  },
];

export const contentById = (id: string) => CONTENT_ITEMS.find((c) => c.id === id);

export const DAILY_RECAP_CHAPTERS = [
  "Leafs in 60 Seconds",
  "Matthews Watch",
  "Jays in 60 Seconds",
  "Vladdy Power Moment",
  "What's Next",
  "Your Recommended Experience",
];

export const FEED_FILTERS = ["All", "Leafs", "Jays", "Highlights", "Tickets", "Gear", "Rewards", "Experiences"] as const;
