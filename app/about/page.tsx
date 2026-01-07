import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, Users, Target, Heart } from "lucide-react";
import { getSiteUrl, getOgImageUrl } from "../../lib/site-url";

const siteUrl = getSiteUrl();
const ogImage = getOgImageUrl();

export const metadata: Metadata = {
  title: "About Us – WorkIsWork",
  description: "Learn about WorkIsWork and our mission to connect remote workers with the best opportunities.",
  openGraph: {
    type: "website",
    url: `${siteUrl}/about`,
    title: "About Us – WorkIsWork",
    description: "Learn about WorkIsWork and our mission to connect remote workers with the best opportunities.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "About WorkIsWork",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us – WorkIsWork",
    description: "Learn about WorkIsWork and our mission to connect remote workers with the best opportunities.",
    images: [ogImage],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-yellow-400">
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-black mb-4">
            About WorkIsWork
          </h1>
          <p className="text-lg text-black/80 max-w-2xl mx-auto font-medium">
            We're on a mission to make remote work accessible to everyone, everywhere.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-6">Our Mission</h2>
          <div className="prose prose-zinc max-w-none">
            <p className="text-black/80 text-lg leading-relaxed mb-4 font-medium">
              WorkIsWork was born from a simple belief: great work shouldn't be limited by geography. 
              We curate the best remote job opportunities from around the world, making it easier for 
              talented professionals to find their next role, and for companies to discover exceptional 
              remote talent.
            </p>
            <p className="text-black/80 text-lg leading-relaxed font-medium">
              Whether you're a developer in Lagos, a designer in Lisbon, or a marketer in Manila, 
              we believe you deserve access to the same opportunities as anyone else. That's why we've 
              built a platform that's truly global, inclusive, and focused on quality over quantity.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border-2 border-black bg-yellow-500 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-black">
                  <Target className="h-5 w-5 text-yellow-400" />
                </div>
                <h3 className="text-lg font-bold text-black">Quality First</h3>
              </div>
              <p className="text-black/80 font-medium">
                We hand-curate every job listing to ensure you're seeing the best opportunities, 
                not just the most recent ones.
              </p>
            </div>

            <div className="p-6 rounded-xl border-2 border-black bg-yellow-500 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-black">
                  <Users className="h-5 w-5 text-yellow-400" />
                </div>
                <h3 className="text-lg font-bold text-black">Inclusivity</h3>
              </div>
              <p className="text-black/80 font-medium">
                Remote work breaks down barriers. We're committed to making opportunities accessible 
                to everyone, regardless of location or background.
              </p>
            </div>

            <div className="p-6 rounded-xl border-2 border-black bg-yellow-500 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-black">
                  <Briefcase className="h-5 w-5 text-yellow-400" />
                </div>
                <h3 className="text-lg font-bold text-black">Transparency</h3>
              </div>
              <p className="text-black/80 font-medium">
                No hidden fees, no fake listings. We believe in honest, upfront communication with 
                both job seekers and employers.
              </p>
            </div>

            <div className="p-6 rounded-xl border-2 border-black bg-yellow-500 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-black">
                  <Heart className="h-5 w-5 text-yellow-400" />
                </div>
                <h3 className="text-lg font-bold text-black">Community</h3>
              </div>
              <p className="text-black/80 font-medium">
                We're building more than a job board—we're building a community of remote workers 
                who support and learn from each other.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-16">
          <div className="bg-yellow-500 rounded-2xl p-8 border-2 border-black shadow-lg">
            <h2 className="text-2xl font-bold text-black mb-6 text-center">
              By the Numbers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">12,543+</div>
                <div className="text-sm text-black/80 font-medium">Active Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">8,432+</div>
                <div className="text-sm text-black/80 font-medium">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">45,231+</div>
                <div className="text-sm text-black/80 font-medium">Job Seekers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">150+</div>
                <div className="text-sm text-black/80 font-medium">Countries</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-black mb-4">
            Join Us on This Journey
          </h2>
          <p className="text-black/80 mb-6 font-medium">
            Whether you're looking for your next opportunity or trying to find the perfect remote talent, 
            we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/jobs"
              className="rounded-xl bg-black px-6 py-3 text-sm font-bold text-yellow-400 hover:bg-yellow-500 hover:text-black transition-all shadow-lg"
            >
              Browse Jobs
            </Link>
            <Link
              href="/admin"
              className="rounded-xl border-2 border-black bg-yellow-500 px-6 py-3 text-sm font-bold text-black hover:bg-black hover:text-yellow-400 transition-all shadow-lg"
            >
              Post a Job
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

