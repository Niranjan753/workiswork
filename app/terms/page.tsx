import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl, getOgImageUrl } from "../../lib/site-url";

const siteUrl = getSiteUrl();
const ogImage = getOgImageUrl();

export const metadata: Metadata = {
  title: "Terms of Service – WorkIsWork",
  description: "Read our terms of service and understand your rights and responsibilities when using WorkIsWork.",
  openGraph: {
    type: "website",
    url: `${siteUrl}/terms`,
    title: "Terms of Service – WorkIsWork",
    description: "Read our terms of service and understand your rights and responsibilities when using WorkIsWork.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "WorkIsWork Terms of Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service – WorkIsWork",
    description: "Read our terms of service and understand your rights and responsibilities when using WorkIsWork.",
    images: [ogImage],
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose prose-zinc max-w-none">
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-zinc-600 mb-8">
            Last updated: January 6, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-zinc-600 mb-4">
              By accessing and using WorkIsWork ("the Service"), you accept and agree to be bound by the 
              terms and provision of this agreement. If you do not agree to abide by the above, please 
              do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">
              2. Use License
            </h2>
            <p className="text-zinc-600 mb-4">
              Permission is granted to temporarily access the materials on WorkIsWork's website for personal, 
              non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, 
              and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-zinc-600 space-y-2 mb-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on WorkIsWork's website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">
              3. User Accounts
            </h2>
            <p className="text-zinc-600 mb-4">
              When you create an account with us, you must provide information that is accurate, complete, 
              and current at all times. You are responsible for safeguarding the password and for all activities 
              that occur under your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">
              4. Job Listings
            </h2>
            <p className="text-zinc-600 mb-4">
              WorkIsWork provides a platform for employers to post job listings. We do not guarantee the 
              accuracy, completeness, or quality of any job listing. Employers are solely responsible for the 
              content of their job postings. WorkIsWork reserves the right to remove any job listing at any 
              time without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">
              5. Prohibited Uses
            </h2>
            <p className="text-zinc-600 mb-4">
              You may not use our Service:
            </p>
            <ul className="list-disc list-inside text-zinc-600 space-y-2 mb-4">
              <li>In any way that violates any applicable national or international law or regulation</li>
              <li>To transmit, or procure the sending of, any advertising or promotional material</li>
              <li>To impersonate or attempt to impersonate the company, a company employee, another user, 
                  or any other person or entity</li>
              <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, 
                  fraudulent, or harmful</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">
              6. Disclaimer
            </h2>
            <p className="text-zinc-600 mb-4">
              The materials on WorkIsWork's website are provided on an 'as is' basis. WorkIsWork makes no 
              warranties, expressed or implied, and hereby disclaims and negates all other warranties including 
              without limitation, implied warranties or conditions of merchantability, fitness for a particular 
              purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">
              7. Limitations
            </h2>
            <p className="text-zinc-600 mb-4">
              In no event shall WorkIsWork or its suppliers be liable for any damages (including, without 
              limitation, damages for loss of data or profit, or due to business interruption) arising out 
              of the use or inability to use the materials on WorkIsWork's website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">
              8. Revisions
            </h2>
            <p className="text-zinc-600 mb-4">
              WorkIsWork may revise these terms of service for its website at any time without notice. By 
              using this website you are agreeing to be bound by the then current version of these terms of 
              service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">
              9. Contact Information
            </h2>
            <p className="text-zinc-600 mb-4">
              If you have any questions about these Terms of Service, please contact us at{" "}
              <Link href="mailto:hello@workiswork.com" className="text-orange-600 hover:text-orange-700">
                hello@workiswork.com
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

