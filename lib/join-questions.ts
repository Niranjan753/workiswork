export type JoinQuestion = {
  id: number;
  label: string;
  helper?: string;
  placeholder?: string;
  options: string[];
};

export const JOIN_QUESTIONS: JoinQuestion[] = [
  {
    id: 1,
    label: "What kind of remote role are you looking for?",
    helper: "e.g. Senior Frontend Engineer, Product Designer, Marketing Lead",
    placeholder: "Your ideal role title",
    options: [
      "Senior Frontend Engineer",
      "Product Designer",
      "Marketing Lead",
      "Fullstack Developer",
      "Product Manager",
      "Data Scientist",
      "Other / Not Listed",
    ],
  },
  {
    id: 2,
    label: "What are your top 3 skills?",
    helper: "Think in terms of hard skills that hiring managers search for.",
    placeholder: "React, TypeScript, Design Systems, etc.",
    options: [
      "React",
      "TypeScript",
      "Design Systems",
      "Python",
      "UI/UX Design",
      "Copywriting",
      "Machine Learning",
      "Project Management",
      "Other / Not Listed",
    ],
  },
  {
    id: 3,
    label: "Which time zones can you comfortably work in?",
    helper: "Share a range or specific regions.",
    placeholder: "e.g. UTC-5 to UTC+2, US-only, Europe-friendly",
    options: [
      "US Only",
      "Americas (UTC-8 to UTC-3)",
      "Europe (UTC+0 to UTC+3)",
      "Asia-Pacific (UTC+5 to UTC+10)",
      "Global/Any",
      "Other / Not Listed",
    ],
  },
  {
    id: 4,
    label: "What type of companies are you most interested in?",
    helper: "Stage, size, and industry.",
    placeholder: "Early-stage SaaS startups, consumer marketplaces, fintech, etc.",
    options: [
      "Early-stage startups",
      "Growth-stage companies",
      "Enterprise/Big Tech",
      "Nonprofit",
      "Fintech",
      "Consumer marketplaces",
      "Other / Not Listed",
    ],
  },
  {
    id: 5,
    label: "What is your target salary range (in USD)?",
    helper: "You can share a range or a minimum.",
    placeholder: "e.g. $90k–$130k or $120k+",
    options: [
      "$50k–$70k",
      "$70k–$90k",
      "$90k–$110k",
      "$110k–$130k",
      "$130k+",
      "Flexible / Open",
      "Prefer not to say",
    ],
  },
  {
    id: 6,
    label: "Where are you legally allowed to work from?",
    helper: "Countries / regions you have work authorization in.",
    placeholder: "e.g. US, Canada, EU, remote contractor worldwide",
    options: [
      "US",
      "Canada",
      "EU",
      "UK",
      "APAC",
      "Remote contractor worldwide",
      "Other / Not Listed",
    ],
  },
  {
    id: 7,
    label: "How many years of relevant experience do you have?",
    placeholder: "e.g. 3 years, 7+ years",
    options: [
      "0-1 years",
      "2-3 years",
      "4-6 years",
      "7-10 years",
      "10+ years",
      "Prefer not to say",
    ],
  },
  {
    id: 8,
    label: "What does your ideal remote work setup look like?",
    helper: "Team size, meeting culture, async vs sync, etc.",
    placeholder: "e.g. Small team, low meeting load, strong async culture",
    options: [
      "Small team, async-first",
      "Large org, strong process",
      "Startup, flat structure",
      "Low meeting load",
      "High-collaboration",
      "Flexible/No preference",
      "Other / Not Listed",
    ],
  },
  {
    id: 9,
    label: "What types of contracts are you open to?",
    helper: "Full-time, part-time, freelance, contract-to-hire, etc.",
    placeholder: "e.g. Full-time only, or full-time + freelance",
    options: [
      "Full-time",
      "Part-time",
      "Freelance/Contract",
      "Contract-to-hire",
      "Internship",
      "Open to all",
      "Other / Not Listed",
    ],
  },
  {
    id: 10,
    label: "Drop a quick note about what you want next in your career.",
    helper: "This helps us understand your direction beyond titles.",
    placeholder: "e.g. I want to move into a lead role while still coding daily.",
    options: [
      "Grow as a people leader",
      "Stay IC but take on more ownership",
      "Switch to a new domain/tech",
      "Work in a remote-first org",
      "Find more work-life balance",
      "I'm open / Not sure",
      "Other / Not Listed",
    ],
  },
];


