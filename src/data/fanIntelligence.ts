import type { FanDNASignal, AgentActivityEvent, ExecutiveKPI } from "../types";

export const INITIAL_SIGNALS: FanDNASignal[] = [
  { id: "sig-1", label: "Watched Leafs recap", timestamp: "2h ago" },
  { id: "sig-2", label: "Saved Jays preview", timestamp: "5h ago" },
  { id: "sig-3", label: "Opened Leafs ticket", timestamp: "Yesterday" },
  { id: "sig-4", label: "Viewed Guerrero Jr. jersey", timestamp: "Yesterday" },
  { id: "sig-5", label: "Completed Toronto Doubleheader mission", timestamp: "2 days ago" },
  { id: "sig-6", label: "Asked Cito about seat upgrades", timestamp: "3 days ago" },
  { id: "sig-7", label: "Simulated venue arrival", timestamp: "5 days ago" },
];

export const AGENTS = [
  "Fan Profile Agent",
  "Content Curation Agent",
  "Video Assembly Agent",
  "Game-Day Agent",
  "Rewards Agent",
  "Commerce Agent",
  "Partner Relevance Agent",
  "Measurement Agent",
] as const;

export const INITIAL_AGENT_ACTIVITY: AgentActivityEvent[] = [
  { id: "act-1", agent: "Fan Profile Agent", message: "Fan signal received", timestamp: "2h ago" },
  { id: "act-2", agent: "Content Curation Agent", message: "Content ranked for Mike", timestamp: "3h ago" },
  { id: "act-3", agent: "Game-Day Agent", message: "Leafs affinity recalculated", timestamp: "5h ago" },
  { id: "act-4", agent: "Rewards Agent", message: "Rewards mission triggered", timestamp: "Yesterday" },
  { id: "act-5", agent: "Partner Relevance Agent", message: "Offer eligibility checked", timestamp: "Yesterday" },
];

export const PERSONALIZATION_CYCLE_STEPS = [
  "Reading Mike's latest interactions",
  "Updating Fan DNA",
  "Recalculating affinities",
  "Ranking available content",
  "Evaluating active games",
  "Evaluating rewards",
  "Selecting the next best action",
  "Updating Mike's Home screen",
];

export const EXECUTIVE_KPIS: ExecutiveKPI[] = [
  { id: "mau", label: "Monthly Active Fans", value: "482K", delta: "+12%" },
  { id: "cross-team", label: "Cross-Team Engagement", value: "61%", delta: "+8%" },
  { id: "content-completion", label: "Personalized Content Completion", value: "74%", delta: "+15%" },
  { id: "cito-engagement", label: "Ask Cito Engagement", value: "39%", delta: "+22%" },
  { id: "ticket-conversion", label: "Ticket Conversion", value: "18%", delta: "+6%" },
  { id: "upgrade-conversion", label: "Seat-Upgrade Conversion", value: "24%", delta: "+19%" },
  { id: "merch-conversion", label: "Merchandise Conversion", value: "14%", delta: "+9%" },
  { id: "rewards-participation", label: "Rewards Participation", value: "67%", delta: "+11%" },
  { id: "partner-engagement", label: "Partner-Offer Engagement", value: "31%", delta: "+7%" },
  { id: "self-service", label: "Self-Service Resolution", value: "58%", delta: "+28%" },
  { id: "arpu", label: "Avg. Revenue per Engaged Fan", value: "$214", delta: "+13%" },
  { id: "ltv", label: "Fan Lifetime Value Opportunity", value: "$1,860", delta: "+17%" },
];

export const FAN_FUNNEL = [
  { stage: "Known Fan", value: 100 },
  { stage: "Engaged Fan", value: 78 },
  { stage: "Personalized Fan", value: 61 },
  { stage: "Transacting Fan", value: 42 },
  { stage: "Loyal Fan", value: 31 },
  { stage: "Multi-Team Fan", value: 22 },
];

export const REVENUE_POOLS = [
  { name: "Ticketing", value: 32 },
  { name: "Seat Upgrades", value: 18 },
  { name: "Merchandise", value: 15 },
  { name: "Food & Beverage", value: 12 },
  { name: "Sponsorship", value: 10 },
  { name: "Advertising & Media", value: 6 },
  { name: "Loyalty", value: 4 },
  { name: "Premium Experiences", value: 3 },
];

