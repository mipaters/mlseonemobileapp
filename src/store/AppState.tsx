import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type {
  TeamId,
  Mission,
  Ticket,
  CartItem,
  DigitalLockerItem,
  CitoMessage,
  FanDNASignal,
  AgentActivityEvent,
  PrivacyPreferences,
  GeneratedReel,
  RedeemedReward,
  PurchasedItem,
} from "../types";
import { MIKE_PROFILE, DEFAULT_PRIVACY_PREFERENCES, FAN_DNA_BASE, NEXT_BEST_ACTION } from "../data/profile";
import { MISSIONS, missionById } from "../data/rewards";
import { TICKETS } from "../data/gameDay";
import { INITIAL_SIGNALS, INITIAL_AGENT_ACTIVITY, AGENTS } from "../data/fanIntelligence";

export type DesktopViewMode = "fan" | "executive";

export interface AppState {
  activeNavTab: "home" | "watch" | "gameday" | "rewards" | "cito";
  activeGameDayTeam: TeamId;
  likedContent: string[];
  savedContent: string[];
  hiddenContent: string[];
  watchedContent: string[];
  generatedReels: GeneratedReel[];
  rewardsBalance: number;
  missions: Mission[];
  redeemedRewards: RedeemedReward[];
  gameDayPlanAccepted: Record<TeamId, boolean>;
  venueArrived: Record<TeamId, boolean>;
  tickets: Ticket[];
  cart: CartItem[];
  purchasedItems: PurchasedItem[];
  digitalLocker: DigitalLockerItem[];
  citoHistory: CitoMessage[];
  signals: FanDNASignal[];
  agentActivity: AgentActivityEvent[];
  fanDNA: typeof FAN_DNA_BASE;
  nextBestAction: string;
  privacy: PrivacyPreferences;
  walkthroughActive: boolean;
  walkthroughStep: number;
  desktopView: DesktopViewMode;
  phonePanelVisible: boolean;
  toast: string | null;
  lastPersonalizationCycleAt: string | null;
}

const STORAGE_KEY = "mlse-one-demo-state-v1";

function freshState(): AppState {
  return {
    activeNavTab: "home",
    activeGameDayTeam: "leafs",
    likedContent: [],
    savedContent: [],
    hiddenContent: [],
    watchedContent: [],
    generatedReels: [],
    rewardsBalance: MIKE_PROFILE.rewardsBalance,
    missions: MISSIONS.map((m) => ({ ...m })),
    redeemedRewards: [],
    gameDayPlanAccepted: { leafs: false, jays: false },
    venueArrived: { leafs: false, jays: false },
    tickets: TICKETS.map((t) => ({ ...t })),
    cart: [],
    purchasedItems: [],
    digitalLocker: [
      { id: "locker-leafs-jersey", name: "Leafs Jersey", type: "Merchandise", teamId: "leafs" },
      { id: "locker-jays-cap", name: "Jays Cap", type: "Merchandise", teamId: "jays" },
    ],
    citoHistory: [],
    signals: [...INITIAL_SIGNALS],
    agentActivity: [...INITIAL_AGENT_ACTIVITY],
    fanDNA: { ...FAN_DNA_BASE },
    nextBestAction: NEXT_BEST_ACTION,
    privacy: { ...DEFAULT_PRIVACY_PREFERENCES },
    walkthroughActive: false,
    walkthroughStep: 0,
    desktopView: "fan",
    phonePanelVisible: true,
    toast: null,
    lastPersonalizationCycleAt: null,
  };
}

function loadState(): AppState {
  if (typeof window === "undefined") return freshState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw);
    return { ...freshState(), ...parsed };
  } catch {
    return freshState();
  }
}

