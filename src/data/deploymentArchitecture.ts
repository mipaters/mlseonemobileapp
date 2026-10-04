export interface DeploymentArchitectureItem {
  id: string;
  name: string;
  description: string;
  highlight?: boolean;
}

export interface DeploymentArchitectureLayer {
  id: string;
  title: string;
  items: DeploymentArchitectureItem[];
}

// NOTE: Illustrative demo data — describes this app's actual deployed stack
// versus an illustrative production-scale target architecture.

export const DEMO_ARCHITECTURE: DeploymentArchitectureLayer[] = [
  {
    id: "demo-frontend",
    title: "Frontend & Hosting",
    items: [
      { id: "d-react", name: "React + Vite SPA", description: "This mobile-first app, built as a single-page React/TypeScript application." },
      { id: "d-swa", name: "Azure Static Web Apps", description: "Hosts the compiled app on Microsoft's global CDN." },
      { id: "d-cicd", name: "GitHub Actions CI/CD", description: "Every push to the demo branch auto-builds and deploys to the live site." },
    ],
  },
  {
    id: "demo-backend",
    title: "Backend API",
    items: [
      { id: "d-func", name: "Azure Functions (Node.js)", description: "Lightweight serverless API bundled with the Static Web App." },
      { id: "d-chat-api", name: "/api/cito-chat", description: "Proxies Ask Cito conversations to Azure OpenAI." },
      { id: "d-speech-api", name: "/api/speech-token", description: "Issues short-lived Speech tokens so the raw key never reaches the browser." },
    ],
  },
  {
    id: "demo-ai",
    title: "AI Services",
    items: [
      { id: "d-openai", name: "Azure OpenAI (GPT)", description: "Generates Ask Cito's conversational replies in real time." },
      { id: "d-speech", name: "Azure AI Speech", description: "Real speech-to-text and text-to-speech powers the hands-free voice conversation." },
    ],
  },
  {
    id: "demo-content",
    title: "Content & Data",
    items: [
      { id: "d-static-data", name: "Static demo data", description: "Standings, scoring leaders, news, merch, and rewards are illustrative TypeScript data, not live feeds." },
      { id: "d-clips", name: "Pre-recorded highlight clips", description: "Matthews, Blue Jays, and Scottie Barnes videos are pre-made MP4 files bundled with the app." },
      { id: "d-no-systems", name: "No connected systems", description: "No live game feeds, ticketing, loyalty, or commerce back ends are connected in this demo." },
    ],
  },
  {
    id: "demo-identity",
    title: "Identity & Security",
    items: [
      { id: "d-profile", name: "Single illustrative profile", description: "There is no real fan login — the demo always runs as one sample fan, Mike." },
      { id: "d-token", name: "Token-based key protection", description: "Speech and OpenAI keys stay server-side; the browser only ever receives short-lived tokens." },
    ],
  },
];

export const PRODUCTION_ARCHITECTURE: DeploymentArchitectureLayer[] = [
  {
    id: "prod-frontend",
    title: "Frontend & Hosting",
    items: [
      { id: "p-swa", name: "Azure Static Web Apps at scale", description: "Same hosting model, scaled globally with a custom domain and staged environments." },
      { id: "p-cicd", name: "GitHub Actions, multi-stage CI/CD", description: "Dev, test, and production environments with automated quality gates." },
    ],
  },
  {
    id: "prod-ai",
    title: "AI & Content Intelligence",
    items: [
      { id: "p-foundry", name: "Azure AI Foundry orchestration", description: "Hosts and governs Ask Cito's models with Responsible AI guardrails." },
      { id: "p-openai", name: "Azure OpenAI", description: "Powers Ask Cito's natural-language understanding and generation at scale." },
      { id: "p-speech", name: "Azure AI Speech at scale", description: "Hands-free voice conversation available across all fan touchpoints." },
      {
        id: "p-wsc",
        name: "WSC Sports",
        description: "AI-powered automated highlight generation — real-time clipping and personalized reels created directly from live Leafs, Jays, and Raptors game feeds, replacing the demo's pre-recorded video files.",
        highlight: true,
      },
    ],
  },
  {
    id: "prod-data",
    title: "Data Platform",
    items: [
      { id: "p-fabric", name: "Microsoft Fabric + OneLake", description: "Unified data estate consolidating every fan and operational data source." },
      { id: "p-profile", name: "Unified Fan Profile (Fan DNA)", description: "A single fan view built from ticketing, loyalty, merch, and content engagement signals." },
      { id: "p-streams", name: "Real-time event streams", description: "Live fan interactions feed personalization decisions as they happen." },
    ],
  },
  {
    id: "prod-integration",
    title: "Operational Integrations",
    items: [
      { id: "p-ticketing", name: "Ticketing platform", description: "Live ticket inventory, pricing, and seat-upgrade availability." },
      { id: "p-loyalty", name: "Loyalty & rewards engine", description: "Real points, tiers, and mission tracking." },
      { id: "p-merch", name: "Merchandise & payment providers", description: "Live catalog, checkout, and fulfillment." },
      { id: "p-league", name: "League & venue systems", description: "NHL, MLB, and NBA data feeds plus venue operations." },
    ],
  },
  {
    id: "prod-security",
    title: "Security & Governance",
    items: [
      { id: "p-entra", name: "Microsoft Entra ID", description: "Real fan identity, authentication, and single sign-on." },
      { id: "p-purview", name: "Microsoft Purview", description: "Data governance and classification across the fan data estate." },
      { id: "p-rai", name: "Responsible AI guardrails", description: "Policy enforcement and monitoring on every generative AI surface, including WSC Sports outputs." },
      { id: "p-monitoring", name: "Monitoring & observability", description: "End-to-end telemetry for reliability and performance." },
    ],
  },
];
