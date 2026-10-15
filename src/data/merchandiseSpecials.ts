import jaysRetroCap from "../assets/jays-retro-cap.png";
import barnesJersey from "../assets/barnes-raptors-jersey.png";
import mckennaJersey from "../assets/mckenna-leafs-jersey.png";

export interface MerchandiseSpecial {
  id: string;
  name: string;
  team: "Blue Jays" | "Raptors" | "Maple Leafs";
  teamColor: string;
  category: string;
  price: number;
  originalPrice?: number;
  reason: string;
  image: string;
}

export const MERCHANDISE_SPECIALS: MerchandiseSpecial[] = [
  {
    id: "jays-retro-cap",
    name: "Blue Jays Retro '47 Cap",
    team: "Blue Jays",
    teamColor: "jays",
    category: "Headwear",
    price: 39.99,
    originalPrice: 49.99,
    reason: "Matches your Jays game-day fits",
    image: jaysRetroCap,
  },
  {
    id: "barnes-raptors-jersey",
    name: "Scottie Barnes Raptors Jersey",
    team: "Raptors",
    teamColor: "raptors",
    category: "Jersey",
    price: 129.99,
    reason: "Trending with Toronto fans this week",
    image: barnesJersey,
  },
  {
    id: "mckenna-leafs-jersey",
    name: "Gavin McKenna Maple Leafs Jersey",
    team: "Maple Leafs",
    teamColor: "leafs",
    category: "Jersey",
    price: 149.99,
    reason: "Picked for your Leafs fan profile",
    image: mckennaJersey,
  },
];
