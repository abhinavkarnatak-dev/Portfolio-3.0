/** Life-in-brief, told as a flight log: hometown -> college -> first job -> now. */

export interface JourneyLayover {
  org: string;
  role: string;
  period: string;
  detail: string;
}

export interface JourneyStop {
  /** Three-letter airport-style code. */
  code: string;
  city: string;
  place: string;
  title: string;
  era: string;
  status: string;
  body: string;
  /** A shorter stint that happened inside this stop's era. */
  layover?: JourneyLayover;
}

export const journeyStops: JourneyStop[] = [
  {
    code: "HDW",
    city: "Haldwani",
    place: "Hometown, Uttarakhand",
    title: "The foothills years",
    era: "2004 - 2021",
    status: "Departed",
    body: "Grew up in Haldwani, a small town tucked in the Uttarakhand hills. School at BLM Academy, then AVBIL, before the move to Dehradun for college.",
  },
  {
    code: "DED",
    city: "Dehradun",
    place: "UPES",
    title: "The campus years",
    era: "Aug 2021 - May 2025",
    status: "Landed",
    body: "B.Tech in Computer Science & Engineering (AIML) at UPES. Served as Student Placement Representative, coordinating between the placement cell and students during campus recruitment.",
    layover: {
      org: "HERE Technologies",
      role: "Data Engineer Intern - Remote",
      period: "Jun - Jul 2024",
      detail:
        "Built Python/Scrapy web crawlers to scrape store locations across retailers with wildly different HTML layouts, cutting manual data-collection effort by about 30%.",
    },
  },
  {
    code: "BOM",
    city: "Mumbai",
    place: "Capgemini",
    title: "The analyst stint",
    era: "Sep 2025 - May 2026",
    status: "Completed",
    body: "Analyst (Software Engineer) at Capgemini - troubleshooting network and connectivity issues, working hands-on with Linux and Windows server environments, and keeping daily operations running. The corporate proving ground, then left to build my own path.",
  },
  {
    code: "TBD",
    city: "Next stop",
    place: "Open",
    title: "The next leap",
    era: "Now - prepping",
    status: "Boarding",
    body: "Back in Dehradun, shipping full-stack and applied-AI projects and interviewing for SDE + AI roles. The next stop is wide open.",
  },
];
