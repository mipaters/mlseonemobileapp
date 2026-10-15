// Core domain types for MLSE One
// NOTE: All data in this app is fictional, illustrative demo data.

export type TeamId = "leafs" | "jays";

export interface Team {
  id: TeamId | "raptors";
  name: string;
  shortName: string;
  sport: "Hockey" | "Baseball" | "Basketball";
  venue: string;
  colorFrom: string;
  colorTo: string;
}

export interface Player {
  id: string;
  teamId: TeamId;
  name: string;
  position: string;
  isFavourite: boolean;
}

export type ContentCategory =
  | "Game Recap"
  | "Goals"
  | "Home Runs"
  | "Player Interview"
  | "Behind the Scenes"
  | "Team News"
  | "Game Preview"
  | "Merchandise"
  | "Experience"
  | "Reward";

export interface ContentItem {
  id: string;
  title: string;
  teamId: TeamId | "both";
  category: ContentCategory;
  description: string;
  durationMinutes?: number;
  reason: string;
  thumbnailGradient: [string, string];
  chapters?: string[];
  videoUrl?: string;
}

export type ContentRowId = "forYou" | "becauseYouFollowBoth" | "recommendedExperiences";

export interface Game {
  id: string;
  teamId: TeamId;
  opponent: string;
  dateLabel: string;
  timeLabel: string;
  venue: string;
  isNext: boolean;
}

export interface Ticket {
  id: string;
  teamId: TeamId;
  gameId: string;
  section: string;
  row: string;
  seat: string;
  gate: string;
  status: "Upcoming" | "Active" | "Upgraded";
}

export interface SeatUpgradeOption {
  id: string;
  section: string;
  description: string;
  priceDifference: number;
  rewardsDiscount: number;
  distanceFromCurrent: string;
  recommended: boolean;
}

export interface FoodOption {
  id: string;
  teamId: TeamId;
  name: string;
  location: string;
  waitMinutes: number;
}

export interface MerchandiseItem {
  id: string;
  teamId: TeamId | "both";
  name: string;
  category: string;
  price: number;
  reason: string;
  sizes: string[];
  colors: string[];
  image: [string, string];
}

export interface CartItem {
  itemId: string;
  size: string;
  color: string;
  quantity: number;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointCost: number;
  category: "Concession" | "Merchandise" | "Ticket" | "Content" | "Experience";
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  pointsReward: number;
  progress: number;
  target: number;
  completed: boolean;
}

export interface PartnerOffer {
  id: string;
  partnerName: string;
  category: string;
  benefit: string;
  relevance: string;
  expiry: string;
  rewardValue: string;
  requiredAction: string;
}

export interface FanDNASignal {
  id: string;
  label: string;
  timestamp: string;
}

export interface AgentActivityEvent {
  id: string;
  agent: string;
  message: string;
  timestamp: string;
}

export interface DigitalLockerItem {
  id: string;
  name: string;
  type: "Merchandise" | "Ticket Stub" | "Badge" | "Highlight" | "Experience";
  teamId?: TeamId | "both";
}

export interface StandingsRow {
  team: string;
  abbreviation: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  points: number;
  isUserTeam?: boolean;
}

export interface StandingsTable {
  teamId: TeamId | "raptors";
  league: string;
  division: string;
  rows: StandingsRow[];
}

export interface ScoringLeader {
  name: string;
  statLine: string;
  primaryStat: string;
}

export interface ScoringLeaderboard {
  teamId: TeamId | "raptors";
  heading: string;
  leaders: ScoringLeader[];
}

export interface TeamNewsStory {
  id: string;
  teamId: TeamId | "raptors";
  headline: string;
  source: string;
  timeAgo: string;
  url: string;
}

export type LoyaltyTier = "Bronze" | "Silver" | "Gold" | "Platinum" | "Legend";

export interface PrivacyPreferences {
  personalization: boolean;
  relevantOffers: boolean;
  locationGameDay: boolean;
  partnerRecommendations: boolean;
  personalizedVideo: boolean;
  activityHistory: boolean;
}

export interface CitoMessage {
  id: string;
  role: "user" | "cito";
  text: string;
  cardId?: string;
  timestamp: string;
}

export interface ExecutiveKPI {
  id: string;
  label: string;
  value: string;
  delta: string;
}

export interface GeneratedReel {
  id: string;
  title: string;
  teamId: TeamId | "both";
  lengthMinutes: number;
  createdAt: string;
  chapters: string[];
}

export interface RedeemedReward {
  id: string;
  rewardId: string;
  redeemedAt: string;
}

export interface PurchasedItem {
  id: string;
  itemId: string;
  size: string;
  color: string;
  purchasedAt: string;
}