type Action =
  | { type: "SET_NAV_TAB"; tab: AppState["activeNavTab"] }
  | { type: "SET_GAMEDAY_TEAM"; team: TeamId }
  | { type: "TOGGLE_LIKE"; id: string }
  | { type: "TOGGLE_SAVE"; id: string }
  | { type: "HIDE_CONTENT"; id: string }
  | { type: "MARK_WATCHED"; id: string }
  | { type: "ADD_REEL"; reel: GeneratedReel }
  | { type: "COMPLETE_MISSION"; id: string }
  | { type: "BUMP_MISSION_PROGRESS"; id: string }
  | { type: "REDEEM_REWARD"; id: string; pointCost: number }
  | { type: "ACCEPT_GAMEDAY_PLAN"; team: TeamId }
  | { type: "SIMULATE_VENUE_ARRIVAL"; team: TeamId }
  | { type: "UPGRADE_SEAT"; team: TeamId; section: string }
  | { type: "ADD_TO_CART"; item: CartItem }
  | { type: "CHECKOUT" }
  | { type: "ADD_CITO_MESSAGE"; message: CitoMessage }
  | { type: "ADD_SIGNAL"; label: string }
  | { type: "ADD_AGENT_ACTIVITY"; agent: string; message: string }
  | { type: "ADJUST_FAN_DNA"; patch: Partial<typeof FAN_DNA_BASE> }
  | { type: "SET_NEXT_BEST_ACTION"; action: string }
  | { type: "SET_PRIVACY"; patch: Partial<PrivacyPreferences> }
  | { type: "START_WALKTHROUGH" }
  | { type: "EXIT_WALKTHROUGH" }
  | { type: "SET_WALKTHROUGH_STEP"; step: number }
  | { type: "SET_DESKTOP_VIEW"; view: DesktopViewMode }
  | { type: "TOGGLE_PHONE_PANEL" }
  | { type: "SET_TOAST"; message: string | null }
  | { type: "RUN_PERSONALIZATION_CYCLE" }
  | { type: "RESET_DEMO" }
  | { type: "CLEAR_ACTIVITY" };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_NAV_TAB":
      return { ...state, activeNavTab: action.tab };
    case "SET_GAMEDAY_TEAM":
      return { ...state, activeGameDayTeam: action.team };
    case "TOGGLE_LIKE":
      return {
        ...state,
        likedContent: state.likedContent.includes(action.id)
          ? state.likedContent.filter((i) => i !== action.id)
          : [...state.likedContent, action.id],
      };
    case "TOGGLE_SAVE":
      return {
        ...state,
        savedContent: state.savedContent.includes(action.id)
          ? state.savedContent.filter((i) => i !== action.id)
          : [...state.savedContent, action.id],
      };
    case "HIDE_CONTENT":
      return { ...state, hiddenContent: [...state.hiddenContent, action.id] };
    case "MARK_WATCHED":
      return {
        ...state,
        watchedContent: state.watchedContent.includes(action.id)
          ? state.watchedContent
          : [...state.watchedContent, action.id],
      };
    case "ADD_REEL":
      return {
        ...state,
        generatedReels: [action.reel, ...state.generatedReels],
        digitalLocker: [
          { id: `locker-${action.reel.id}`, name: action.reel.title, type: "Highlight", teamId: action.reel.teamId },
          ...state.digitalLocker,
        ],
      };
    case "COMPLETE_MISSION": {
      const mission = state.missions.find((m) => m.id === action.id);
      if (!mission || mission.completed) return state;
      return {
        ...state,
        missions: state.missions.map((m) =>
          m.id === action.id ? { ...m, completed: true, progress: m.target } : m
        ),
        rewardsBalance: state.rewardsBalance + mission.pointsReward,
      };
    }
    case "BUMP_MISSION_PROGRESS": {
      return {
        ...state,
        missions: state.missions.map((m) => {
          if (m.id !== action.id || m.completed) return m;
          const progress = Math.min(m.target, m.progress + 1);
          const completed = progress >= m.target;
          return { ...m, progress, completed };
        }),
      };
    }
    case "REDEEM_REWARD": {
      if (state.rewardsBalance < action.pointCost) return state;
      return {
        ...state,
        rewardsBalance: state.rewardsBalance - action.pointCost,
        redeemedRewards: [
          { id: `redeemed-${Date.now()}`, rewardId: action.id, redeemedAt: new Date().toISOString() },
          ...state.redeemedRewards,
        ],
      };
    }
    case "ACCEPT_GAMEDAY_PLAN":
      return {
        ...state,
        gameDayPlanAccepted: { ...state.gameDayPlanAccepted, [action.team]: true },
        rewardsBalance: state.rewardsBalance + 150,
      };
    case "SIMULATE_VENUE_ARRIVAL":
      return {
        ...state,
        venueArrived: { ...state.venueArrived, [action.team]: true },
        tickets: state.tickets.map((t) => (t.teamId === action.team ? { ...t, status: "Active" } : t)),
      };
    case "UPGRADE_SEAT":
      return {
        ...state,
        tickets: state.tickets.map((t) =>
          t.teamId === action.team ? { ...t, section: action.section, status: "Upgraded" } : t
        ),
      };
    case "ADD_TO_CART":
      return { ...state, cart: [...state.cart, action.item] };
    case "CHECKOUT": {
      if (state.cart.length === 0) return state;
      const newLockerItems: DigitalLockerItem[] = state.cart.map((c) => ({
        id: `locker-${c.itemId}-${Date.now()}-${Math.random()}`,
        name: c.itemId,
        type: "Merchandise",
      }));
      const newPurchases: PurchasedItem[] = state.cart.map((c) => ({
        id: `purchase-${c.itemId}-${Date.now()}-${Math.random()}`,
        itemId: c.itemId,
        size: c.size,
        color: c.color,
        purchasedAt: new Date().toISOString(),
      }));
      return {
        ...state,
        cart: [],
        purchasedItems: [...newPurchases, ...state.purchasedItems],
        digitalLocker: [...newLockerItems, ...state.digitalLocker],
      };
    }
    case "ADD_CITO_MESSAGE":
      return { ...state, citoHistory: [...state.citoHistory, action.message] };
    case "ADD_SIGNAL":
      return {
        ...state,
        signals: [
          { id: `sig-${Date.now()}-${Math.random()}`, label: action.label, timestamp: "Just now" },
          ...state.signals,
        ].slice(0, 20),
      };
    case "ADD_AGENT_ACTIVITY":
      return {
        ...state,
        agentActivity: [
          { id: `act-${Date.now()}-${Math.random()}`, agent: action.agent, message: action.message, timestamp: "Just now" },
          ...state.agentActivity,
        ].slice(0, 30),
      };
    case "ADJUST_FAN_DNA":
      return { ...state, fanDNA: { ...state.fanDNA, ...action.patch } };
    case "SET_NEXT_BEST_ACTION":
      return { ...state, nextBestAction: action.action };
    case "SET_PRIVACY":
      return { ...state, privacy: { ...state.privacy, ...action.patch } };
    case "START_WALKTHROUGH":
      return { ...state, walkthroughActive: true, walkthroughStep: 0, desktopView: "fan" };
    case "EXIT_WALKTHROUGH":
      return { ...state, walkthroughActive: false };
    case "SET_WALKTHROUGH_STEP":
      return { ...state, walkthroughStep: action.step };
    case "SET_DESKTOP_VIEW":
      return { ...state, desktopView: action.view };
    case "TOGGLE_PHONE_PANEL":
      return { ...state, phonePanelVisible: !state.phonePanelVisible };
    case "SET_TOAST":
      return { ...state, toast: action.message };
    case "RUN_PERSONALIZATION_CYCLE":
      return { ...state, lastPersonalizationCycleAt: new Date().toISOString(), nextBestAction: NEXT_BEST_ACTION };
    case "CLEAR_ACTIVITY":
      return { ...state, signals: [], agentActivity: [], citoHistory: [] };
    case "RESET_DEMO":
      return freshState();
    default:
      return state;
  }
}

