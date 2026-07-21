import type { SkillGroup } from "./types";

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    skills: ["JavaScript", "TypeScript", "C++", "Python"],
  },
  {
    label: "Frontend",
    skills: ["React", "Next.js", "React Native", "Tailwind CSS", "Framer Motion", "PWAs", "Figma"],
  },
  {
    label: "Backend",
    skills: ["Node.js", "Express.js", "Socket.io", "RabbitMQ", "REST APIs"],
  },
  {
    label: "AI / ML",
    skills: ["LangChain", "LangGraph", "RAG", "Agents", "Guardrails", "Gemini API"],
  },
  {
    label: "Databases",
    skills: ["MongoDB", "PostgreSQL", "Prisma", "Redis"],
  },
  {
    label: "DevOps / Cloud",
    skills: ["Docker", "AWS (EC2, S3)", "Nginx", "GitHub Actions", "Linux"],
  },
];
