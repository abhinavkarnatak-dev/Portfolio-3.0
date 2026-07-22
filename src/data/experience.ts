import type { EducationItem, ExperienceItem } from "./types";

export const experience: ExperienceItem[] = [
  {
    org: "Capgemini · Mumbai",
    role: "Analyst (Software Engineer)",
    period: "Sep 2025 - May 2026",
    bullets: [
      "Troubleshot network and connectivity issues across live enterprise environments, resolving assigned tickets within SLA.",
      "Worked hands-on with Linux and Windows server environments while handling routine operational checks.",
      "Monitored system health with the team to keep daily operations running - and learned how production systems actually behave outside of demos.",
    ],
  },
  {
    org: "HERE Technologies · Remote",
    role: "Data Engineer Intern",
    period: "Jun 2024 - Jul 2024",
    bullets: [
      "Built custom Python web crawlers with Scrapy to scrape store locations from retail websites with wildly different HTML layouts.",
      "Scheduled automated spiders to collect data in the background, cutting manual effort by ~30% of operational time.",
      "Documented the workflow and codebase so the pipeline stayed maintainable after the internship ended.",
    ],
  },
];

export const education: EducationItem[] = [
  {
    institution: "University of Petroleum and Energy Studies",
    degree: "B.Tech, Computer Science & Engineering",
    period: "Aug 2021 - May 2025",
    detail:
      "Served as Student Placement Representative (SPR), coordinating between the placement cell and students during campus recruitment.",
  },
];
