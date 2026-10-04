import type { Game, Ticket, SeatUpgradeOption, FoodOption } from "../types";

export const GAMES: Game[] = [
  {
    id: "leafs-vs-bos",
    teamId: "leafs",
    opponent: "Boston Bruins",
    dateLabel: "Saturday",
    timeLabel: "7:00 PM",
    venue: "Scotiabank Arena",
    isNext: true,
  },
  {
    id: "jays-vs-nyy",
    teamId: "jays",
    opponent: "New York Yankees",
    dateLabel: "Sunday",
    timeLabel: "1:30 PM",
    venue: "Rogers Centre",
    isNext: true,
  },
];

export const TICKETS: Ticket[] = [
  {
    id: "ticket-leafs",
    teamId: "leafs",
    gameId: "leafs-vs-bos",
    section: "114",
    row: "12",
    seat: "7",
    gate: "Gate 4",
    status: "Upcoming",
  },
  {
    id: "ticket-jays",
    teamId: "jays",
    gameId: "jays-vs-nyy",
    section: "118R",
    row: "22",
    seat: "4",
    gate: "Gate 9",
    status: "Upcoming",
  },
];

export const SEAT_UPGRADES: Record<"leafs" | "jays", SeatUpgradeOption[]> = {
  leafs: [
    {
      id: "upgrade-leafs-1",
      section: "108 Lower Bowl",
      description: "Centre ice, 14 rows closer",
      priceDifference: 145,
      rewardsDiscount: 40,
      distanceFromCurrent: "14 rows closer",
      recommended: true,
    },
    {
      id: "upgrade-leafs-2",
      section: "Platinum Club 102",
      description: "Padded seating with in-seat service",
      priceDifference: 265,
      rewardsDiscount: 60,
      distanceFromCurrent: "22 rows closer",
      recommended: false,
    },
    {
      id: "upgrade-leafs-3",
      section: "110 Lower Bowl",
      description: "Great sightline near the Leafs bench",
      priceDifference: 95,
      rewardsDiscount: 25,
      distanceFromCurrent: "8 rows closer",
      recommended: false,
    },
  ],
  jays: [
    {
      id: "upgrade-jays-1",
      section: "116B Infield",
      description: "Field level, behind home plate",
      priceDifference: 120,
      rewardsDiscount: 35,
      distanceFromCurrent: "10 rows closer",
      recommended: true,
    },
    {
      id: "upgrade-jays-2",
      section: "WestJet Flight Deck",
      description: "All-inclusive dining with skyline views",
      priceDifference: 240,
      rewardsDiscount: 55,
      distanceFromCurrent: "Premium level",
      recommended: false,
    },
    {
      id: "upgrade-jays-3",
      section: "117 Infield",
      description: "Closer to the Jays dugout",
      priceDifference: 80,
      rewardsDiscount: 20,
      distanceFromCurrent: "6 rows closer",
      recommended: false,
    },
  ],
};

export const FOOD_OPTIONS: Record<"leafs" | "jays", FoodOption[]> = {
  leafs: [
    { id: "food-leafs-1", teamId: "leafs", name: "Real Sports Bar Express", location: "Section 112 Concourse", waitMinutes: 6 },
    { id: "food-leafs-2", teamId: "leafs", name: "Maple Leaf Poutine Co.", location: "Section 118 Concourse", waitMinutes: 11 },
    { id: "food-leafs-3", teamId: "leafs", name: "Platinum Lounge Dining", location: "Platinum Level", waitMinutes: 2 },
  ],
  jays: [
    { id: "food-jays-1", teamId: "jays", name: "Hortons Diamond Grill", location: "100 Level Concourse", waitMinutes: 8 },
    { id: "food-jays-2", teamId: "jays", name: "Blue Jays BBQ Co.", location: "200 Level Concourse", waitMinutes: 14 },
    { id: "food-jays-3", teamId: "jays", name: "Flight Deck Dining", location: "WestJet Flight Deck", waitMinutes: 3 },
  ],
};

export const ticketByTeam = (team: "leafs" | "jays") => TICKETS.find((t) => t.teamId === team);
export const gameByTeam = (team: "leafs" | "jays") => GAMES.find((g) => g.teamId === team && g.isNext);
