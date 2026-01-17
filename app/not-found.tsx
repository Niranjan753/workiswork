import Link from "next/link";
import { GridBackground } from "../components/GridBackground";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="relative z-10 py-16 sm:py-20 lg:py-24 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center text-foreground">
          <h1 className="text-8xl sm:text-9xl md:text-[10rem] font-bold tracking-tight leading-none mb-6">
            404
          </h1>
          <p className="text-2xl sm:text-3xl font-bold mb-4">
            Page not found
          </p>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 bg-background">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Let&apos;s get you back on track
            </h2>
            <p className="text-lg text-muted-foreground font-medium">
              Here are some helpful links to get you started:
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/jobs"
              className="bg-primary px-8 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm rounded-md"
            >
              Browse Jobs
            </Link>
            <Link
              href="/blog"
              className="bg-secondary px-8 py-3 text-sm font-bold text-secondary-foreground hover:bg-secondary/80 transition-all shadow-sm rounded-md"
            >
              Read Blog
            </Link>
            <Link
              href="/"
              className="bg-secondary px-8 py-3 text-sm font-bold text-secondary-foreground hover:bg-secondary/80 transition-all shadow-sm rounded-md"
            >
              Go Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