interface AppActions {
  setNavTab: (tab: AppState["activeNavTab"]) => void;
  setGameDayTeam: (team: TeamId) => void;
  toggleLike: (id: string) => void;
  toggleSave: (id: string) => void;
  hideContent: (id: string) => void;
  markWatched: (id: string) => void;
  addReel: (reel: GeneratedReel) => void;
  completeMission: (id: string) => void;
  bumpMissionProgress: (id: string) => void;
  redeemReward: (id: string, pointCost: number) => void;
  acceptGameDayPlan: (team: TeamId) => void;
  simulateVenueArrival: (team: TeamId) => void;
  upgradeSeat: (team: TeamId, section: string) => void;
  addToCart: (item: CartItem) => void;
  checkout: () => void;
  addCitoMessage: (message: CitoMessage) => void;
  addSignal: (label: string) => void;
  addAgentActivity: (agent: string, message: string) => void;
  adjustFanDNA: (patch: Partial<typeof FAN_DNA_BASE>) => void;
  setNextBestAction: (action: string) => void;
  setPrivacy: (patch: Partial<PrivacyPreferences>) => void;
  startWalkthrough: () => void;
  exitWalkthrough: () => void;
  setWalkthroughStep: (step: number) => void;
  setDesktopView: (view: DesktopViewMode) => void;
  togglePhonePanel: () => void;
  showToast: (message: string) => void;
  clearToast: () => void;
  runPersonalizationCycle: () => void;
  resetDemo: () => void;
  clearActivity: () => void;
  randomAgent: () => string;
}