export interface ArchitectureNode {
  id: string;
  layer: string;
  name: string;
  purpose: string;
  dataUsed: string;
  output: string;
  enabledExperience: string;
  businessValue: string;
}

export const ARCHITECTURE_LAYERS: { id: string; title: string; nodeIds: string[] }[] = [
  { id: "experience", title: "Experience Layer", nodeIds: ["mobile-exp", "home-exp", "watch-exp", "cito-exp", "gameday-exp", "rewards-exp", "commerce-exp", "locker-exp"] },
  { id: "ai", title: "AI and Agent Layer", nodeIds: ["foundry", "openai", "cito-orch", "sportsiq-agents", "ranking", "nba-decision", "evaluation", "guardrails"] },
  { id: "data", title: "Data and Intelligence Layer", nodeIds: ["fabric", "onelake", "fan-profile", "event-streams", "semantic-model", "analytics", "measurement"] },
  { id: "operational", title: "Operational Sources", nodeIds: ["ticketing-src", "team-apps", "venue-systems", "loyalty-src", "merch-src", "fnb-src", "content-engagement", "customer-service", "partner-activations", "consent-src"] },
  { id: "integration", title: "Integration Layer", nodeIds: ["video-provider", "league-systems", "ticketing-platform", "payment-provider", "merch-provider", "partner-systems", "venue-tech"] },
  { id: "security", title: "Security and Governance", nodeIds: ["entra", "purview", "consent-mgmt", "rbac", "data-protection", "responsible-ai", "monitoring"] },
];

