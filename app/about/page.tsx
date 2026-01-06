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
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">
            About WorkIsWork
          </h1>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            We're on a mission to make remote work accessible to everyone, everywhere.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-zinc-900 mb-6">Our Mission</h2>
          <div className="prose prose-zinc max-w-none">
            <p className="text-zinc-600 text-lg leading-relaxed mb-4">
              WorkIsWork was born from a simple belief: great work shouldn't be limited by geography. 
              We curate the best remote job opportunities from around the world, making it easier for 
              talented professionals to find their next role, and for companies to discover exceptional 
              remote talent.
            </p>
            <p className="text-zinc-600 text-lg leading-relaxed">
              Whether you're a developer in Lagos, a designer in Lisbon, or a marketer in Manila, 
              we believe you deserve access to the same opportunities as anyone else. That's why we've 
              built a platform that's truly global, inclusive, and focused on quality over quantity.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-zinc-900 mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-zinc-200 bg-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <Target className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900">Quality First</h3>
              </div>
              <p className="text-zinc-600">
                We hand-curate every job listing to ensure you're seeing the best opportunities, 
                not just the most recent ones.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-zinc-200 bg-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900">Inclusivity</h3>
              </div>
              <p className="text-zinc-600">
                Remote work breaks down barriers. We're committed to making opportunities accessible 
                to everyone, regardless of location or background.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-zinc-200 bg-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <Briefcase className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900">Transparency</h3>
              </div>
              <p className="text-zinc-600">
                No hidden fees, no fake listings. We believe in honest, upfront communication with 
                both job seekers and employers.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-zinc-200 bg-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <Heart className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900">Community</h3>
              </div>
              <p className="text-zinc-600">
                We're building more than a job board—we're building a community of remote workers 
                who support and learn from each other.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-16">
          <div className="bg-zinc-50 rounded-2xl p-8 border border-zinc-200">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-6 text-center">
              By the Numbers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">12,543+</div>
                <div className="text-sm text-zinc-600">Active Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">8,432+</div>
                <div className="text-sm text-zinc-600">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">45,231+</div>
                <div className="text-sm text-zinc-600">Job Seekers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">150+</div>
                <div className="text-sm text-zinc-600">Countries</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-semibold text-zinc-900 mb-4">
            Join Us on This Journey
          </h2>
          <p className="text-zinc-600 mb-6">
            Whether you're looking for your next opportunity or trying to find the perfect remote talent, 
            we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/jobs"
              className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
            >
              Browse Jobs
            </Link>
            <Link
              href="/admin"
              className="rounded-xl border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 transition-colors"
            >
              Post a Job
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

