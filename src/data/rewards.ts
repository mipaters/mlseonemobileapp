import type { Reward, Mission, PartnerOffer } from "../types";

export const REWARDS: Reward[] = [
  { id: "concession-credit", name: "$15 Concession Credit", description: "Redeem toward food and beverage at any venue.", pointCost: 1500, category: "Concession" },
  { id: "merch-discount", name: "20% Merchandise Discount", description: "Apply to any Digital Locker purchase.", pointCost: 2000, category: "Merchandise" },
  { id: "upgrade-credit", name: "Seat Upgrade Credit", description: "$50 credit toward your next seat upgrade.", pointCost: 3500, category: "Ticket" },
  { id: "exclusive-content", name: "Exclusive Digital Content", description: "Unlock a behind-the-scenes locker room package.", pointCost: 1200, category: "Content" },
  { id: "leafs-experience", name: "Leafs Pregame Skate Experience", description: "Watch the Leafs warm up from ice level.", pointCost: 9000, category: "Experience" },
  { id: "jays-experience", name: "Jays Batting Practice Experience", description: "Field access during Jays batting practice.", pointCost: 8500, category: "Experience" },
];

export const MISSIONS: Mission[] = [
  { id: "toronto-doubleheader", name: "Toronto Doubleheader", description: "Watch one Leafs recap and one Jays recap.", pointsReward: 500, progress: 1, target: 2, completed: false },
  { id: "gameday-ready", name: "Game-Day Ready", description: "Open a ticket and review the game-day plan.", pointsReward: 250, progress: 0, target: 1, completed: false },
  { id: "matthews-vladdy", name: "Matthews and Vladdy", description: "Watch a combined player highlight reel.", pointsReward: 350, progress: 0, target: 1, completed: false },
  { id: "taste-of-toronto", name: "Taste of Toronto Sports", description: "Complete a simulated venue food purchase.", pointsReward: 300, progress: 0, target: 1, completed: false },
  { id: "fan-voice", name: "Fan Voice", description: "Complete a game prediction.", pointsReward: 200, progress: 0, target: 1, completed: false },
  { id: "partner-challenge", name: "Partner Challenge", description: "Engage with a personalized partner experience.", pointsReward: 400, progress: 0, target: 1, completed: false },
];

export const PARTNER_OFFERS: PartnerOffer[] = [
  {
    id: "mobility-partner-offer",
    partnerName: "Mobility Partner",
    category: "Transportation",
    benefit: "$8 ride credit to Scotiabank Arena on game night",
    relevance: "Because you have an upcoming Leafs game and location-based Game-Day Mode is enabled",
    expiry: "Expires after tonight's game",
    rewardValue: "$8 value",
    requiredAction: "Apply credit before requesting a ride",
  },
  {
    id: "beverage-partner-offer",
    partnerName: "Beverage Partner",
    category: "Food & Beverage",
    benefit: "Buy one, get one concession credit",
    relevance: "Because you've purchased concessions at recent games",
    expiry: "Expires in 7 days",
    rewardValue: "Up to $9 value",
    requiredAction: "Show offer at any concession stand",
  },
  {
    id: "retail-partner-offer",
    partnerName: "Retail Partner",
    category: "Merchandise",
    benefit: "15% off your next Digital Locker order",
    relevance: "Because SportsIQ predicts interest in new gear",
    expiry: "Expires in 14 days",
    rewardValue: "15% discount",
    requiredAction: "Apply at checkout",
  },
  {
    id: "banking-partner-offer",
    partnerName: "Banking Partner",
    category: "Rewards",
    benefit: "2x rewards multiplier on game-day purchases",
    relevance: "Because you are a Platinum member with high rewards engagement",
    expiry: "Expires end of season",
    rewardValue: "2x points",
    requiredAction: "Link your rewards account",
  },
  {
    id: "travel-partner-offer",
    partnerName: "Travel Partner",
    category: "Experience",
    benefit: "Exclusive access to a Toronto sports weekend travel package",
    relevance: "Because you follow both teams and engage with weekend content",
    expiry: "Expires in 30 days",
    rewardValue: "Illustrative package value",
    requiredAction: "View package details",
  },
];

export const rewardById = (id: string) => REWARDS.find((r) => r.id === id);
export const missionById = (id: string) => MISSIONS.find((m) => m.id === id);