interface AppStateContextValue {
  state: AppState;
  actions: AppActions;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage errors
    }
  }, [state]);

  const actions = useMemo<AppActions>(
    () => ({
      setNavTab: (tab) => dispatch({ type: "SET_NAV_TAB", tab }),
      setGameDayTeam: (team) => dispatch({ type: "SET_GAMEDAY_TEAM", team }),
      toggleLike: (id) => dispatch({ type: "TOGGLE_LIKE", id }),
      toggleSave: (id) => dispatch({ type: "TOGGLE_SAVE", id }),
      hideContent: (id) => dispatch({ type: "HIDE_CONTENT", id }),
      markWatched: (id) => dispatch({ type: "MARK_WATCHED", id }),
      addReel: (reel) => dispatch({ type: "ADD_REEL", reel }),
      completeMission: (id) => dispatch({ type: "COMPLETE_MISSION", id }),
      bumpMissionProgress: (id) => dispatch({ type: "BUMP_MISSION_PROGRESS", id }),
      redeemReward: (id, pointCost) => dispatch({ type: "REDEEM_REWARD", id, pointCost }),
      acceptGameDayPlan: (team) => dispatch({ type: "ACCEPT_GAMEDAY_PLAN", team }),
      simulateVenueArrival: (team) => dispatch({ type: "SIMULATE_VENUE_ARRIVAL", team }),
      upgradeSeat: (team, section) => dispatch({ type: "UPGRADE_SEAT", team, section }),
      addToCart: (item) => dispatch({ type: "ADD_TO_CART", item }),
      checkout: () => dispatch({ type: "CHECKOUT" }),
      addCitoMessage: (message) => dispatch({ type: "ADD_CITO_MESSAGE", message }),
      addSignal: (label) => dispatch({ type: "ADD_SIGNAL", label }),
      addAgentActivity: (agent, message) => dispatch({ type: "ADD_AGENT_ACTIVITY", agent, message }),
      adjustFanDNA: (patch) => dispatch({ type: "ADJUST_FAN_DNA", patch }),
      setNextBestAction: (action) => dispatch({ type: "SET_NEXT_BEST_ACTION", action }),
      setPrivacy: (patch) => dispatch({ type: "SET_PRIVACY", patch }),
      startWalkthrough: () => dispatch({ type: "START_WALKTHROUGH" }),
      exitWalkthrough: () => dispatch({ type: "EXIT_WALKTHROUGH" }),
      setWalkthroughStep: (step) => dispatch({ type: "SET_WALKTHROUGH_STEP", step }),
      setDesktopView: (view) => dispatch({ type: "SET_DESKTOP_VIEW", view }),
      togglePhonePanel: () => dispatch({ type: "TOGGLE_PHONE_PANEL" }),
      showToast: (message) => dispatch({ type: "SET_TOAST", message }),
      clearToast: () => dispatch({ type: "SET_TOAST", message: null }),
      runPersonalizationCycle: () => dispatch({ type: "RUN_PERSONALIZATION_CYCLE" }),
      resetDemo: () => dispatch({ type: "RESET_DEMO" }),
      clearActivity: () => dispatch({ type: "CLEAR_ACTIVITY" }),
      randomAgent: () => AGENTS[Math.floor(Math.random() * AGENTS.length)],
    }),
    []
  );

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}

export function useMissionHelpers() {
  const { actions } = useAppState();
  return {
    bumpOrComplete: (id: string) => {
      const m = missionById(id);
      if (!m) return;
      actions.bumpMissionProgress(id);
    },
  };
}
