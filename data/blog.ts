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
    publishedAt: "2026-01-03",
    contentHtml: `
<p>Remote work is no longer rare. The problem isn’t <em>finding</em> remote jobs — it’s finding remote jobs that don’t waste your time or quietly stall your career.</p>

<p>On most job boards you’re fighting three things at once:</p>
<ul>
  <li><strong>Volume</strong> – hundreds of near-identical listings.</li>
  <li><strong>Vagueness</strong> – no salary, no real info on how the team works.</li>
  <li><strong>Low‑signal companies</strong> – anyone with a login can post.</li>
</ul>

<p>Here’s a simple framework we recommend to remote candidates on WorkIsWork.</p>

<h2>1. Start with a sharp search, not a vague wish</h2>
<p>“Remote developer” is how you doom-scroll. “Senior React engineer, EU time zones, €90k+” is how you actually get interviews.</p>
<p>Before you search, write down:</p>
<ul>
  <li>The <strong>exact type of work</strong> you want to do in the next 18–24 months.</li>
  <li>Three non‑negotiables (e.g. salary floor, time‑zone overlap, team size).</li>
  <li>One or two stretch goals (e.g. AI exposure, greenfield product, staff track).</li>
</ul>
<p>When you use WorkIsWork, you can combine this with our categories, keywords and your onboarding answers so the feed only shows roles that match this picture.</p>

<h2>2. Filter for <em>real</em> remote, not “remote-ish”</h2>
<p>Way too many “remote” roles are actually three days a week in an office somewhere.</p>
<p>Good remote roles are bluntly clear about:</p>
<ul>
  <li><strong>Time zones</strong> – where teammates sit and what overlap is expected.</li>
  <li><strong>Location constraints</strong> – country, region, employment type.</li>
  <li><strong>Travel expectations</strong> – offsites, customer visits, conferences.</li>
</ul>
<p>On WorkIsWork we label roles as worldwide or region‑specific, and we reject posts that hide hybrid roles behind “remote” buzzwords.</p>

<h2>3. Read the job post like a landing page</h2>
<p>Bad remote jobs drown you in bullet points. Good ones make it obvious why the role exists and what success looks like.</p>
<p>As you scan a posting, ask:</p>
<ul>
  <li>Is the <strong>mission</strong> and product clear in two paragraphs?</li>
  <li>Do they describe <strong>problems</strong> to solve, not just tools to know?</li>
  <li>Is there a <strong>real manager</strong> attached to the role, not just “the business”?</li>
</ul>
<p>If a job post on WorkIsWork reads like a landing page — clear outcome, clear offer, clear next step — it’s usually a good signal about how the team communicates internally too.</p>

<h2>4. Screen companies, not just titles</h2>
<p>The same title can mean wildly different things across companies. Focus more on <strong>who</strong> you’ll be working with than the exact label.</p>
<p>Look for signs of a healthy remote culture:</p>
<ul>
  <li>Async‑friendly rituals (written updates, recorded meetings, good documentation).</li>
  <li>Clear progression paths for remote ICs and managers.</li>
  <li>Evidence they’ve hired remotely before (and not just as a pandemic experiment).</li>
</ul>
<p>Because WorkIsWork is built for remote‑first teams, we bias the board toward companies that already work this way.</p>

<h2>5. Treat your applications like experiments</h2>
<p>Instead of firing off 100 generic CVs, send 10 sharp applications and track what happens.</p>
<ul>
  <li>Keep a simple spreadsheet of roles from WorkIsWork you applied to.</li>
  <li>Note who responded, how quickly, and what they seemed to care about.</li>
  <li>Update your portfolio, CV, or case studies based on that feedback loop.</li>
</ul>
<p>Remote careers compound. Being a little more intentional at the search stage means you move faster, get better offers, and avoid the “just another remote job” trap.</p>

<p><strong>Bottom line:</strong> use WorkIsWork as a high‑signal filter, not just another tab of noise. Define what “good” looks like for you, and only let those roles through.</p>
    `,
  },
  {
    slug: "the-anatomy-of-a-high-converting-remote-job-post",
    title: "The Anatomy of a High-Converting Remote Job Post",
    excerpt:
      "Companies: here’s how to write remote job posts candidates actually want to apply to.",
    category: "Hiring",
    readTime: "5 min read",
    heroLabel: "For hiring managers & founders",
    publishedAt: "2026-01-02",
    contentHtml: `
<p>Most remote job posts read like internal HR documents that accidentally escaped into the wild. Great candidates skim them, shrug, and move on.</p>

<p>But when you get the job post right, something different happens:</p>
<ul>
  <li>You attract fewer but <strong>far better</strong> applicants.</li>
  <li>People arrive in interviews already understanding the role.</li>
  <li>Your team looks like it actually knows how to work remotely.</li>
</ul>

<p>Here’s how to write remote job posts that convert on WorkIsWork.</p>

<h2>1. Lead with the mission and the problem</h2>
<p>Your first 3–4 sentences should answer one question: <em>“Why does this role exist?”</em></p>
<p>Instead of:</p>
<blockquote>
  <p>“We are seeking a highly motivated, detail‑oriented individual to join our fast‑paced team…”</p>
</blockquote>
<p>Try:</p>
<blockquote>
  <p>“We’re rethinking how remote teams hire across borders. You’ll be our first Product Designer, shaping the workflows thousands of candidates see every week.”</p>
</blockquote>

<h2>2. Make the offer concrete</h2>
<p>Remote candidates have options. Vague packages = low trust.</p>
<ul>
  <li>Share a <strong>salary range</strong> (and currency) you’re confident in.</li>
  <li>Specify <strong>timezone overlaps</strong> instead of “global”.</li>
  <li>Be explicit about employment type, equity, benefits, and travel.</li>
</ul>
<p>On WorkIsWork, these details help your post surface in the right searches — and it tells serious candidates you respect their time.</p>

<h2>3. Show how remote work actually happens on your team</h2>
<p>The best candidates are screening you as hard as you’re screening them.</p>
<p>Add a short section called “How we work remotely” and describe:</p>
<ul>
  <li>How you handle <strong>communication</strong> (Slack, Notion, Loom, weekly calls).</li>
  <li>How you run <strong>projects</strong> (sprints, cycles, roadmaps).</li>
  <li>How you give <strong>feedback</strong> and measure success.</li>
</ul>
<p>This is where you can stand out on the WorkIsWork board: instead of another bullet list of tools, you’re telling a story about the team they’re joining.</p>

<h2>4. Turn responsibilities into outcomes</h2>
<p>“Own feature X” doesn’t mean much. “Ship X that increases trial → paid by 15%” does.</p>
<p>Pick 3–5 outcomes your hire will be responsible for in the first 6–12 months. Phrase them in plain language, e.g.:</p>
<ul>
  <li>“Design and launch a new onboarding flow used by 10,000+ candidates.”</li>
  <li>“Help us design our first design system and UI kit for all future products.”</li>
  <li>“Collaborate with founders and engineers across 4 time zones.”</li>
</ul>

<h2>5. Make it ridiculously easy to apply</h2>
<p>Every extra click costs you senior candidates.</p>
<ul>
  <li>Use a clear, single call‑to‑action: <strong>“Apply on WorkIsWork”</strong> or a short external form.</li>
  <li>Ask only for what you actually read: CV, portfolio, 2–3 focused questions.</li>
  <li>Mention response expectations (e.g. “We respond to all candidates within 7 days”).</li>
</ul>

<p>When you post on WorkIsWork, we help you structure all of this into our squared UI so the post reads clean, scannable, and honest — exactly what remote candidates are looking for.</p>

<p><strong>Write your next remote job post like a landing page, not a policy doc. You’ll hire better people, faster.</strong></p>
    `,
  },
  {
    slug: "building-a-healthy-remote-routine",
    title: "Building a Healthy Remote Routine",
    excerpt:
      "A simple system for avoiding burnout and loneliness when you’re several time zones away from your team.",
    category: "Lifestyle",
    readTime: "4 min read",
    heroLabel: "For remote workers",
    publishedAt: "2026-01-01",
    contentHtml: `
<p>Remote work can be the best thing that ever happened to your career — or the fastest route to quiet burnout.</p>

<p>The difference usually isn’t the company or the tool stack. It’s whether you have a <strong>deliberate routine</strong> or you’re just reacting to pings all day from your kitchen table.</p>

<p>Here’s a simple system we recommend to candidates on WorkIsWork who want long, healthy remote careers.</p>

<h2>1. Design your ideal week, then approximate it</h2>
<p>Start with constraints: time zones, family, energy. Then sketch your “ideal” week on paper:</p>
<ul>
  <li>3–4 blocks of deep work (90–120 minutes) with no meetings.</li>
  <li>Dedicated collaboration windows with your team’s core hours.</li>
  <li>Non‑negotiable rest: sleep, movement, meals away from screens.</li>
</ul>
<p>You probably won’t hit this perfectly — but aiming at something specific is what pulls your routine into shape.</p>

<h2>2. Create a real boundary between “home” and “work”</h2>
<p>When your office is also your bedroom, your brain never fully clocks out.</p>
<p>Small rituals help:</p>
<ul>
  <li>A short <strong>commute walk</strong> before and after work, even if it’s just around the block.</li>
  <li>Closing your laptop and physically putting it away at a set time.</li>
  <li>Using different lighting or music for work vs. rest.</li>
</ul>
<p>Remote‑friendly companies on WorkIsWork tend to respect these boundaries — but you still have to defend them.</p>

<h2>3. Make your work visible in writing</h2>
<p>In remote teams, nobody can “see” you working. They only see artifacts.</p>
<p>Adopt a lightweight habit:</p>
<ul>
  <li>Every morning: write 3–5 bullets of what you’ll move forward.</li>
  <li>Every evening: share a short async update in Slack or Notion.</li>
  <li>Every week: summarize what shipped and what you learned.</li>
</ul>
<p>This keeps your manager and teammates relaxed — and it makes promotion conversations much easier.</p>

<h2>4. Schedule connection on purpose</h2>
<p>Loneliness is the tax on remote work that nobody warns you about.</p>
<p>Fight it proactively:</p>
<ul>
  <li>Book 1–2 recurring social calls with friends or peers.</li>
  <li>Join a co‑working space once or twice a week if you can.</li>
  <li>Use your company’s budget for meetups, conferences, or offsites.</li>
</ul>

<h2>5. Protect your attention like a scarce resource</h2>
<p>Slack, email, and notifications will eat your life if you let them.</p>
<ul>
  <li>Mute non‑critical channels during deep work blocks.</li>
  <li>Batch communication into a few windows per day.</li>
  <li>Close everything except the one task you’re working on.</li>
</ul>

<p>Remote work is sustainable when your routine supports it. Use WorkIsWork to find teams that respect focus time and boundaries — and bring your own healthy rhythm to the table.</p>
    `,
  },
];


