import type { Project } from "./types";

/**
 * Ordered list - first item renders first in the grid.
 * To add a project, copy the shape of an existing entry and it will get a
 * card, a case-study page, an OG image and a sitemap entry automatically.
 * `hardProblems` may be left empty - the section only renders when filled.
 */
export const projects: Project[] = [
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
        { group: "Infra", items: ["Docker", "Nginx", "AWS (EC2, S3)", "GitHub Actions"] },
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
      { label: "GitHub", href: "https://github.com/abhinavkarnatak-dev/Revuea" },
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
      { label: "Live", href: "https://pixscribeai.abhinavkarnatak.com/" },
      { label: "GitHub", href: "https://github.com/abhinavkarnatak-dev/PixScribe" },
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
          "React frontend against a Node.js/Express API with MongoDB for users, balances and generation history. The payment flow goes client → Razorpay checkout → server-side verification of the transaction signature → atomic credit update, keeping the balance authoritative on the server rather than trusting the client.",
        ],
      },
      hardProblems: [],
      results: [
        "Credits meter real generation cost per account, with balances updated automatically on verified payments.",
        "Payment verification is server-side - client-reported success alone never credits an account.",
        "Fast, responsive UI with animated state transitions across the generate → pay → generate loop.",
      ],
      stack: [
        { group: "Frontend", items: ["React", "Tailwind CSS", "Framer Motion"] },
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
      { label: "Live", href: "https://dermaglowai.vercel.app/" },
      { label: "GitHub", href: "https://github.com/abhinavkarnatak-dev/DermaGlow-AI" },
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
    links: [{ label: "GitHub", href: "https://github.com/abhinavkarnatak-dev/AdaptSense" }],
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
      { label: "GitHub", href: "https://github.com/abhinavkarnatak-dev/AviaGeek" },
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
      { label: "Live", href: "https://sudowiz.vercel.app/" },
      { label: "GitHub", href: "https://github.com/abhinavkarnatak-dev/SudoWiz" },
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
