"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

type Category = {
  id: number;
  slug: string;
  name: string;
};

type Company = {
  id: number;
  name: string;
  slug: string;
  websiteUrl: string | null;
};

type Props = {
  categories: Category[];
};

function parseTags(input: string) {
  return input
    .split(/[,\\n]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

export function AdminJobForm({ categories }: Props) {
  const router = useRouter();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successSlug, setSuccessSlug] = React.useState<string | null>(null);
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState("");
  const [receiveByEmail, setReceiveByEmail] = React.useState(false);
  const [highlightColor, setHighlightColor] = React.useState(false);
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
  const [logoFile, setLogoFile] = React.useState<File | null>(null);

  // Company autocomplete state
  const [companyName, setCompanyName] = React.useState("");
  const [companySuggestions, setCompanySuggestions] = React.useState<Company[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<number | null>(null);
  const companyInputRef = React.useRef<HTMLInputElement>(null);

  function addTag() {
    const parsed = parseTags(tagInput);
    if (parsed.length === 0) return;

    // Limit to 4 tags
    const availableSlots = 4 - tags.length;
    if (availableSlots <= 0) {
      alert("Maximum 4 tags allowed");
      return;
    }

    const tagsToAdd = parsed.slice(0, availableSlots);
    const next = Array.from(new Set([...tags, ...tagsToAdd]));
    setTags(next);
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  // Company search with debounce
  React.useEffect(() => {
    if (companyName.length < 2) {
      setCompanySuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`/api/companies/search?q=${encodeURIComponent(companyName)}`);
        const data = await res.json();
        setCompanySuggestions(data.companies || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Failed to search companies:", err);
        setCompanySuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [companyName]);

  function selectCompany(company: Company) {
    setCompanyName(company.name);
    setSelectedCompanyId(company.id);
    setShowSuggestions(false);
    // Set hidden input for company ID
    const hiddenInput = document.querySelector('input[name="companyId"]') as HTMLInputElement;
    if (hiddenInput) {
      hiddenInput.value = String(company.id);
    }
  }

  function handleCompanyNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCompanyName(e.target.value);
    setSelectedCompanyId(null);
    // Clear hidden input
    const hiddenInput = document.querySelector('input[name="companyId"]') as HTMLInputElement;
    if (hiddenInput) {
      hiddenInput.value = "";
    }
  }

  // Parse tags from input and highlight them
  function getTagHighlights(input: string) {
    if (!input) return null;
    const parts = input.split(/(,)/);
    return parts.map((part, index) => {
      if (part === ",") return <span key={index}>,</span>;
      const trimmed = part.trim();
      if (trimmed) {
        return (
          <span
            key={index}
            className="bg-orange-500/20 text-orange-300 px-1 font-bold rounded"
          >
            {trimmed}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setLogoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);
    setSuccessSlug(null);

    try {
      const formData = new FormData(e.currentTarget);

      const jobData: any = {
        title: formData.get("title"),
        companyName: formData.get("companyName"),
        companyWebsite: formData.get("companyWebsite"),
        categorySlug: formData.get("category"), // Matches form field 'name="category"'
        applyUrl: formData.get("applyUrl"),
        receiveApplicationsByEmail: receiveByEmail,
        companyEmail: formData.get("companyEmail"),
        highlightColor: highlightColor ? String(formData.get("highlightColor")) : null,
        descriptionHtml: formData.get("descriptionHtml"),
        tags: tags.length > 0 ? tags : parseTags(tagInput),
        jobType: formData.get("jobType"),
        remoteScope: formData.get("remoteScope"),
        location: formData.get("location"),
        salaryMin: formData.get("salaryMin") ? Number(formData.get("salaryMin")) : null,
        salaryMax: formData.get("salaryMax") ? Number(formData.get("salaryMax")) : null,
      };

      if (selectedCompanyId) {
        jobData.companyId = selectedCompanyId;
      }

      // Handle logo
      if (logoFile) {
        const reader = new FileReader();
        const logoBase64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(logoFile);
        });
        jobData.companyLogo = logoBase64;
      }

      console.log("[AdminJobForm] Saving draft...");

      // 1. Create draft
      const draftRes = await fetch("/api/jobs/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobData }),
      });

      const draftResult = await draftRes.json();
      if (!draftRes.ok) throw new Error(draftResult.error || "Failed to save job draft");

      const { jobId } = draftResult;

      console.log("[AdminJobForm] Draft saved, ID:", jobId, ". Creating checkout...");

      // 2. Create checkout session
      const checkoutRes = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      const checkoutResult = await checkoutRes.json();
      if (!checkoutRes.ok) throw new Error(checkoutResult.error || "Failed to create payment session");

      const checkoutUrl = checkoutResult.url;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("No checkout URL returned from payment provider");
      }
    } catch (err: any) {
      console.error("[AdminJobForm] Submission error:", err);
      setError(err.message || "Something went wrong during submission");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-6 border border-[#3a3a3a] bg-[#1a1a1a] rounded-2xl p-6 text-sm text-white shadow-xl"
    >
      <h2 className="text-3xl font-black text-white tracking-tighter">Post a job</h2>

      <div className="space-y-4">
        {/* Company Name with Autocomplete */}
        <div className="space-y-2 relative">
          <label className="text-sm font-black uppercase tracking-widest text-gray-300">
            Company Name
          </label>
          <p className="text-xs text-gray-400 font-medium">
            Your company's brand/trade name: without Inc., Ltd., B.V., Pte., etc. If your company already exists, select it from the suggestions.
          </p>
          <div className="relative">
            <Input
              ref={companyInputRef}
              name="companyName"
              value={companyName}
              onChange={handleCompanyNameChange}
              onFocus={() => companySuggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => {
                // Delay to allow clicking on suggestions
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              required
              placeholder="Acme"
              className="border-[#3a3a3a] rounded-xl h-10 bg-[#0B0B0B] text-white focus:bg-[#1a1a1a] transition-all placeholder:text-gray-600"
            />
            <input type="hidden" name="companyId" value={selectedCompanyId || ""} />
            {showSuggestions && companySuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-xl shadow-2xl max-h-60 overflow-y-auto overflow-hidden">
                {companySuggestions.map((company) => (
                  <button
                    key={company.id}
                    type="button"
                    onClick={() => selectCompany(company)}
                    className="w-full text-left px-3 py-2 hover:bg-[#2a2a2a] border-b border-[#3a3a3a] last:border-b-0 text-sm font-medium transition-colors"
                  >
                    <div className="font-bold text-white">{company.name}</div>
                    {company.websiteUrl && (
                      <div className="text-xs text-gray-400">{company.websiteUrl}</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Job Title */}
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-widest text-gray-300">
            Job Title
          </label>
          <p className="text-xs text-gray-400 font-medium">
            Please specify as single job position like "Machine Learning Engineer"
          </p>
          <Input
            name="title"
            required
            placeholder="Machine Learning Engineer"
            className="border-[#3a3a3a] rounded-xl h-10 bg-[#0B0B0B] text-white focus:bg-[#1a1a1a] transition-all placeholder:text-gray-600"
          />
        </div>

        {/* Tags with comma-separated highlighting */}
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-widest text-gray-300">
            Tags, Keywords, or Stack
          </label>
          <p className="text-xs text-gray-400 font-medium">
            Short tags are preferred. Use tags like industry and tech stack. You can enter comma-separated values (e.g., "React, TypeScript, Node.js").
          </p>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 border border-[#3a3a3a] bg-[#2a2a2a] px-3 py-1.5 text-xs font-black uppercase tracking-wider text-gray-300 rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-500 transition-all rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-0 px-3 py-2 pointer-events-none text-sm border border-transparent flex items-center">
                {tagInput && getTagHighlights(tagInput)}
              </div>
              <Input
                value={tagInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setTagInput(value);
                  // Auto-add tags when comma is entered
                  if (value.includes(",")) {
                    const parts = value.split(",");
                    const beforeComma = parts[0]?.trim();
                    if (beforeComma && tags.length < 4) {
                      const next = Array.from(new Set([...tags, beforeComma]));
                      setTags(next);
                      // Keep everything after the first comma
                      const afterComma = parts.slice(1).join(",");
                      setTagInput(afterComma);
                    } else if (tags.length >= 4) {
                      setTagInput("");
                    }
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Type tags separated by commas (e.g., React, TypeScript, Node.js)"
                className="border-[#3a3a3a] rounded-xl h-10 bg-[#0B0B0B] text-white focus:bg-[#1a1a1a] transition-all placeholder:text-gray-600"
                style={{
                  color: tagInput ? "transparent" : "inherit",
                  caretColor: "black"
                }}
              />
            </div>
            <Button
              type="button"
              onClick={addTag}
              variant="outline"
              className="border-[#3a3a3a] bg-[#2a2a2a] text-white rounded-xl font-bold hover:bg-[#3a3a3a] transition-all text-white placeholder:text-gray-600"
            >
              Add Tags
            </Button>
          </div>
        </div>

        {/* Company Logo */}
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-widest text-gray-300">
            Company Logo
          </label>
          <p className="text-xs text-gray-400 font-medium">
            Upload a square logo of at least 48×48 pixels for best aesthetic results. Supports: JPG, PNG, WebP, SVG, AVIF, and GIF formats.
          </p>
          <div className="flex items-center gap-4">
            {logoPreview ? (
              <div className="relative">
                <div className="w-16 h-12 rounded-full overflow-hidden border-2 border-[#3a3a3a]">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLogoPreview(null);
                    setLogoFile(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#0B0B0B] flex items-center justify-center border-2 border-dashed border-[#3a3a3a]">
                <svg
                  className="w-8 h-8 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              <div className="px-4 py-2 bg-[#FF5A1F] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#E54D15] transition-all text-white placeholder:text-gray-600">
                {logoPreview ? "Change Logo" : "Upload"}
              </div>
            </label>
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-widest text-gray-300">
            Job Description
          </label>
          <textarea
            name="descriptionHtml"
            required
            rows={8}
            className="w-full border border-[#3a3a3a] bg-[#0B0B0B] px-3 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-[#1a1a1a] transition-all text-gray-300"
            placeholder="Write the full job description here..."
          />
        </div>

        {/* Apply URL */}
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-widest text-gray-300">
            Apply URL
          </label>
          <p className="text-xs text-gray-400 font-medium">
            Apply URLs with a form an applicant can fill out generally receive a lot more applicants
          </p>
          <Input
            name="applyUrl"
            type="url"
            required
            placeholder="https://company.com/jobs/123"
            className="border-[#3a3a3a] rounded-xl h-10 bg-[#0B0B0B] focus:bg-[#1a1a1a] transition-all text-white placeholder:text-gray-600"
          />
        </div>

        {/* Receive applications by email */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={receiveByEmail}
              onChange={(e) => setReceiveByEmail(e.target.checked)}
              className="h-4 w-4 border border-[#3a3a3a] rounded bg-[#0B0B0B] text-orange-500 focus:ring-orange-500"
            />
            <span className="text-sm font-black uppercase tracking-widest text-gray-300">
              I want to receive applications by email
            </span>
          </label>
        </div>

        {/* Company Email */}
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-widest text-gray-300">
            Company Email (For invoice)
          </label>
          <p className="text-xs text-gray-400 font-medium">
            Make sure this email is accessible by you! We use this to send the invoice and edit link.
          </p>
          <Input
            name="companyEmail"
            type="email"
            required
            placeholder="contact@company.com"
            className="border-[#3a3a3a] rounded-xl h-10 bg-[#0B0B0B] focus:bg-[#1a1a1a] transition-all text-white placeholder:text-gray-600"
          />
        </div>

        {/* Highlight with brand color */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={highlightColor}
              onChange={(e) => setHighlightColor(e.target.checked)}
              className="h-4 w-4 border border-[#3a3a3a] rounded bg-[#0B0B0B] text-orange-500 focus:ring-orange-500"
            />
            <span className="text-sm font-black uppercase tracking-widest text-gray-300">
              Highlight with a brand color (+$49)
            </span>
            <span className="text-xs text-gray-400 font-bold">2x more views</span>
          </label>
          {highlightColor && (
            <Input
              name="highlightColor"
              type="color"
              defaultValue="#facc15"
              className="border border-border w-20 h-10 rounded-md p-1"
            />
          )}
        </div>

        {/* Category - using jobs page categories */}
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-widest text-gray-300">
            Category
          </label>
          <select
            name="category"
            className="h-10 w-full border border-[#3a3a3a] bg-[#0B0B0B] px-4 text-sm font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-[#1a1a1a] transition-all text-gray-300"
            required
            defaultValue={categories[0]?.slug}
          >
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Job Type */}
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-widest text-gray-300">
            Job Type
          </label>
          <p className="text-xs text-muted-foreground">
            What type of employment contract is this?
          </p>
          <select
            name="jobType"
            className="h-10 w-full border border-[#3a3a3a] bg-[#0B0B0B] px-4 text-sm font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-[#1a1a1a] transition-all text-gray-300"
            required
            defaultValue="full_time"
          >
            <option value="full_time">Full-time</option>
            <option value="part_time">Part-time</option>
            <option value="freelance">Freelance</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        {/* Remote Scope / Time Zones */}
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-widest text-gray-300">
            Remote Scope / Time Zones
          </label>
          <p className="text-xs text-muted-foreground">
            Which regions or time zones can candidates work from?
          </p>
          <select
            name="remoteScope"
            className="h-10 w-full border border-[#3a3a3a] bg-[#0B0B0B] px-4 text-sm font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-[#1a1a1a] transition-all text-gray-300"
            required
            defaultValue="worldwide"
          >
            <option value="worldwide">Worldwide / Any</option>
            <option value="north_america">North America (US, Canada, Mexico)</option>
            <option value="europe">Europe</option>
            <option value="latam">Latin America</option>
            <option value="asia">Asia-Pacific</option>
          </select>
        </div>

        {/* Salary Range */}
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-widest text-gray-300">
            Salary Range (USD)
          </label>
          <p className="text-xs text-muted-foreground">
            Optional: Provide salary range to attract more candidates
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                name="salaryMin"
                type="number"
                placeholder="Min (e.g., 90000)"
                className="border-[#3a3a3a] rounded-xl h-10 bg-[#0B0B0B] focus:bg-[#1a1a1a] transition-all font-bold"
              />
            </div>
            <div>
              <Input
                name="salaryMax"
                type="number"
                placeholder="Max (e.g., 130000)"
                className="border-[#3a3a3a] rounded-xl h-10 bg-[#0B0B0B] focus:bg-[#1a1a1a] transition-all font-bold"
              />
            </div>
          </div>
        </div>

        {/* Location / Work Authorization */}
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-widest text-gray-300">
            Location / Work Authorization
          </label>
          <p className="text-xs text-muted-foreground">
            Where should candidates be legally authorized to work? (e.g., "US only", "EU", "Remote contractor worldwide")
          </p>
          <Input
            name="location"
            placeholder="e.g., US only, EU, Remote contractor worldwide"
            className="border-[#3a3a3a] rounded-xl h-10 bg-[#0B0B0B] focus:bg-[#1a1a1a] transition-all text-white placeholder:text-gray-600"
            required
          />
        </div>
      </div>

      <div className="pt-8 border-t border-[#3a3a3a] flex flex-col gap-6">
        <Button
          type="submit"
          disabled={submitting}
          className="w-full h-12 bg-[#FF5A1F] text-white text-[13px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#E54D15] transition-all shadow-xl shadow-orange-500/10 active:scale-[0.98]"
        >
          {submitting ? "Redirecting to payment…" : "Post job - $299"}
        </Button>

        {error && (
          <div className="border border-red-900/50 bg-red-950/30 p-4 rounded-xl text-center">
            <p className="text-xs font-bold text-red-400">Error: {error}</p>
          </div>
        )}
        {successSlug && (
          <div className="border border-green-900/50 bg-green-950/30 p-4 rounded-xl text-center">
            <p className="text-sm font-bold text-green-400">
              Job created successfully!{" "}
              <button
                type="button"
                className="underline hover:text-green-300"
                onClick={() => router.push(`/jobs/${successSlug}`)}
              >
                View it on the board
              </button>
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
