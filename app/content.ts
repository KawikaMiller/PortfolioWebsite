// All site copy lives here. Edit this file; the page components just render it.
// Sources: resume + Portfolio Context Pack (claims there are the user's own, with explicit
// "don't claim" limits). Written to stay inside the former employer's NDA: no customer, partner
// or coworker names, no incident or security-event details, no verbatim internal messages, no
// non-public product or business specifics, no patient/PHI details, no location or personal details.

export const profile = {
  name: "Kawika Miller",
  title: "Full Stack Software Engineer",
  tagline:
    "I build secure, scalable systems, and I can lead the team that ships them.",
  intro:
    "Full stack engineer with about three and a half years of professional experience across C#/.NET, TypeScript, React and AWS. I also stepped into engineering management when my team needed it, so I'm equally at home writing the code or leading the people who do.",
  email: "hello@kawikamiller.com",
  resume: "/Kawika_Miller_Resume.pdf",
  github: "https://github.com/KawikaMiller",
  linkedin: "https://linkedin.com/in/kawikamiller",
};

export const stats = [
  { value: "3", label: "services stood up from an empty repo, with my team" },
  { value: "294", label: "pull requests authored in 11 months" },
  { value: "240+", label: "teammate pull requests reviewed" },
  { value: "1M+", label: "requests/month on endpoints I helped harden" },
];

export type Project = {
  title: string;
  period: string;
  summary: string;
  points: string[];
  tags: string[];
  href?: string;
};

