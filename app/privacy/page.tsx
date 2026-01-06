import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy – WorkIsWork",
  description: "Learn how WorkIsWork collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose prose-zinc max-w-none">
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-zinc-600 mb-8">
            Last updated: January 6, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">
              1. Introduction
            </h2>
            <p className="text-zinc-600 mb-4">
              WorkIsWork ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our website 
              and services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">
              2. Information We Collect
            </h2>
            <h3 className="text-xl font-semibold text-zinc-900 mb-3">
              Personal Information
            </h3>
            <p className="text-zinc-600 mb-4">
              We may collect personal information that you provide to us, including:
            </p>
            <ul className="list-disc list-inside text-zinc-600 space-y-2 mb-4">
              <li>Name and contact information (email address, phone number)</li>
              <li>Account credentials (username, password)</li>
              <li>Profile information (resume, work history, skills)</li>
              <li>Job preferences and search criteria</li>
              <li>Payment information (for premium services)</li>
            </ul>

            <h3 className="text-xl font-semibold text-zinc-900 mb-3">
              Automatically Collected Information
            </h3>
            <p className="text-zinc-600 mb-4">
              When you use our Service, we automatically collect certain information, including:
            </p>
            <ul className="list-disc list-inside text-zinc-600 space-y-2 mb-4">
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages visited, time spent, clicks)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-zinc-600 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-zinc-600 space-y-2 mb-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process and manage your account and job applications</li>
              <li>Send you job alerts and notifications based on your preferences</li>
              <li>Communicate with you about our services, updates, and promotional offers</li>
              <li>Detect, prevent, and address technical issues and security threats</li>
              <li>Comply with legal obligations and enforce our terms of service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">
              4. Information Sharing and Disclosure
            </h2>
            <p className="text-zinc-600 mb-4">
              We do not sell your personal information. We may share your information in the following 
              circumstances:
            </p>
            <ul className="list-disc list-inside text-zinc-600 space-y-2 mb-4">
              <li><strong>With Employers:</strong> When you apply for a job, we share your application 
                  information with the employer posting the job.</li>
              <li><strong>Service Providers:</strong> We may share information with third-party service 
                  providers who perform services on our behalf (e.g., email delivery, payment processing).</li>
              <li><strong>Legal Requirements:</strong> We may disclose information if required by law or 
                  in response to valid requests by public authorities.</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of 
                  assets, your information may be transferred.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">
              5. Data Security
            </h2>
            <p className="text-zinc-600 mb-4">
              We implement appropriate technical and organizational security measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction. However, no method 
              of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee 
              absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">
              6. Your Rights and Choices
            </h2>
            <p className="text-zinc-600 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-zinc-600 space-y-2 mb-4">
              <li>Access and receive a copy of your personal information</li>
              <li>Rectify inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to or restrict processing of your information</li>
              <li>Data portability (receive your data in a structured format)</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="text-zinc-600 mb-4">
              To exercise these rights, please contact us at{" "}
              <Link href="mailto:hello@workiswork.com" className="text-orange-600 hover:text-orange-700">
                hello@workiswork.com
              </Link>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">
              7. Cookies and Tracking Technologies
            </h2>
            <p className="text-zinc-600 mb-4">
              We use cookies and similar tracking technologies to track activity on our Service and hold certain 
              information. You can instruct your browser to refuse all cookies or to indicate when a cookie is 
              being sent. However, if you do not accept cookies, you may not be able to use some portions of 
              our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">
              8. Children's Privacy
            </h2>
            <p className="text-zinc-600 mb-4">
              Our Service is not intended for individuals under the age of 18. We do not knowingly collect 
              personal information from children. If you are a parent or guardian and believe your child has 
              provided us with personal information, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">
              9. Changes to This Privacy Policy
            </h2>
            <p className="text-zinc-600 mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page and updating the "Last updated" date. You are advised to 
              review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">
              10. Contact Us
            </h2>
            <p className="text-zinc-600 mb-4">
              If you have any questions about this Privacy Policy, please contact us at{" "}
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

