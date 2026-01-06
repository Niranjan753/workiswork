export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  heroLabel?: string;
  contentHtml: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-find-remote-jobs-that-dont-suck",
    title: "How to Find Remote Jobs That Don’t Suck",
    excerpt:
      "A practical framework for filtering out noisy job boards and focusing on the roles that actually move your career forward.",
    category: "Career",
    readTime: "6 min read",
    heroLabel: "Remote job search",
    publishedAt: "2026-01-03",
    contentHtml: `
<p>Remote work is no longer rare. The problem isn’t finding remote jobs — it’s finding <strong>good</strong> remote jobs.</p>
<p>In this guide we’ll walk through a practical way to cut through the noise:</p>
<ol>
  <li>Start with a focused role + seniority (e.g. “Senior React Engineer”).</li>
  <li>Filter by timezones and salary bands that actually work for you.</li>
  <li>Track company quality instead of just job titles.</li>
</ol>
<p>Tools like WorkIsWork help by pre-filtering low-quality listings so you only review roles that are actually worth your time.</p>
    `,
  },
  {
    slug: "the-anatomy-of-a-high-converting-remote-job-post",
    title: "The Anatomy of a High-Converting Remote Job Post",
    excerpt:
      "Companies: here’s how to write remote job posts candidates actually want to apply to.",
    category: "Hiring",
    readTime: "5 min read",
    publishedAt: "2026-01-02",
    contentHtml: `
<p>Most remote job posts read like internal HR documents. Candidates skim, bounce, and never apply.</p>
<p>High-converting job posts tend to share a few traits:</p>
<ul>
  <li>They start with the <strong>outcomes</strong> the hire will drive.</li>
  <li>They are explicit about <strong>salary, location and seniority</strong>.</li>
  <li>They show how work actually happens on the team.</li>
</ul>
<p>If you’re posting on WorkIsWork, we encourage you to treat your job post like a landing page, not a compliance doc.</p>
    `,
  },
  {
    slug: "building-a-healthy-remote-routine",
    title: "Building a Healthy Remote Routine",
    excerpt:
      "A simple system for avoiding burnout and loneliness when you’re several time zones away from your team.",
    category: "Lifestyle",
    readTime: "4 min read",
    publishedAt: "2026-01-01",
    contentHtml: `
<p>Remote work can be freeing — and also quietly draining.</p>
<p>Instead of chasing hacks, focus on a few durable habits:</p>
<ul>
  <li>Define hard <strong>start and stop times</strong> for deep work.</li>
  <li>Schedule <strong>social time</strong> on your calendar the same way you schedule meetings.</li>
  <li>Make your work visible with short daily updates to your team.</li>
</ul>
<p>The best remote careers are sustainable ones.</p>
    `,
  },
];


