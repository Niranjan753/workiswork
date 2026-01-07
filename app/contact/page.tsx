"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // In a real app, you'd send this to an API endpoint
    // For now, we'll just show a success message
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Yellow */}
      <section className="bg-yellow-400 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-black leading-none mb-6">
            Get in Touch
          </h1>
          <p className="text-lg sm:text-xl text-black/90 max-w-2xl mx-auto font-medium">
            Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Main Content - White */}
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 bg-white">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 rounded-xl border-2 border-black bg-yellow-500 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-black">
                  <Mail className="h-5 w-5 text-yellow-400" />
                </div>
                <h3 className="text-lg font-bold text-black">Email</h3>
              </div>
              <p className="text-black/80 text-sm mb-2 font-medium">General inquiries</p>
              <a
                href="mailto:hello@workiswork.com"
                className="text-black font-bold underline hover:text-black/80 text-sm"
              >
                hello@workiswork.com
              </a>
            </div>

            <div className="p-6 rounded-xl border-2 border-black bg-yellow-500 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-black">
                  <MessageSquare className="h-5 w-5 text-yellow-400" />
                </div>
                <h3 className="text-lg font-bold text-black">For Employers</h3>
              </div>
              <p className="text-black/80 text-sm mb-2 font-medium">Sales & partnerships</p>
              <a
                href="mailto:employers@workiswork.com"
                className="text-black font-bold underline hover:text-black/80 text-sm"
              >
                employers@workiswork.com
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="p-8 rounded-xl border-2 border-black bg-yellow-500 shadow-lg space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-bold text-black">
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-yellow-400 border-2 border-black text-black placeholder:text-black/50 focus:border-black"
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold text-black">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="bg-yellow-400 border-2 border-black text-black placeholder:text-black/50 focus:border-black"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-bold text-black">
                  Subject
                </Label>
                <Input
                  id="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="bg-yellow-400 border-2 border-black text-black placeholder:text-black/50 focus:border-black"
                  placeholder="What's this about?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-bold text-black">
                  Message
                </Label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full rounded-lg border-2 border-black bg-yellow-400 px-3 py-2 text-sm text-black placeholder:text-black/50 focus:border-black focus:outline-none"
                  placeholder="Tell us more..."
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-yellow-500 text-yellow-400 hover:text-black font-bold border-2 border-black transition-all shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