export const projects: Project[] = [
  {
    title: "Bot and abuse mitigation for consumer endpoints",
    period: "2026",
    summary:
      "Hardened registration, login and OTP flows on high-traffic consumer endpoints (1M+ requests a month).",
    points: [
      "Rolled Cloudflare Turnstile across four surfaces (80K+ challenges/month) with hostname checks, action binding and render-on-click.",
      "Replaced a fixed-bucket SMS rate limiter with a fail-closed sliding-window log after showing bursts slipped through at window boundaries; it rejects 2,000+ requests/month.",
      "Diagnosed that DynamoDB TTL only guarantees eventual deletion, so a TTL-based counter reset is not a real reset, and keyed limits by user and phone number instead.",
      "Hardened JWT session handling, and implemented a feature-flag kill switch for one feature so it can be turned off without a deploy.",
      "Wrote up my own multi-day rollout, including the reverts and hotfixes, so the team could learn from it.",
    ],
    tags: ["Security", "Cloudflare Turnstile", "AWS Lambda", "DynamoDB", "JWT", "Cognito", "LaunchDarkly"],
  },
  {
    title: "From empty repo to production, three times",
    period: "2025 – 2026",
    summary:
      "With my team, stood up three new .NET microservices: a multi-tenant messaging service and two AI-powered services.",
    points: [
      "Each shipped with its own Terraform, CI, API Gateway wiring, message-broker contracts, migrations and first features.",
      "The messaging service is built on Twilio, with webhook signatures validated against the configured public URL rather than the request host.",
      "The AI services shipped human-in-the-loop features with audit logging.",
      "New capabilities rolled out behind fail-closed feature flags with a proven off-state.",
      "Wrote the guide for standing up a new backend microservice from a template repo.",
    ],
    tags: [".NET 8", "Terraform", "AWS", "Twilio", "RabbitMQ", "EF Core", "GenAI"],
  },
  {
    title: "Third-party e-prescribing integration",
    period: "2025",
    summary:
      "Delivered a partner e-prescription integration in about three months with a mixed-experience team, from design through production launch.",
    points: [
      "Implemented a token-based SSO flow: bearer-token session establishment and identity handoff between partner and platform.",
      "Moved credentials off hardcoded values into an encrypted store with a settings UI and a cron-callable endpoint.",
      "Kept medication, allergy and notification state in sync in both directions across three services and a Lambda proxy.",
      "Wrote the architecture page up front and a full knowledge-transfer guide when ownership moved teams.",
    ],
    tags: ["SSO", "JWT", "C#", "Angular", "AWS Lambda", "Terraform"],
  },
  {
    title: "Role-based access for embedded Power BI",
    period: "2026",
    summary:
      "Designed secure multi-tenant analytics: per-report permissions and row-level security around embedded Power BI reports.",
    points: [
      "Built the permission model (join tables, soft-toggle semantics, security-group filtering) on the report listing and embed-token endpoints.",
      "Shipped a dynamic, API-driven reports sidebar and the matching admin UI, backend and frontend together.",
      "Documented the embed licensing model, RLS and token flow for a non-specialist audience.",
    ],
    tags: ["Power BI", "RBAC", "Row-level security", "ASP.NET Core", "Angular"],
  },
  {
    title: "AI-assisted engineering and automation",
    period: "2025 – 2026",
    summary:
      "Ran my company's Claude Code pilot, and acted as de facto product manager for an AI automation initiative.",
    points: [
      "Wrote four sprint reports that became the team's evidence base for AI-assisted engineering, covering where it helped and where it fell short.",
      "Diagnosed an apparent gap in AI-usage metrics as a tooling configuration issue (a missing commit trailer) rather than low usage, and recommended the fix instead of drawing the wrong conclusion.",
      "When two AI-assisted work sessions reached contradictory conclusions on a feature, wrote a reconciliation document instead of picking a side.",
      "Owned an AI automation initiative end to end (2 epics, 40+ tickets), built on n8n.",
    ],
    tags: ["Claude Code", "GenAI", "n8n", "Technical writing"],
  },
  {
    title: "AbsoluteID: multi-tenant access management",
    period: "2024 – 2025",
    summary:
      "One of four developers on a five-person team building a nine-service access-management platform for organizations with complex user hierarchies.",
    points: [
      "Stack: .NET microservices, Kafka, self-hosted Kubernetes and Keycloak federated identity with per-client white-labeling.",
      "Configured Keycloak as a WebAuthn relying party using an NFC, FIDO2-certified fingerprint card, and mapped the authenticated identity into multi-tenant roles with the platform's own RBAC.",
      "Built platform-wide RBAC and location-based access control, with a Google Maps geofencing UI supporting radial and custom-polygon boundaries.",
      "Built BLE and NFC proximity authentication: signal-strength auto-lock, secure device-token pairing, passwordless desktop login.",
      "Wrote roughly a quarter to a half of the React Native / Expo frontend, which served desktop admins and field users from shared components.",
      "Built a natural-language assistant over platform data using tool calling (Azure AI and OpenAI) with audit logging, and authored the generic Entity Framework base package used by all nine services.",
    ],
    tags: [".NET", "Kafka", "Kubernetes", "Keycloak", "WebAuthn", "React Native", "Redux Toolkit", "Azure AI"],
  },
];

