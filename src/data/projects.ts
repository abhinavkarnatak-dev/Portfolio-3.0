import type { Project } from "./types";

/**
 * Ordered list - first item renders first in the grid.
 * To add a project, copy the shape of an existing entry and it will get a
 * card, a case-study page, an OG image and a sitemap entry automatically.
 * `hardProblems` may be left empty - the section only renders when filled.
 */
export const projects: Project[] = [
  {
    slug: "nimbus",
    name: "Nimbus: Cloud Development Agent",
    oneLiner:
      "A cloud development agent that understands repositories, researches technical questions, and delivers verified code changes.",
    description:
      "A full-stack cloud agent built with Next.js, TypeScript, PostgreSQL, Codex, isolated E2B workspaces, and GitHub integration.",
    status: "shipped",
    tags: ["Codex", "E2B", "GitHub", "Next.js", "PostgreSQL", "Agent Workflows"],
    links: [
      { label: "Live", href: "https://nimbus.abhinavkarnatak.com/" },
      {
        label: "GitHub",
        href: "https://github.com/abhinavkarnatak-dev/Nimbus-2.0",
      },
    ],
    caseStudy: {
      problem: [
        "Most coding agents stop at generating an answer or a patch. I wanted Nimbus to handle the complete loop: understand the repository, research when needed, make the change, verify it, and leave the user with an inspectable result.",
      ],
      built: [
        "Nimbus lets users start with a general conversation or a selected repository. It can read files, answer codebase questions, search the web, generate files and artifacts, create Mermaid diagrams, and continue the same conversation when the user later asks it to change the code.",
        "For repository work, Nimbus provisions an isolated E2B workspace and uses Codex to inspect files, edit code, run commands, execute checks, and stream the work back to the user. Completed work can be reviewed and delivered through trusted GitHub pull-request creation, updates, merges, and closures.",
      ],
      architecture: {
        description: [
          "The Next.js control plane owns authentication, tenant data, conversations, model and skill selection, attachments, audit history, and trusted GitHub actions. Codex handles repository reasoning and tool use, while the executor and Eve provide durable task orchestration around each turn.",
          "Each repository task runs in an isolated E2B workspace. The sandbox can work on the checked-out code, but GitHub credentials and publishing decisions stay in the trusted backend. PostgreSQL stores durable session state, and Cloudflare R2 stores user attachments.",
        ],
      },
      hardProblems: [
        {
          title: "Turning a general chat into repository work",
          body: [
            "A user may begin with a normal conversation, ask about a repository later, and only then request a code change. Nimbus keeps the earlier context, identifies the repository from the conversation, and provisions a workspace only when the request actually requires one.",
          ],
        },
        {
          title: "Pausing a session without losing its context",
          body: [
            "Workspaces pause after inactivity, but the conversation must remain useful. Nimbus checkpoints the workspace and conversation state, then restores the same session and Codex thread when the user sends a follow-up instead of starting from scratch.",
          ],
        },
        {
          title: "Keeping agent actions safe to publish",
          body: [
            "The agent can edit code and run commands, but the execution environment should never receive the credentials needed to publish changes. Nimbus keeps credentials in the trusted backend, validates the resulting workspace changes, and performs GitHub pull-request actions through controlled server-side operations.",
          ],
        },
      ],
      results: [
        "One conversation can move from repository questions to verified code changes without losing context.",
        "Users can inspect streamed work, file changes, checks, generated artifacts, audit events, and pull-request results before delivery.",
        "Sessions support follow-ups, selected skills, attachments, Mermaid diagrams, and pause-and-resume recovery.",
        "GitHub credentials remain outside the sandbox while repository changes are delivered through controlled pull-request actions.",
      ],
      stack: [
        {
          group: "Frontend & Control Plane",
          items: ["Next.js", "React", "TypeScript", "WebSockets"],
        },
        {
          group: "Agent & Orchestration",
          items: ["Codex App Server", "Agent Workflows", "Eve", "Mermaid"],
        },
        {
          group: "Backend & Data",
          items: ["Node.js", "PostgreSQL", "Drizzle ORM", "PostHog"],
        },
        {
          group: "Execution & Integrations",
          items: ["E2B", "GitHub App", "Cloudflare R2"],
        },
      ],
    },
  },
  {
    slug: "sargosh",
    name: "Sargosh",
    oneLiner:
      "A Windows dictation app that turns speech into clear text and inserts it into supported apps.",
    description:
      "An Electron desktop app with English, Hindi, and Hinglish transcription, AI cleanup, custom shortcuts, and local recording history. Available on Microsoft Store.",
    status: "shipped",
    tags: ["Electron", "React", "TypeScript", "Speech Recognition", "LLM Integration", "Fastify"],
    links: [
      {
        label: "Live",
        href: "https://sargosh.abhinavkarnatak.com/",
      },
      {
        label: "GitHub",
        href: "https://github.com/abhinavkarnatak-dev/Sargosh-Desktop",
      },
    ],
    caseStudy: {
      problem: [
        "Speaking is often easier than typing, but spoken words include pauses, fillers, and corrections. A useful dictation app needs to turn that speech into readable text and put it where the user is working, without making them switch apps and paste it manually.",
        "I wanted to build that experience for Windows, including people who switch between Hindi and English while speaking.",
      ],
      built: [
        "Sargosh runs in the background with a small floating overlay. Users hold a custom shortcut to dictate, or double-tap it for hands-free recording. When they finish, the app transcribes the recording, cleans up the text, and inserts it into the selected text field.",
        "The app supports English, Hindi, and Roman-script Hinglish. Cleanup removes fillers, handles spoken corrections, and formats clear lists. Users can replay recordings, copy transcripts, retry transcription, export audio, and view their speaking statistics and remaining allowance.",
      ],
      architecture: {
        description: [
          "Electron runs the desktop app and overlay, while React and TypeScript handle the interface and recording flow. A bundled Python helper uses Windows APIs to detect shortcuts, track the selected input, and insert the finished text.",
          "The desktop app sends recordings to a Node.js and Fastify backend on Render. The backend verifies the account, checks usage limits, sends audio to Deepgram, and passes the transcript to an LLM for cleanup. Provider keys stay on the server.",
          "Supabase handles Google and email OTP login, with PostgreSQL storing account-linked usage records. SQLite and local audio files keep recording history on the user's computer, separated by account.",
        ],
      },
      hardProblems: [
        {
          title: "Putting text into the right input",
          body: [
            "A user can change text fields while speaking, and clicking the overlay should not replace the intended destination. Sargosh tracks the latest selected input during recording and freezes that destination when recording finishes. If insertion is unavailable, the overlay offers the finished text for copying.",
          ],
        },
        {
          title: "Keeping repeated dictations reliable",
          body: [
            "Text insertion worked on the first attempt but could lose characters during repeated recordings. The Windows helper needed careful handling of shortcut release, keyboard state, focus, and character timing. I tested separate hold and hands-free recordings in different orders to check that users could continue writing in the same input.",
          ],
        },
        {
          title: "Enforcing limits outside the desktop app",
          body: [
            "Cloud transcription and cleanup have a cost, so the backend checks and records usage instead of trusting a counter on the user's computer. The allowance is shared across devices signed into the same account. Setup practice is tracked separately so it does not reduce the regular allowance or add to dictation statistics.",
          ],
        },
        {
          title: "Getting the app onto another Windows PC",
          body: [
            "The first installer worked on my computer but was blocked by a Windows code-integrity policy on another PC. I traced the failure through installation and Windows event logs, then packaged the app as MSIX and published it through Microsoft Store.",
          ],
        },
      ],
      results: [
        "Published a Windows desktop app on Microsoft Store, with a separate website explaining the app and guiding users through installation.",
        "Users can dictate into supported apps through a shortcut without manually copying and pasting the result.",
        "English, Hindi, and Hinglish share one recording and cleanup flow, including spoken corrections and list formatting.",
        "Recording history stays local and separate by account, while the backend enforces shared usage limits across devices.",
      ],
      stack: [
        {
          group: "Desktop & Interface",
          items: ["Electron", "React", "TypeScript", "MediaRecorder"],
        },
        {
          group: "Speech & AI",
          items: ["Deepgram", "LLM API Integration"],
        },
        {
          group: "Backend & Data",
          items: ["Node.js", "Fastify", "Supabase Auth", "PostgreSQL", "SQLite"],
        },
        {
          group: "Windows Integration",
          items: ["Python", "Windows UI Automation", "MSIX"],
        },
        {
          group: "Hosting & Distribution",
          items: ["Render", "Vercel", "Microsoft Store"],
        },
      ],
    },
  },
  {
    slug: "wakeops",
    name: "WakeOps",
    oneLiner:
      "Incident response platform that turns Grafana alerts into durable call, email and Slack escalation workflows.",
    description:
      "A full-stack incident response platform built with Next.js, Express, PostgreSQL and Temporal, with Grafana webhooks, Twilio calls and queued notifications.",
    status: "shipped",
    tags: ["Next.js", "Temporal", "PostgreSQL", "Twilio", "RabbitMQ"],
    links: [
      { label: "Live", href: "https://wakeops.abhinavkarnatak.com/" },
      {
        label: "GitHub",
        href: "https://github.com/abhinavkarnatak-dev/WakeOps",
      },
    ],
    caseStudy: {
      problem: [
        "An alert is not an incident response. Grafana can say that a service is failing, but it does not know which engineer owns that service, whether they answered the call, when to try again, or when to escalate. Handling those steps by hand works until the alert arrives at the wrong hour and every missed minute matters.",
        "I wanted WakeOps to own that gap: accept one alert, map it to the right people and infrastructure, keep the response running outside the original HTTP request, and leave behind one clear incident record instead of a trail spread across provider dashboards.",
      ],
      built: [
        "WakeOps gives each organization a secured Grafana webhook and a setup flow for hosts, services, environments, and on-call and senior engineers. A firing alert is verified, normalized, mapped to the saved deployment, fingerprinted to stop duplicate active incidents, and persisted before the API returns. The dashboard then shows the incident, its status, call attempts, and audit timeline as they change.",
        "Each new incident starts a Temporal workflow. The worker calls the on-call engineer through Twilio, waits for the result, retries unanswered calls, and escalates to the senior engineer when both on-call attempts fail. Email and Slack jobs go through RabbitMQ, so a slow notification provider cannot hold up the call path, and Twilio callbacks update PostgreSQL and signal the running workflow when somebody acknowledges.",
      ],
      architecture: {
        description: [
          "The Next.js app handles Google sign-in, organization setup, integrations, and incident views. The Express API handles short-lived work: Grafana webhooks, Twilio voice and status callbacks, health checks, and signals sent to Temporal. PostgreSQL is the application source of truth for mappings, incidents, attempts, and audit events; Temporal owns timers, retries, and long-running workflow state.",
          "The worker is deliberately separate from the API. It polls Temporal, runs call activities, publishes RabbitMQ jobs, and consumes the email and Slack queues without needing a public URL. The web app runs on Vercel, the API on Render, and managed Supabase, Temporal Cloud, and CloudAMQP provide the shared state and messaging that let the pieces communicate.",
        ],
      },
      hardProblems: [
        {
          title: "A healthy deployment that could not open one more database connection",
          body: [
            "Google sign-in started looping back to the login page while the API health check stayed green. The Vercel logs finally showed the real failure: Supabase's session pool had reached its fifteen-client limit. Every serverless instance could create a Prisma client, and reusing one client inside a warm process could not stop multiple processes from holding sessions.",
            "The web deployment moved to Supabase's transaction pooler with a one-connection Prisma limit, while the Prisma client is cached globally inside each warm runtime. That matches the connection model to serverless execution: short requests borrow a pooled connection instead of every function instance trying to own a database session.",
          ],
        },
        {
          title: "New worker source running an old workflow",
          body: [
            "A Temporal activity failed because attemptNumber was missing, even though the TypeScript source clearly passed it. The worker imported the workflows package through its compiled dist output, and that output was older than the source. Restarting the worker kept loading the stale bundle, so the failure looked like a data problem instead of a build problem.",
            "The worker's development command now builds the workflows package before it starts. I also treated already-running workflows separately: Temporal preserves their event history, so changing source code cannot rewrite arguments already recorded for an old execution. Stale executions are terminated and new incidents start against the fresh bundle.",
          ],
        },
        {
          title: "One free process trying to be both API and worker",
          body: [
            "Running the Express API and Temporal worker in one Render service looked convenient, but the service became inconsistent under a small memory and CPU budget. The worker bundles workflow code, holds long-lived Temporal and RabbitMQ connections, and runs consumers, while the API needs predictable resources for webhooks, callbacks, and health checks. A failure in either process also brought down the other.",
            "I separated the API from the worker again. Render now serves only HTTP traffic, while the worker runs independently and connects outbound to Temporal Cloud, Supabase, CloudAMQP, and Twilio. There is no worker URL because nothing calls into it; it polls for work and can reconnect without changing any webhook configuration.",
          ],
        },
        {
          title: "A live counter that froze at 09",
          body: [
            "The overview counters animated correctly on page load but failed during polling. When call attempts moved from 9 to 10, the UI displayed 09 and stayed there; other increases and decreases appeared unchanged until a manual reload. The polling data was fresh. The animation effect updated the same state listed in its dependency array, so its cleanup ran immediately and cancelled the frame that would have completed the transition.",
            "I replaced the per-digit reset with a stable previous-value-to-next-value transition driven only by the server value. The old and new numbers are separate layers, increases and decreases move in opposite directions, and an internal state update can no longer cancel its own animation. That also removed the temporary leading zero at digit boundaries.",
          ],
        },
      ],
      results: [
        "A mapped Grafana alert becomes one deduplicated incident with an assigned on-call engineer, durable retries, senior escalation, and a complete call and audit history.",
        "The webhook returns after validation and persistence; calls, timers, retries, and notifications continue independently through Temporal and RabbitMQ.",
        "Email, Slack, and voice are separate delivery paths, so one provider failing or slowing down does not block the others.",
        "The web app and API run behind permanent custom domains, while the worker connects outbound and can move to any always-on host without changing public callbacks.",
      ],
      stack: [
        {
          group: "Frontend",
          items: ["Next.js", "TypeScript", "Tailwind CSS", "Auth.js"],
        },
        {
          group: "Backend & Data",
          items: ["Node.js", "Express", "PostgreSQL", "Prisma"],
        },
        { group: "Workflow & Messaging", items: ["Temporal", "RabbitMQ"] },
        {
          group: "Integrations",
          items: ["Grafana", "Twilio", "Slack", "Resend"],
        },
        {
          group: "Infrastructure",
          items: ["Vercel", "Render", "Supabase", "CloudAMQP"],
        },
      ],
    },
  },
  {
    slug: "yapit",
    name: "YapIt",
    oneLiner:
      "Microservices chat platform that survives real production failures - brokers, caches, sockets and all.",
    description:
      "A full-stack microservices chat app: Next.js, Express, MongoDB, Socket.io, RabbitMQ and Redis, containerized and deployed on AWS EC2 with CI/CD.",
    status: "shipped",
    tags: ["Next.js", "Socket.io", "RabbitMQ", "Redis", "Docker", "AWS"],
    links: [
      { label: "Live", href: "https://yapit.abhinavkarnatak.com/" },
      { label: "GitHub", href: "https://github.com/abhinavkarnatak-dev/YapIt" },
    ],
    caseStudy: {
      problem: [
        "Real-time chat is trivial to demo and genuinely hard to run. A single Express server with Socket.io works until the first deploy drops every connection, the first traffic spike floods the database, or the first background job (say, sending an OTP email) blocks a request thread.",
        "I wanted a chat application built the way a small production team would build it: independent services, an async message broker, a cache layer, a reverse proxy, and a pipeline that ships to a real server on every push - so that every failure mode I read about, I would eventually hit myself.",
      ],
      built: [
        "YapIt is split into focused Express services - user, chat, and mail - behind an Nginx reverse proxy, with a Next.js frontend. Real-time messaging runs over Socket.io; cross-service work (like OTP emails on signup and global account-data cleanup) goes through RabbitMQ instead of blocking HTTP calls; Redis caches hot reads such as user profiles and chat lists. File sharing is backed by AWS S3.",
        "Everything is containerized with Docker Compose and deployed to an AWS EC2 instance. A GitHub Actions pipeline builds and redeploys the services on every push to main.",
      ],
      architecture: {
        description: [
          "The frontend talks to Nginx, which routes by path to the user, chat and mail services. The chat service holds Socket.io connections and persists messages to MongoDB. Signup flows publish OTP jobs to RabbitMQ; the mail service consumes the queue and sends email, so a slow SMTP call never delays an API response. Redis sits beside the chat and user services as a read-through cache with explicit invalidation on writes, and uploads go straight to S3.",
        ],
        // diagram: { src: "/diagrams/yapit-architecture.png", alt: "YapIt architecture diagram", width: 1400, height: 900 },
      },
      hardProblems: [
        {
          title: "Redis connections dying silently in production",
          body: [
            "After hours of uptime, services started throwing SocketClosedUnexpectedlyError and crashing on the next cache read. Locally it never reproduced - the connection only gets reaped after long idle periods, which dev sessions never reach.",
            "The fix had two parts: attach a real error handler to the Redis client (an unhandled 'error' event kills the Node process), and configure a reconnect strategy with backoff plus periodic pings so idle connections either stay alive or heal themselves. The deeper lesson: a cache client is a long-lived network dependency, not a constructor you call once and forget.",
          ],
        },
        {
          title: "RabbitMQ race conditions on cold starts",
          body: [
            "On fresh deploys, services raced the broker: consumers tried to connect and assert queues before RabbitMQ finished booting, so containers crash-looped or - worse - came up 'healthy' without ever attaching a consumer, and OTP emails silently queued forever.",
            "depends_on ordering isn't readiness. I added connection retry loops with backoff in every service, made queue assertion idempotent on both producer and consumer sides, and treated 'broker unavailable' as a normal startup state instead of a fatal error.",
          ],
        },
        {
          title: "CI/CD deploys failing on git pull conflicts",
          body: [
            "The deploy job SSH'd into EC2 and ran git pull - which worked until a hotfix edited a file directly on the server. From then on every deploy failed with merge conflicts, meaning the pipeline silently stopped shipping.",
            "I stopped treating the server as a checkout anyone may touch: the pipeline now does git fetch + git reset --hard origin/main, and the box is treated as a disposable deploy target. If it needs a fix, the fix goes through the repo.",
          ],
        },
        {
          title: "EC2 disk slowly filling until deploys died",
          body: [
            "Weeks in, deploys started failing with 'no space left on device'. Every image rebuild left the previous build's layers behind as dangling images, and on a small EC2 volume that adds up fast.",
            "Short-term fix: docker system prune in the deploy script. Long-term fix: multi-stage builds so runtime images stopped carrying build toolchains, which cut image size and made the pruning matter less in the first place.",
          ],
        },
        {
          title: "Nginx 502s that were really port-mapping bugs",
          body: [
            "Intermittent 502 Bad Gateway errors from Nginx pointed at 'the backend being down' - but the services were running. The actual cause: upstream definitions pointing at ports that a compose refactor had stopped publishing, so Nginx was proxying into a void.",
            "I made every service's internal port explicit in compose, matched upstreams to the compose service names on the shared network instead of host ports, and added a smoke check to the deploy so a bad mapping fails the pipeline instead of paging me with 502s.",
          ],
        },
      ],
      results: [
        "Deploys are hands-off: push to main, and the pipeline rebuilds and restarts the affected services on EC2.",
        "OTP and email delivery is fully decoupled from request latency via RabbitMQ - an SMTP outage delays mail, not signups.",
        "Services restart cleanly in any order: broker and cache reconnection is handled everywhere, so a single container restart no longer cascades.",
        "The failure modes above are fixed at the pipeline level (reset-based deploys, pruning, smoke checks), not patched by hand on the box.",
      ],
      stack: [
        { group: "Frontend", items: ["Next.js", "TypeScript", "Tailwind CSS"] },
        { group: "Services", items: ["Node.js", "Express", "Socket.io"] },
        { group: "Data & messaging", items: ["MongoDB", "Redis", "RabbitMQ"] },
        {
          group: "Infra",
          items: ["Docker", "Nginx", "AWS (EC2, S3)", "GitHub Actions"],
        },
      ],
    },
  },
  {
    slug: "revuea",
    name: "Revuea",
    oneLiner:
      "Anonymous feedback platform with OTP-gated signups, AI summaries and a live analytics dashboard.",
    description:
      "A full-stack anonymous feedback platform: React, Node.js and PostgreSQL via Prisma, with OTP auth, Gemini-powered summaries, Recharts analytics and CSV export.",
    status: "shipped",
    tags: ["React", "Node.js", "PostgreSQL", "Prisma", "Gemini API"],
    links: [
      { label: "Live", href: "https://revuea.abhinavkarnatak.com/" },
      {
        label: "GitHub",
        href: "https://github.com/abhinavkarnatak-dev/Revuea",
      },
    ],
    caseStudy: {
      problem: [
        "Honest feedback needs anonymity - people soften what they say when their name is attached. But fully anonymous input creates two new problems: spam accounts, and a wall of unstructured text nobody actually reads.",
        "Revuea tackles both: verified-but-anonymous submissions, and AI that turns feedback volume into something a human can act on.",
      ],
      built: [
        "A full-stack web app where users collect anonymous feedback behind a secure OTP-based signup flow - accounts are verified, submissions stay anonymous. Feedback lands in a dashboard built with Recharts for visualizing trends at a glance.",
        "The Gemini API condenses large volumes of raw feedback into readable text summaries on demand, and a CSV export covers anyone who wants to run their own analysis outside the app.",
      ],
      architecture: {
        description: [
          "React frontend talking to a Node.js/Express API, with PostgreSQL behind Prisma ORM for typed, migration-managed data access. OTP verification gates account creation; the summarization endpoint batches stored feedback and streams it through the Gemini API before returning a digest to the dashboard.",
        ],
      },
      hardProblems: [],
      results: [
        "Feedback is anonymous to readers but spam-resistant - OTP verification keeps accounts real without deanonymizing submissions.",
        "Gemini summaries turn large feedback volumes into readable digests instead of an unread backlog.",
        "Recharts dashboard and CSV export cover both quick scanning and deeper external analysis.",
      ],
      stack: [
        { group: "Frontend", items: ["React", "Tailwind CSS", "Recharts"] },
        { group: "Backend", items: ["Node.js", "Express", "Prisma"] },
        { group: "Data & AI", items: ["PostgreSQL", "Gemini API"] },
      ],
    },
  },
  {
    slug: "pixscribe",
    name: "PixScribe",
    oneLiner:
      "SaaS text-to-image generator with a metered credit system and Razorpay payments wired end to end.",
    description:
      "A full-stack SaaS text-to-image web app: React, Node.js, Express and MongoDB, with a credit system, Razorpay payment integration and a Framer Motion UI.",
    status: "shipped",
    tags: ["React", "Node.js", "MongoDB", "Razorpay", "Tailwind CSS"],
    links: [
      { label: "Live", href: "https://pixscribe.abhinavkarnatak.com/" },
      {
        label: "GitHub",
        href: "https://github.com/abhinavkarnatak-dev/PixScribe",
      },
    ],
    caseStudy: {
      problem: [
        "AI image generation has a real per-request cost, so a usable product needs more than a prompt box - it needs metering, payments, and account state that stays correct even when a payment flow is interrupted halfway.",
        "PixScribe is the full SaaS loop: generate, run out of credits, pay, keep generating.",
      ],
      built: [
        "A full-stack web app where users generate AI images from text prompts, with every generation debited against a per-account credit balance stored in MongoDB.",
        "A Razorpay integration handles payment processing for credit top-ups, verifying successful transactions server-side before balances update - so credits only appear when money actually moved. The UI is built with Tailwind CSS and Framer Motion for smooth layout and state transitions.",
      ],
      architecture: {
        description: [
          "React frontend against a Node.js/Express API with MongoDB for users, balances and generation history. The payment flow goes client â†’ Razorpay checkout â†’ server-side verification of the transaction signature â†’ atomic credit update, keeping the balance authoritative on the server rather than trusting the client.",
        ],
      },
      hardProblems: [],
      results: [
        "Credits meter real generation cost per account, with balances updated automatically on verified payments.",
        "Payment verification is server-side - client-reported success alone never credits an account.",
        "Fast, responsive UI with animated state transitions across the generate â†’ pay â†’ generate loop.",
      ],
      stack: [
        {
          group: "Frontend",
          items: ["React", "Tailwind CSS", "Framer Motion"],
        },
        { group: "Backend", items: ["Node.js", "Express", "MongoDB"] },
        { group: "Payments", items: ["Razorpay"] },
      ],
    },
  },
  {
    slug: "dermaglow-ai",
    name: "DermaGlow AI",
    oneLiner:
      "AI skincare advisor that turns a short skin questionnaire into a personalized routine and product picks.",
    description:
      "An AI-powered skincare platform built with Next.js and TypeScript: describe your skin type, concerns and goals, and get a tailored routine with product recommendations.",
    status: "shipped",
    tags: ["Next.js", "TypeScript", "AI API", "Tailwind CSS"],
    links: [
      { label: "Live", href: "https://dermaglow.abhinavkarnatak.com/" },
      {
        label: "GitHub",
        href: "https://github.com/abhinavkarnatak-dev/DermaGlow-AI",
      },
    ],
    caseStudy: {
      problem: [
        "Skincare advice online is either generic listicles or product marketing - neither accounts for the one thing that matters: your actual skin. Real personalization needs to reason over skin type, concerns and goals together, which is exactly the kind of unstructured-input problem AI models are good at.",
      ],
      built: [
        "DermaGlow AI runs a three-step flow: users fill out a short form describing their skin type, concerns and objectives; an AI model processes that into an individual skin profile; and the app returns a tailored skincare routine alongside concrete product suggestions.",
        "The whole app is built with Next.js and TypeScript, with a clean Tailwind CSS interface that keeps the form-to-routine journey friction-free.",
      ],
      architecture: {
        description: [
          "A Next.js App Router application: the questionnaire submits to a server-side route that prompts an AI API with the structured profile and shapes the response into routine steps and product recommendations the UI can render consistently.",
        ],
      },
      hardProblems: [],
      results: [
        "A short form is all it takes - the AI handles the reasoning from profile to routine.",
        "Recommendations come back structured (routine steps + products), not as a wall of generated text.",
        "End-to-end TypeScript keeps the AI response shape honest between server and UI.",
      ],
      stack: [
        { group: "App", items: ["Next.js", "TypeScript", "Tailwind CSS"] },
        { group: "AI", items: ["AI API integration"] },
      ],
    },
  },
  {
    slug: "adaptsense",
    name: "AdaptSense",
    oneLiner:
      "Cross-platform accessibility app translating between 13 media and language combinations with AI.",
    description:
      "A React Native (Expo) accessibility app for visually and hearing-impaired users: a media pipeline routing audio, image, text and braille inputs to visual or auditory outputs via Gemini.",
    status: "shipped",
    tags: ["React Native", "Expo", "Gemini API", "Accessibility"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/abhinavkarnatak-dev/AdaptSense",
      },
    ],
    caseStudy: {
      problem: [
        "Accessibility tools tend to solve one translation in one direction - speech-to-text, or text-to-speech, and that's it. Visually and hearing-impaired users live across many combinations of input and output, and switching apps for each one is friction they shouldn't have to carry.",
        "AdaptSense treats modality translation as one pipeline instead of a dozen features.",
      ],
      built: [
        "A cross-platform mobile app built with React Native and Expo, designed around daily accessibility for visually and hearing-impaired users.",
        "At its core is a flexible media processing pipeline: it accepts audio, image, text or braille input and dynamically routes it to the right visual or auditory output - including sign-language GIFs. Gemini APIs in the backend handle the translation work across 13 distinct language and media combinations.",
      ],
      architecture: {
        description: [
          "The Expo app captures or receives media and hands it to a backend pipeline that classifies the input type, selects the target output modality, and dispatches to the appropriate Gemini-powered translation path. Output rendering is modality-aware on the client - audio playback, visual display, or GIF-based sign language.",
        ],
      },
      hardProblems: [],
      results: [
        "One pipeline handles 13 unique language and media combinations with high accuracy.",
        "Runs cross-platform from a single React Native codebase via Expo.",
        "Input-agnostic by design: audio, image, text and braille all enter the same routing pipeline.",
      ],
      stack: [
        { group: "App", items: ["React Native", "Expo", "TypeScript"] },
        { group: "AI", items: ["Gemini API"] },
      ],
    },
  },
  {
    slug: "aviageek",
    name: "AviaGeek",
    oneLiner: "An aircraft model guide for aviation geeks - explore aircraft, model by model.",
    description:
      "A Next.js web app for exploring aircraft models: an aviation reference guide with a clean, browsable interface for plane spotters and enthusiasts.",
    status: "shipped",
    tags: ["Next.js", "React", "Tailwind CSS"],
    links: [
      { label: "Live", href: "https://aviageek.abhinavkarnatak.com/" },
      {
        label: "GitHub",
        href: "https://github.com/abhinavkarnatak-dev/AviaGeek",
      },
    ],
    caseStudy: {
      problem: [
        "Aircraft information lives scattered across wikis, forums and manufacturer PDFs. For an aviation enthusiast who just wants to identify and compare aircraft models, there's no clean, single place to browse them.",
      ],
      built: [
        "AviaGeek is exactly that place: an aircraft model guide where users can explore aircraft with their details in one consistent, browsable interface - built as a fast Next.js app with a Tailwind CSS design.",
      ],
      architecture: {
        description: [
          "A Next.js App Router application with a structured aircraft data model behind it, so every aircraft renders through the same detail layout and new models are added as data, not new pages.",
        ],
      },
      hardProblems: [],
      results: [
        "One consistent reference layout across every aircraft model.",
        "Adding an aircraft is a data change, not a UI change.",
      ],
      stack: [{ group: "App", items: ["Next.js", "React", "Tailwind CSS"] }],
    },
  },
  {
    slug: "sudowiz",
    name: "SudoWiz",
    oneLiner:
      "Interactive Sudoku solver - type in any puzzle and a backtracking algorithm cracks it.",
    description:
      "A web-based Sudoku solver built with React, Vite and Tailwind CSS: an interactive grid with input validation and a backtracking algorithm that solves any valid puzzle.",
    status: "shipped",
    tags: ["React", "Vite", "Algorithms", "Tailwind CSS"],
    links: [
      { label: "Live", href: "https://sudowiz.abhinavkarnatak.com/" },
      {
        label: "GitHub",
        href: "https://github.com/abhinavkarnatak-dev/SudoWiz",
      },
    ],
    caseStudy: {
      problem: [
        "Backtracking is one of those algorithms everyone learns and few ever see working. A Sudoku solver makes it tangible: enter a real puzzle you're stuck on and watch constraint-based search finish it.",
      ],
      built: [
        "SudoWiz is an interactive 9x9 grid: type in any puzzle (with validation so illegal boards are caught as you enter them), hit solve, and the backtracking solver fills the board, highlighting the cells it computed. A reset clears the grid for the next puzzle, and the layout works on desktop and mobile.",
      ],
      architecture: {
        description: [
          "A React single-page app built with Vite. The solver is a recursive backtracking algorithm enforcing row, column and box constraints, kept separate from the UI so the grid just renders board state.",
        ],
      },
      hardProblems: [],
      results: [
        "Solves any valid puzzle instantly, with solved cells highlighted against the user's input.",
        "Input validation rejects illegal boards before the solver ever runs.",
        "Fully responsive - usable as a quick solver on a phone.",
      ],
      stack: [{ group: "App", items: ["React", "Vite", "Tailwind CSS"] }],
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
