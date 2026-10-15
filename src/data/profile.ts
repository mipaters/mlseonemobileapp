import type { PrivacyPreferences } from "../types";

// Illustrative demo fan profile. Not a real person's data.
export const MIKE_PROFILE = {
  name: "Mike Paterson",
  location: "Toronto",
  membershipStatus: "Platinum" as const,
  rewardsBalance: 18450,
  memberSince: 2018,
  favouriteTeams: ["leafs", "jays"] as const,
  favouriteLeafsPlayer: "matthews",
  favouriteJaysPlayer: "vladdy",
  avatarInitials: "MP",
};

export const DEFAULT_PRIVACY_PREFERENCES: PrivacyPreferences = {
  personalization: true,
  relevantOffers: true,
  locationGameDay: true,
  partnerRecommendations: true,
  personalizedVideo: true,
  activityHistory: true,
};

export const FAN_DNA_BASE = {
  leafsAffinity: 94,
  jaysAffinity: 89,
  hockeyContentAffinity: 92,
  baseballContentAffinity: 86,
  liveEventAffinity: 91,
  videoEngagement: 88,
  seatUpgradePropensity: 82,
  rewardsEngagement: 79,
  merchandisePropensity: 74,
  sponsorRelevance: 71,
  churnRisk: "Low" as const,
};

export const NEXT_BEST_ACTION =
  "Offer Mike a Leafs seat upgrade with a rewards discount and a personalized pregame recap.";
export const NEXT_BEST_CONTENT = "Combined Toronto sports weekend recap";
export const NEXT_BEST_MERCHANDISE = "Guerrero Jr. jersey";

export const TIER_THRESHOLDS: { tier: string; min: number }[] = [
  { tier: "Bronze", min: 0 },
  { tier: "Silver", min: 2000 },
  { tier: "Gold", min: 8000 },
  { tier: "Platinum", min: 15000 },
  { tier: "Legend", min: 25000 },
];