export const sideProjects: Project[] = [
  {
    title: "Orbweaver",
    period: "Open source · Uplift Foundation",
    href: "https://github.com/Uplift-Foundation/Orbweaver",
    summary:
      "An always-on-top orb for each running Claude Code session, showing at a glance whether it is idle, working, or waiting on you. Cross-platform on Windows and macOS from one Avalonia codebase.",
    points: [
      "Reads session state through hooks that write small per-session status files, with per-orb naming, drag-to-place positioning, sizing and color options.",
      "Also recognizes sessions from other coding agents and remote-control sessions.",
      "Started as my personal project, then moved to the Uplift Foundation, the nonprofit I'm part of, so members and outside contributors can build on it together.",
    ],
    tags: ["C#", "Avalonia", "Windows", "macOS", "Claude Code"],
  },
  {
    title: "Kinetic",
    period: "Open source",
    href: "https://github.com/KawikaMiller/Kinetic",
    summary:
      "Software engineering concepts as interactive, animated lessons: algorithms, networking, architecture and distributed systems that you play, pause, rewind and poke.",
    points: [
      "A roadmap of topics across four tiers, from intern to principal, with quick-check quizzes and saved progress.",
      "Unit tests with Vitest and a headless-browser smoke test across every lesson. Built entirely with Claude Code.",
    ],
    tags: ["TypeScript", "React 19", "Vitest", "Claude Code"],
  },
  {
    title: "HatchAI",
    period: "Open source",
    href: "https://github.com/KawikaMiller/HatchAI",
    summary:
      "A tiny desktop pet that hatches from an egg and evolves as you use Claude Code, Codex or Grok, reacting to your sessions with speech bubbles that can optionally be written live by a small AI call.",
    points: [
      "Spun out of Orbweaver into its own project to keep each one focused, rather than carrying two different avatars in one app.",
      "Installs its own hooks by merging into existing CLI settings without overwriting them, keeps backups, and is safe to re-run or uninstall.",
      "Covered by unit, integration and headless UI test suites. Built entirely with Claude Code.",
    ],
    tags: ["C#", ".NET 10", "Avalonia", "Claude Code"],
  },
  {
    title: "Waverider",
    href: "https://waverider.kawikamiller.com",
    period: "In design",
    summary:
      "A modern take on classic media-player equalizer visuals, reacting to system audio output via loopback capture and FFT analysis.",
    points: [],
    tags: ["C#", "WinUI 3", "NAudio", "SkiaSharp"],
  },
  {
    title: "Local AI lab",
    period: "Personal setup",
    summary:
      "Ollama and ComfyUI running directly on a home Windows 11 desktop with Open WebUI as the frontend, for local text, image and video generation.",
    points: [],
    tags: ["Ollama", "ComfyUI", "Open WebUI"],
  },
];

// Paraphrased from internal messages, attributed by role only. No verbatim quotes, names,
// customers or incident details, in line with the former employer's NDA.
export const kudos = [
  {
    text: "Credited for defensive security work that proved itself in production, and for the stability and speed fixes around it.",
    from: "VP of Engineering",
    context: "Security hardening, 2026",
  },
  {
    text: "Tied the security work to a month with zero bot-driven login failures, naming me as the engineer involved.",
    from: "Head of Customer Success",
    context: "Security hardening, 2026",
  },
  {
    text: "Called the first customer go-live on the messaging service my team built the smoothest the company had done, noting how much faster the team could now turn around feedback.",
    from: "Company executive",
    context: "Messaging service launch, 2026",
  },
  {
    text: "Told my team's sprint set the gold standard for sprint execution, after the team roughly doubled its velocity.",
    from: "VP of Engineering, as relayed in a sprint retro",
    context: "Early sprint, 2025",
  },
  {
    text: "Praised in a product demo for stability, security and speed improvements.",
    from: "Executive team, via the VP of Engineering",
    context: "Product demo, May 2026",
  },
];

export const trackRecord = [
  "Escalated to the executive team as a model of delivery under pressure, after leading a blocked, high-stakes release to an on-time, creative technical solution.",
  "Routinely escalated issues, questions and concerns to the executive team.",
  "Trained two newly hired engineering managers on the company's release process.",
  "Root-caused production issues outside my assignment, including cross-team defects, and backed each finding with evidence rather than opinion.",
  "When asked to explain failures, separated real defects from correct system behavior with data instead of accepting the framing.",
  "Wrote bug reports with acceptance criteria specifying what kind of test proves the fix, including when a mocked test cannot.",
  "Unblocked a whole team by tracing a messaging-broker connection failure to namespace and interface type mismatches.",
  "Output: 15 Confluence documents and 2 research spikes.",
];

