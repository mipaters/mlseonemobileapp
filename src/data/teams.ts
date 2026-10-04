import type { Team, Player } from "../types";

export const TEAMS: Team[] = [
  {
    id: "leafs",
    name: "Toronto Maple Leafs",
    shortName: "LEAFS",
    sport: "Hockey",
    venue: "Scotiabank Arena",
    colorFrom: "#00204e",
    colorTo: "#0a3d7a",
  },
  {
    id: "jays",
    name: "Toronto Blue Jays",
    shortName: "JAYS",
    sport: "Baseball",
    venue: "Rogers Centre",
    colorFrom: "#0e2f63",
    colorTo: "#1c5ca3",
  },
  {
    id: "raptors",
    name: "Toronto Raptors",
    shortName: "RAPTORS",
    sport: "Basketball",
    venue: "Scotiabank Arena",
    colorFrom: "#8a0f32",
    colorTo: "#ce1141",
  },
];

export const PLAYERS: Player[] = [
  { id: "matthews", teamId: "leafs", name: "Auston Matthews", position: "Centre", isFavourite: true },
  { id: "marner", teamId: "leafs", name: "Mitch Marner", position: "Right Wing", isFavourite: false },
  { id: "nylander", teamId: "leafs", name: "William Nylander", position: "Right Wing", isFavourite: false },
  { id: "vladdy", teamId: "jays", name: "Vladimir Guerrero Jr.", position: "First Base", isFavourite: true },
  { id: "bichette", teamId: "jays", name: "Bo Bichette", position: "Shortstop", isFavourite: false },
  { id: "kirk", teamId: "jays", name: "Alejandro Kirk", position: "Catcher", isFavourite: false },
];

export const teamById = (id: string) => TEAMS.find((t) => t.id === id);
export const playerById = (id: string) => PLAYERS.find((p) => p.id === id);
