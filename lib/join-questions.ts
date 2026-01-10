export type JoinQuestion = {
  id: number;
  label: string;
  helper?: string;
  placeholder?: string;
  options: string[];
  categoryBased?: boolean;
};

const categoryChips = [
  { label: "Software Development", slug: "software-development" },
  { label: "Customer Service", slug: "customer-support" },
  { label: "Design", slug: "design" },
  { label: "Marketing", slug: "marketing" },
  { label: "Sales / Business", slug: "sales" },
  { label: "Product", slug: "product" },
  { label: "Project Management", slug: "project" },
  { label: "AI / ML", slug: "ai-ml" },
  { label: "Data Analysis", slug: "data-analysis" },
  { label: "Devops / Sysadmin", slug: "devops" },
  { label: "Finance", slug: "finance" },
  { label: "Human Resources", slug: "human-resources" },
  { label: "QA", slug: "qa" },
  { label: "Writing", slug: "writing" },
  { label: "Legal", slug: "legal" },
  { label: "Medical", slug: "medical" },
  { label: "Education", slug: "education" },
  { label: "All Others", slug: "all-others" },
];

const getCategorySpecificOptions = (categorySlug: string): { [key: number]: string[] } => {
  const options: { [key: number]: string[] } = {};

  switch (categorySlug) {
    case "software-development":
      options[2] = [
        "React",
        "TypeScript",
        "Node.js",
        "Python",
        "Java",
        "Go",
        "Rust",
        "Full-Stack Development",
        "Frontend Development",
        "Backend Development",
        "Mobile Development",
        "DevOps",
        "Other / Not Listed",
      ];
      options[1] = [
        "Senior Software Engineer",
        "Full-Stack Developer",
        "Frontend Developer",
        "Backend Developer",
        "Mobile Developer",
        "DevOps Engineer",
        "Technical Lead",
        "Other / Not Listed",
      ];
      break;

    case "design":
      options[2] = [
        "UI/UX Design",
        "Product Design",
        "Visual Design",
        "User Research",
        "Design Systems",
        "Figma",
        "Prototyping",
        "Design Strategy",
        "Other / Not Listed",
      ];
      options[1] = [
        "Product Designer",
        "UI Designer",
        "UX Designer",
        "Design Lead",
        "Visual Designer",
        "User Researcher",
        "Design Systems Designer",
        "Other / Not Listed",
      ];
      break;

    case "marketing":
      options[2] = [
        "Content Marketing",
        "SEO/SEM",
        "Social Media Marketing",
        "Email Marketing",
        "Growth Marketing",
        "Product Marketing",
        "Brand Marketing",
        "Marketing Analytics",
        "Other / Not Listed",
      ];
      options[1] = [
        "Marketing Manager",
        "Content Marketing Manager",
        "Growth Marketing Manager",
        "Product Marketing Manager",
        "SEO Specialist",
        "Marketing Analyst",
        "Marketing Lead",
        "Other / Not Listed",
      ];
      break;

    case "product":
      options[2] = [
        "Product Strategy",
        "Product Analytics",
        "User Research",
        "Roadmap Planning",
        "Stakeholder Management",
        "A/B Testing",
        "Feature Discovery",
        "Product Metrics",
        "Other / Not Listed",
      ];
      options[1] = [
        "Product Manager",
        "Senior Product Manager",
        "Product Lead",
        "Associate Product Manager",
        "Product Owner",
        "Technical Product Manager",
        "Other / Not Listed",
      ];
      break;

    case "sales":
      options[2] = [
        "B2B Sales",
        "B2C Sales",
        "Account Management",
        "Sales Development",
        "Sales Operations",
        "CRM Management",
        "Negotiation",
        "Lead Generation",
        "Other / Not Listed",
      ];
      options[1] = [
        "Sales Manager",
        "Account Executive",
        "Sales Development Representative",
        "Business Development Manager",
        "Sales Operations Manager",
        "Account Manager",
        "Sales Lead",
        "Other / Not Listed",
      ];
      break;

    case "customer-support":
      options[2] = [
        "Customer Service",
        "Technical Support",
        "Customer Success",
        "Support Operations",
        "Customer Experience",
        "Help Desk",
        "Client Relations",
        "Customer Advocacy",
        "Other / Not Listed",
      ];
      options[1] = [
        "Customer Support Manager",
        "Customer Success Manager",
        "Technical Support Engineer",
        "Support Specialist",
        "Customer Experience Manager",
        "Other / Not Listed",
      ];
      break;

    default:
      options[2] = [
        "Specialized Skills",
        "Industry Knowledge",
        "Technical Skills",
        "Soft Skills",
        "Other / Not Listed",
      ];
      options[1] = [
        "Senior Role",
        "Mid-Level Role",
        "Entry-Level Role",
        "Lead Role",
        "Other / Not Listed",
      ];
  }

  return options;
};

export const getJoinQuestions = (selectedCategory?: string): JoinQuestion[] => {
  const categoryOptions = categoryChips.map((cat) => cat.label);
  const categorySpecificOptions = selectedCategory
    ? getCategorySpecificOptions(
        categoryChips.find((c) => c.label === selectedCategory)?.slug || ""
      )
    : {};

  return [
    {
      id: 0,
      label: "What category are you most interested in?",
      helper: "Select the field you want to work in.",
      options: categoryOptions,
    },
    {
      id: 1,
      label: "What kind of remote role are you looking for?",
      helper: "Based on your selected category, choose your ideal role.",
      placeholder: "Your ideal role title",
      options: categorySpecificOptions[1] || [
        "Senior Role",
        "Mid-Level Role",
        "Entry-Level Role",
        "Lead Role",
        "Other / Not Listed",
      ],
      categoryBased: true,
    },
    {
      id: 2,
      label: "What are your top 3 skills?",
      helper: "Think in terms of hard skills that hiring managers search for.",
      placeholder: "Select up to 3 skills",
      options: categorySpecificOptions[2] || [
        "General Skills",
        "Technical Skills",
        "Soft Skills",
        "Other / Not Listed",
      ],
      categoryBased: true,
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
        "SaaS Companies",
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
        "$130k–$150k",
        "$150k+",
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
  ];
};

export const JOIN_QUESTIONS = getJoinQuestions();
