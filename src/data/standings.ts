import type { StandingsTable, ScoringLeaderboard, TeamNewsStory } from "../types";

// NOTE: Illustrative demo data — not live standings/stats.
export const STANDINGS: StandingsTable[] = [
  {
    teamId: "leafs",
    league: "NHL",
    division: "Atlantic Division",
    rows: [
      { team: "Florida Panthers", abbreviation: "FLA", gamesPlayed: 62, wins: 40, losses: 18, points: 84 },
      { team: "Toronto Maple Leafs", abbreviation: "TOR", gamesPlayed: 62, wins: 38, losses: 19, points: 81, isUserTeam: true },
      { team: "Tampa Bay Lightning", abbreviation: "TBL", gamesPlayed: 61, wins: 35, losses: 21, points: 75 },
      { team: "Boston Bruins", abbreviation: "BOS", gamesPlayed: 62, wins: 33, losses: 23, points: 72 },
      { team: "Ottawa Senators", abbreviation: "OTT", gamesPlayed: 61, wins: 30, losses: 26, points: 65 },
    ],
  },
  {
    teamId: "jays",
    league: "MLB",
    division: "AL East",
    rows: [
      { team: "New York Yankees", abbreviation: "NYY", gamesPlayed: 94, wins: 54, losses: 40, points: 54 },
      { team: "Toronto Blue Jays", abbreviation: "TOR", gamesPlayed: 93, wins: 51, losses: 42, points: 51, isUserTeam: true },
      { team: "Boston Red Sox", abbreviation: "BOS", gamesPlayed: 93, wins: 48, losses: 45, points: 48 },
      { team: "Tampa Bay Rays", abbreviation: "TB", gamesPlayed: 94, wins: 45, losses: 49, points: 45 },
      { team: "Baltimore Orioles", abbreviation: "BAL", gamesPlayed: 93, wins: 41, losses: 52, points: 41 },
    ],
  },
  {
    teamId: "raptors",
    league: "NBA",
    division: "Atlantic Division",
    rows: [
      { team: "Boston Celtics", abbreviation: "BOS", gamesPlayed: 58, wins: 38, losses: 20, points: 38 },
      { team: "New York Knicks", abbreviation: "NYK", gamesPlayed: 58, wins: 34, losses: 24, points: 34 },
      { team: "Toronto Raptors", abbreviation: "TOR", gamesPlayed: 57, wins: 28, losses: 29, points: 28, isUserTeam: true },
      { team: "Philadelphia 76ers", abbreviation: "PHI", gamesPlayed: 58, wins: 26, losses: 32, points: 26 },
      { team: "Brooklyn Nets", abbreviation: "BKN", gamesPlayed: 58, wins: 19, losses: 39, points: 19 },
    ],
  },
];

export const SCORING_LEADERS: ScoringLeaderboard[] = [
  {
    teamId: "leafs",
    heading: "Points Leaders",
    leaders: [
      { name: "Auston Matthews", statLine: "44 G · 39 A", primaryStat: "83 PTS" },
      { name: "Matthew Knies", statLine: "29 G · 34 A", primaryStat: "63 PTS" },
      { name: "William Nylander", statLine: "33 G · 40 A", primaryStat: "73 PTS" },
      { name: "John Tavares", statLine: "26 G · 31 A", primaryStat: "57 PTS" },
    ],
  },
  {
    teamId: "jays",
    heading: "Batting Leaders",
    leaders: [
      { name: "Vladimir Guerrero Jr.", statLine: ".312 AVG · 88 RBI", primaryStat: ".312" },
      { name: "Bo Bichette", statLine: ".298 AVG · 74 RBI", primaryStat: ".298" },
      { name: "George Springer", statLine: ".271 AVG · 65 RBI", primaryStat: ".271" },
      { name: "Daulton Varsho", statLine: ".254 AVG · 52 RBI", primaryStat: ".254" },
    ],
  },
  {
    teamId: "raptors",
    heading: "Scoring Leaders",
    leaders: [
      { name: "Scottie Barnes", statLine: "24.1 PPG · 8.2 REB", primaryStat: "24.1" },
      { name: "RJ Barrett", statLine: "21.4 PPG · 5.1 AST", primaryStat: "21.4" },
      { name: "Immanuel Quickley", statLine: "18.6 PPG · 6.3 AST", primaryStat: "18.6" },
      { name: "Jakob Poeltl", statLine: "12.8 PPG · 9.4 REB", primaryStat: "12.8" },
    ],
  },
];

export const TEAM_NEWS: TeamNewsStory[] = [
  {
    id: "news-leafs-1",
    teamId: "leafs",
    headline: "Matthews hits 44 goals as Leafs roll past Bruins",
    source: "Sportsnet",
    timeAgo: "2h ago",
    url: "https://www.sportsnet.ca/hockey/nhl/toronto-maple-leafs/",
  },
  {
    id: "news-leafs-2",
    teamId: "leafs",
    headline: "Leafs power play surging at the right time",
    source: "Sportsnet",
    timeAgo: "6h ago",
    url: "https://www.sportsnet.ca/hockey/nhl/toronto-maple-leafs/",
  },
  {
    id: "news-jays-1",
    teamId: "jays",
    headline: "Guerrero Jr. homers twice as Blue Jays take the series",
    source: "Sportsnet",
    timeAgo: "2h ago",
    url: "https://www.sportsnet.ca/baseball/mlb/toronto-blue-jays/",
  },
  {
    id: "news-jays-2",
    teamId: "jays",
    headline: "Blue Jays rotation rounding into form for the stretch run",
    source: "Sportsnet",
    timeAgo: "8h ago",
    url: "https://www.sportsnet.ca/baseball/mlb/toronto-blue-jays/",
  },
  {
    id: "news-raptors-1",
    teamId: "raptors",
    headline: "Scottie Barnes drops season-high 34 as Raptors edge Knicks",
    source: "Sportsnet",
    timeAgo: "3h ago",
    url: "https://www.sportsnet.ca/basketball/nba/toronto-raptors/",
  },
  {
    id: "news-raptors-2",
    teamId: "raptors",
    headline: "Raptors frontcourt depth paying off down the stretch",
    source: "Sportsnet",
    timeAgo: "9h ago",
    url: "https://www.sportsnet.ca/basketball/nba/toronto-raptors/",
  },
];

export const standingsByTeam = (teamId: "leafs" | "jays" | "raptors") => STANDINGS.find((s) => s.teamId === teamId);
export const scoringLeadersByTeam = (teamId: "leafs" | "jays" | "raptors") => SCORING_LEADERS.find((s) => s.teamId === teamId);