export const teaching = [
  {
    title: "UPLIFT Foundation",
    role: "Instructor & Software Engineer",
    period: "Apr 2023 – Present",
    summary:
      "Teaching recently graduated high school and early college students HTML, CSS, JavaScript, Entity Framework, Agile, SOLID and OOP, including stepping in on short notice to cover an ASP.NET Core MVC class. Also on call as a software engineer, contributing to my own projects and to other members' projects.",
  },
  {
    title: "Code Fellows",
    role: "Teaching assistant",
    period: "2023 – 2024",
    summary:
      "Returned to the full-stack program I had completed as a teaching assistant, within a year of graduating.",
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["C#", "TypeScript", "JavaScript"] },
  { group: "Backend", items: [".NET / ASP.NET Core", "REST & OpenAPI", "Entity Framework (code-first)"] },
  { group: "Frontend", items: ["React", "React Native", "Expo", "Angular", "Redux Toolkit", "SCSS", "ARIA accessibility", "Jest"] },
  {
    group: "Cloud & infrastructure",
    items: ["AWS (ECS, ECR, Aurora, API Gateway, Lambda, Cognito)", "Terraform", "Docker", "Kubernetes", "GitHub Actions"],
  },
  { group: "Messaging", items: ["Kafka", "RabbitMQ / MassTransit", "Pub/sub events"] },
  { group: "Data & identity", items: ["PostgreSQL", "SQLite", "MongoDB", "OAuth / JWT", "RBAC", "Keycloak", "AWS Cognito"] },
  { group: "Security patterns", items: ["Fail-closed design", "Sliding-window rate limiting", "Bot mitigation", "HIPAA / PHI handling"] },
  { group: "Observability & delivery", items: ["Datadog", "Grafana", "ELK / OpenSearch", "LaunchDarkly", "TDD", "CI/CD", "Postman"] },
  { group: "AI", items: ["Azure AI & OpenAI tool calling", "Audit logging", "Human-in-the-loop design", "Claude Code (heavy daily use)"] },
];

export const familiar: string[] = [
  "Twilio (two-way SMS shipped)",
  "n8n workflows",
  "Redis",
  "Node.js / Express",
  "Python scripting",
  "GraphQL (consumer)",
  "Power BI (embedding and securing)",
  "DynamoDB",
];

export const experience = [
  {
    role: "Engineering Manager",
    company: "Adoreal, Inc.",
    period: "Sep 2025 – Sep 2026",
    points: [
      "Led the Consumer team (up to four developers, QA, design and product partners) on a healthcare EMR platform, owning sprint planning, 1:1s, mentoring and interviewing, while shipping production code across a multi-repo platform (regularly five to ten repositories), inside a globally distributed organization.",
      "Stood up three .NET microservices from empty repositories with the team, owning the Terraform for a new microservice at 99.99%+ reliability across 168K+ monthly events.",
      "Reviewed 240+ pull requests for teammates and championed test-driven development, growing automated coverage across controllers, services and event handlers.",
      "Triaged 190+ stories, sub-tasks and bugs at a 94% completion rate, and acted as de facto product manager for an AI automation team (2 epics, 40+ tickets).",
    ],
  },
  {
    role: "Software Engineer",
    company: "Delmock Technologies, Inc.",
    period: "Aug 2024 – Aug 2025",
    points: [
      "One of four developers building AbsoluteID, a nine-service multi-tenant access-management platform (see above).",
      "Authored the generic Entity Framework base package adopted across all nine services.",
    ],
  },
  {
    role: "Software Engineer",
    company: "Forget Me Not",
    period: "Apr 2023 – Aug 2024",
    points: [
      "Launched a cross-platform habit-tracking app for neurodivergent users to the iOS and Android stores with a four-person team, using .NET MAUI.",
      "Built microservices for habits, reminders and gamification, plus a GenAI prompt system for personalized recommendations.",
    ],
  },
];

export const education = [
  { name: "Code Fellows", detail: "Certificate, Advanced Software Development in Full-Stack JavaScript", date: "Jun 2023" },
  { name: "The Art Institute of Seattle", detail: "B.A., Game Art and Design", date: "Mar 2019" },
];