export const ARCHITECTURE_NODES: ArchitectureNode[] = [
  { id: "mobile-exp", layer: "experience", name: "MLSE One Mobile Experience", purpose: "Primary fan-facing app surface", dataUsed: "Fan profile, content, tickets", output: "Personalized mobile UI", enabledExperience: "All fan journeys", businessValue: "Engagement and retention" },
  { id: "home-exp", layer: "experience", name: "Personalized Home", purpose: "Surface next-best content and actions", dataUsed: "Fan DNA, signals", output: "Ranked home feed", enabledExperience: "Daily engagement", businessValue: "Session frequency" },
  { id: "watch-exp", layer: "experience", name: "Watch", purpose: "Deliver personalized video", dataUsed: "Content affinity", output: "Ranked video chapters", enabledExperience: "Content consumption", businessValue: "Media value" },
  { id: "cito-exp", layer: "experience", name: "Ask Cito", purpose: "Conversational concierge", dataUsed: "Intent, fan profile", output: "Deterministic responses", enabledExperience: "Self-service", businessValue: "Reduced support cost" },
  { id: "gameday-exp", layer: "experience", name: "Game-Day Mode", purpose: "Venue-aware companion", dataUsed: "Ticket, location signal", output: "Live game-day guidance", enabledExperience: "In-venue journeys", businessValue: "Upgrade and F&B revenue" },
  { id: "rewards-exp", layer: "experience", name: "Rewards", purpose: "Loyalty and missions", dataUsed: "Activity, tier", output: "Points and missions", enabledExperience: "Retention loop", businessValue: "Loyalty value" },
  { id: "commerce-exp", layer: "experience", name: "Commerce", purpose: "Merchandise discovery and checkout", dataUsed: "Merchandise propensity", output: "Ranked product recommendations", enabledExperience: "Shopping journeys", businessValue: "Merchandise revenue" },
  { id: "locker-exp", layer: "experience", name: "Digital Locker", purpose: "Unified ownership record", dataUsed: "Purchases, redemptions", output: "Locker inventory", enabledExperience: "Post-purchase experience", businessValue: "Brand affinity" },
  { id: "foundry", layer: "ai", name: "Azure AI Foundry", purpose: "Host and orchestrate AI models", dataUsed: "Prompts, fan context", output: "Model responses", enabledExperience: "Ask Cito, SportsIQ", businessValue: "Scalable intelligence" },
  { id: "openai", layer: "ai", name: "Azure OpenAI Models", purpose: "Natural language understanding", dataUsed: "Conversation history", output: "Generated responses", enabledExperience: "Ask Cito", businessValue: "Conversational quality" },
  { id: "cito-orch", layer: "ai", name: "Ask Cito Orchestration", purpose: "Route intents to journeys", dataUsed: "Intent catalog", output: "Journey selection", enabledExperience: "Ask Cito", businessValue: "Reliable automation" },
  { id: "sportsiq-agents", layer: "ai", name: "SportsIQ Agents", purpose: "Coordinate fan intelligence tasks", dataUsed: "Fan profile, signals", output: "Recommendations", enabledExperience: "Personalization everywhere", businessValue: "Decision automation" },
  { id: "ranking", layer: "ai", name: "Content Ranking", purpose: "Rank content relevance", dataUsed: "Affinity scores", output: "Ranked content list", enabledExperience: "Home, Watch, Feed", businessValue: "Engagement lift" },
  { id: "nba-decision", layer: "ai", name: "Next-Best-Action Decisioning", purpose: "Select optimal next action", dataUsed: "Propensity scores", output: "Recommended action", enabledExperience: "Home, Game Day", businessValue: "Conversion lift" },
  { id: "evaluation", layer: "ai", name: "Evaluation", purpose: "Monitor model quality", dataUsed: "Model outputs", output: "Quality metrics", enabledExperience: "All AI surfaces", businessValue: "Trust and reliability" },
  { id: "guardrails", layer: "ai", name: "Guardrails", purpose: "Ensure safe, responsible responses", dataUsed: "Policy rules", output: "Filtered responses", enabledExperience: "Ask Cito", businessValue: "Responsible AI" },
  { id: "fabric", layer: "data", name: "Microsoft Fabric", purpose: "Unified analytics platform", dataUsed: "All fan data sources", output: "Unified data estate", enabledExperience: "SportsIQ foundation", businessValue: "Single source of truth" },
  { id: "onelake", layer: "data", name: "OneLake", purpose: "Unified data lake storage", dataUsed: "Raw and curated data", output: "Shared data layer", enabledExperience: "SportsIQ foundation", businessValue: "Reduced duplication" },
  { id: "fan-profile", layer: "data", name: "Unified Fan Profile", purpose: "Single view of Mike", dataUsed: "All touchpoints", output: "Fan DNA", enabledExperience: "Personalization everywhere", businessValue: "One-fan relationship" },
  { id: "event-streams", layer: "data", name: "Real-Time Event Streams", purpose: "Capture live fan interactions", dataUsed: "App events", output: "Streaming signals", enabledExperience: "Real-time personalization", businessValue: "Responsiveness" },
  { id: "semantic-model", layer: "data", name: "SportsIQ Semantic Model", purpose: "Business-friendly data model", dataUsed: "Curated fan data", output: "Reusable metrics", enabledExperience: "Executive View", businessValue: "Faster insight" },
  { id: "analytics", layer: "data", name: "Analytics", purpose: "Measure engagement and revenue", dataUsed: "Fan and transaction data", output: "Dashboards", enabledExperience: "Executive View", businessValue: "Informed decisions" },
  { id: "measurement", layer: "data", name: "Measurement", purpose: "Attribute outcomes to actions", dataUsed: "Conversion events", output: "Attribution reports", enabledExperience: "Executive View", businessValue: "ROI clarity" },
  { id: "ticketing-src", layer: "operational", name: "Ticketing", purpose: "Source ticket inventory and sales", dataUsed: "Ticket transactions", output: "Ticket data", enabledExperience: "Game Day, Tickets", businessValue: "Ticketing revenue" },
  { id: "team-apps", layer: "operational", name: "Team Applications", purpose: "Existing team-specific apps", dataUsed: "Team engagement data", output: "Team-level signals", enabledExperience: "Content personalization", businessValue: "Unified fan view" },
  { id: "venue-systems", layer: "operational", name: "Venue Systems", purpose: "Venue operations data", dataUsed: "Gate, seating data", output: "Venue signals", enabledExperience: "Game Day", businessValue: "Operational efficiency" },
  { id: "loyalty-src", layer: "operational", name: "Loyalty", purpose: "Track rewards and tiers", dataUsed: "Points, redemptions", output: "Loyalty data", enabledExperience: "Rewards", businessValue: "Retention" },
  { id: "merch-src", layer: "operational", name: "Merchandise", purpose: "Product catalog and inventory", dataUsed: "Product data", output: "Catalog data", enabledExperience: "Commerce", businessValue: "Merchandise revenue" },
  { id: "fnb-src", layer: "operational", name: "Food and Beverage", purpose: "Concession data", dataUsed: "Order and wait data", output: "F&B signals", enabledExperience: "Game Day", businessValue: "F&B revenue" },
  { id: "content-engagement", layer: "operational", name: "Content Engagement", purpose: "Track video and content usage", dataUsed: "Watch events", output: "Engagement data", enabledExperience: "Watch", businessValue: "Content strategy" },
  { id: "customer-service", layer: "operational", name: "Customer Service", purpose: "Support interactions", dataUsed: "Support tickets", output: "Service signals", enabledExperience: "Ask Cito", businessValue: "Reduced support cost" },
  { id: "partner-activations", layer: "operational", name: "Partner Activations", purpose: "Sponsor offer delivery", dataUsed: "Offer engagement", output: "Partner data", enabledExperience: "Partner Experiences", businessValue: "Sponsorship value" },
  { id: "consent-src", layer: "operational", name: "Consent and Preferences", purpose: "Track fan consent", dataUsed: "Preference settings", output: "Consent records", enabledExperience: "Privacy Controls", businessValue: "Responsible personalization" },
  { id: "video-provider", layer: "integration", name: "Sports Video Provider", purpose: "Supply video content", dataUsed: "Video metadata", output: "Streamable content", enabledExperience: "Watch", businessValue: "Content supply" },
  { id: "league-systems", layer: "integration", name: "League Content Systems", purpose: "NHL/MLB content feeds", dataUsed: "League data", output: "Official content", enabledExperience: "Watch, Home", businessValue: "Content breadth" },
  { id: "ticketing-platform", layer: "integration", name: "Ticketing Platform", purpose: "Ticket sales integration", dataUsed: "Inventory, pricing", output: "Ticket availability", enabledExperience: "Tickets", businessValue: "Ticketing revenue" },
  { id: "payment-provider", layer: "integration", name: "Payment Provider", purpose: "Process transactions", dataUsed: "Payment tokens", output: "Transaction confirmation", enabledExperience: "Commerce", businessValue: "Secure payments" },
  { id: "merch-provider", layer: "integration", name: "Merchandise Provider", purpose: "Fulfill merchandise orders", dataUsed: "Order data", output: "Shipped products", enabledExperience: "Digital Locker", businessValue: "Fulfillment" },
  { id: "partner-systems", layer: "integration", name: "Partner Systems", purpose: "Sponsor data integration", dataUsed: "Offer catalogs", output: "Partner offers", enabledExperience: "Partner Experiences", businessValue: "Sponsorship activation" },
  { id: "venue-tech", layer: "integration", name: "Venue Technology", purpose: "Gate, wayfinding, POS systems", dataUsed: "Venue operational data", output: "Venue guidance", enabledExperience: "Game Day", businessValue: "Venue efficiency" },
  { id: "entra", layer: "security", name: "Microsoft Entra ID", purpose: "Identity and access management", dataUsed: "User identities", output: "Authentication", enabledExperience: "All", businessValue: "Secure access" },
  { id: "purview", layer: "security", name: "Microsoft Purview", purpose: "Data governance", dataUsed: "Data catalog", output: "Governance policies", enabledExperience: "All", businessValue: "Compliance" },
  { id: "consent-mgmt", layer: "security", name: "Consent Management", purpose: "Manage fan consent", dataUsed: "Preference records", output: "Consent enforcement", enabledExperience: "Privacy Controls", businessValue: "Trust" },
  { id: "rbac", layer: "security", name: "Role-Based Access", purpose: "Limit data access by role", dataUsed: "Role definitions", output: "Access policies", enabledExperience: "Executive View", businessValue: "Data protection" },
  { id: "data-protection", layer: "security", name: "Data Protection", purpose: "Encrypt and secure fan data", dataUsed: "All fan data", output: "Protected data", enabledExperience: "All", businessValue: "Risk reduction" },
  { id: "responsible-ai", layer: "security", name: "Responsible AI Controls", purpose: "Ensure ethical AI use", dataUsed: "Model behaviour", output: "Safe AI outputs", enabledExperience: "Ask Cito, SportsIQ", businessValue: "Brand trust" },
  { id: "monitoring", layer: "security", name: "Monitoring and Observability", purpose: "Track system health", dataUsed: "Telemetry", output: "Operational insight", enabledExperience: "All", businessValue: "Reliability" },
];

export const architectureNodeById = (id: string) => ARCHITECTURE_NODES.find((n) => n.id === id);
