import Link from "next/link";
import { GridBackground } from "../components/GridBackground";

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-black">
      <GridBackground />
      {/* Hero Section - Yellow */}
      <section className="relative z-10 bg-yellow-400 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-black tracking-tight text-black leading-none mb-6">
            404
          </h1>
          <p className="text-2xl sm:text-3xl text-black font-bold mb-4">
            Page not found
          </p>
          <p className="text-lg sm:text-xl text-black/90 max-w-2xl mx-auto font-medium">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
      </section>

      {/* Main Content - White */}
      <main className="relative z-10 mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 bg-white">
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-black">
              Let&apos;s get you back on track
            </h2>
            <p className="text-lg text-black/70 font-medium">
              Here are some helpful links to get you started:
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/jobs"
              className="border-2 border-black bg-black px-6 py-3 text-sm font-bold text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all shadow-lg"
            >
              Browse Jobs
            </Link>
            <Link
              href="/blog"
              className="border-2 border-black bg-white px-6 py-3 text-sm font-bold text-black hover:bg-black hover:text-yellow-400 transition-all shadow-lg"
            >
              Read Blog
            </Link>
            <Link
              href="/"
              className="border-2 border-black bg-yellow-400 px-6 py-3 text-sm font-bold text-black hover:bg-black hover:text-yellow-400 transition-all shadow-lg"
            >
              Go Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

