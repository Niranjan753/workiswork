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
      className="space-y-8 bg-white border-2 border-black p-8 sm:p-12 md:p-16 rounded-none text-black shadow-[12px_12px_0px_black]"
    >
      <div className="border-b-2 border-black pb-8 mb-8">
        <h2 className="text-4xl font-black text-black tracking-tighter uppercase italic leading-none">Job Specifications</h2>
        <p className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Authenticate your recruitment credentials</p>
      </div>

      <div className="space-y-4">
        {/* Company Name with Autocomplete */}
        <div className="space-y-3 relative">
          <label className="text-[11px] font-black uppercase tracking-[0.3em] text-black flex items-center justify-between">
            Company Name
            <span className="w-2 h-2 bg-orange-500 shadow-[1.5px_1.5px_0px_black]" />
          </label>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
            Brand name without legal suffixes (Inc., Ltd.).
          </p>
          <div className="relative">
            <Input
              ref={companyInputRef}
              name="companyName"
              value={companyName}
              onChange={handleCompanyNameChange}
              onFocus={() => companySuggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              required
              placeholder="ACME CORP"
              className="border-2 border-black rounded-none h-12 bg-white text-black font-black uppercase focus:ring-0 focus:border-orange-500 transition-all placeholder:text-gray-200"
            />
            <input type="hidden" name="companyId" value={selectedCompanyId || ""} />
            {showSuggestions && companySuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border-2 border-black rounded-none shadow-[4px_4px_0px_black] max-h-60 overflow-y-auto">
                {companySuggestions.map((company) => (
                  <button
                    key={company.id}
                    type="button"
                    onClick={() => selectCompany(company)}
                    className="w-full text-left px-4 py-3 hover:bg-orange-50 border-b-2 border-black last:border-b-0 transition-colors"
                  >
                    <div className="font-black text-black uppercase text-[11px]">{company.name}</div>
                    {company.websiteUrl && (
                      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{company.websiteUrl}</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Job Title */}
        <div className="space-y-3">
          <label className="text-[11px] font-black uppercase tracking-[0.3em] text-black">
            Job Title
          </label>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
            Single position e.g., "Full Stack Engineer"
          </p>
          <Input
            name="title"
            required
            placeholder="LEAD ML ENGINEER"
            className="border-2 border-black rounded-none h-12 bg-white text-black font-black uppercase focus:ring-0 focus:border-orange-500 transition-all placeholder:text-gray-200"
          />
        </div>

        {/* Tags with comma-separated highlighting */}
        <div className="space-y-3">
          <label className="text-[11px] font-black uppercase tracking-[0.3em] text-black">
            Tech Stack / Tags
          </label>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
            Max 4 tags. Comma separated (e.g., React, Node).
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 border-2 border-black bg-black px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white rounded-none"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-orange-500 transition-all"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Input
                value={tagInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setTagInput(value);
                  if (value.includes(",")) {
                    const parts = value.split(",");
                    const beforeComma = parts[0]?.trim();
                    if (beforeComma && tags.length < 4) {
                      setTags(Array.from(new Set([...tags, beforeComma])));
                      setTagInput(parts.slice(1).join(","));
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
                placeholder="ADD TAGS..."
                className="border-2 border-black rounded-none h-12 bg-white text-black font-black uppercase focus:ring-0 focus:border-orange-500 transition-all placeholder:text-gray-200"
              />
            </div>
            <Button
              type="button"
              onClick={addTag}
              className="h-12 border-2 border-black bg-black text-white rounded-none font-black uppercase tracking-widest hover:bg-orange-500 transition-all px-8"
            >
              Add
            </Button>
          </div>
        </div>

        {/* Company Logo */}
        <div className="space-y-3">
          <label className="text-[11px] font-black uppercase tracking-[0.3em] text-black">
            Company Logo
          </label>
          <div className="flex items-center gap-6 p-4 border-2 border-black bg-gray-50">
            {logoPreview ? (
              <div className="relative">
                <div className="w-16 h-16 rounded-none overflow-hidden border-2 border-black bg-white">
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
                  className="absolute -top-2 -right-2 bg-black text-white p-1 hover:bg-orange-500 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-none bg-white flex items-center justify-center border-2 border-black">
                <svg className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div className="space-y-2">
              <label className="cursor-pointer inline-block">
                <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                <div className="px-6 py-2.5 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 transition-all">
                  {logoPreview ? "Replace Logo" : "Upload Logo"}
                </div>
              </label>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Square logo • JPG/PNG • Max 5MB</p>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-3">
          <label className="text-[11px] font-black uppercase tracking-[0.3em] text-black">
            Job Description
          </label>
          <textarea
            name="descriptionHtml"
            required
            rows={8}
            className="w-full border-2 border-black bg-white px-4 py-3 text-[13px] font-medium rounded-none focus:outline-none focus:border-orange-500 transition-all text-black placeholder:text-gray-300"
            placeholder="Technical requirements, responsibilities, and benefits..."
          />
        </div>

        {/* Apply URL */}
        <div className="space-y-3">
          <label className="text-[11px] font-black uppercase tracking-[0.3em] text-black">
            Apply URL
          </label>
          <Input
            name="applyUrl"
            type="url"
            required
            placeholder="HTTPS://JOBS.COMPANY.COM/ROLE"
            className="border-2 border-black rounded-none h-12 bg-white text-black font-black uppercase focus:ring-0 focus:border-orange-500 transition-all placeholder:text-gray-200"
          />
        </div>

        {/* Email Applications Toggle */}
        <div className="py-2">
          <label className="flex items-center gap-4 cursor-pointer group">
            <div className="relative flex items-center shrink-0">
              <input
                type="checkbox"
                checked={receiveByEmail}
                onChange={(e) => setReceiveByEmail(e.target.checked)}
                className="peer appearance-none h-5 w-5 border-2 border-black rounded-none checked:bg-black transition-all cursor-pointer"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 peer-checked:opacity-100 text-white font-black text-[10px]">✓</div>
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-black group-hover:text-orange-500 transition-colors">
              Direct application delivery via email
            </span>
          </label>
        </div>

        {/* Company Email */}
        <div className="space-y-3">
          <label className="text-[11px] font-black uppercase tracking-[0.3em] text-black">
            Administrative Email
          </label>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
            For invoices and edit links.
          </p>
          <Input
            name="companyEmail"
            type="email"
            required
            placeholder="CONTACT@COMPANY.COM"
            className="border-2 border-black rounded-none h-12 bg-white text-black font-black uppercase focus:ring-0 focus:border-orange-500 transition-all placeholder:text-gray-200"
          />
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-y-2 border-black bg-gray-50 -mx-8 sm:-mx-12 md:-mx-16 px-8 sm:px-12 md:px-16">
          {/* Category */}
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-black">Category</label>
            <select
              name="category"
              className="h-12 w-full border-2 border-black bg-white px-4 text-[11px] font-black uppercase tracking-widest rounded-none focus:border-orange-500 outline-none hover:bg-orange-50 transition-all"
              required
              defaultValue={categories[0]?.slug}
            >
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Job Type */}
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-black">Job Type</label>
            <select
              name="jobType"
              className="h-12 w-full border-2 border-black bg-white px-4 text-[11px] font-black uppercase tracking-widest rounded-none focus:border-orange-500 outline-none hover:bg-orange-50 transition-all"
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

          {/* Remote Scope */}
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-black">Remote Scope</label>
            <select
              name="remoteScope"
              className="h-12 w-full border-2 border-black bg-white px-4 text-[11px] font-black uppercase tracking-widest rounded-none focus:border-orange-500 outline-none hover:bg-orange-50 transition-all"
              required
              defaultValue="worldwide"
            >
              <option value="worldwide">Worldwide / Any</option>
              <option value="north_america">North America</option>
              <option value="europe">Europe</option>
              <option value="latam">Latin America</option>
              <option value="asia">Asia-Pacific</option>
            </select>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-black">Work Auth</label>
            <Input
              name="location"
              placeholder="E.G. US ONLY, EU ONLY"
              className="border-2 border-black rounded-none h-12 bg-white text-black font-black uppercase focus:ring-0 focus:border-orange-500 transition-all placeholder:text-gray-200"
              required
            />
          </div>

          {/* Salary */}
          <div className="sm:col-span-2 space-y-3">
            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-black">Salary Range (USD)</label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="salaryMin"
                type="number"
                placeholder="MIN (E.G. 90000)"
                className="border-2 border-black rounded-none h-12 bg-white text-black font-black uppercase focus:ring-0 focus:border-orange-500 transition-all placeholder:text-gray-200"
              />
              <Input
                name="salaryMax"
                type="number"
                placeholder="MAX (E.G. 140000)"
                className="border-2 border-black rounded-none h-12 bg-white text-black font-black uppercase focus:ring-0 focus:border-orange-500 transition-all placeholder:text-gray-200"
              />
            </div>
          </div>
        </div>

        {/* Highlight Upgrade */}
        <div className="py-6">
          <label className="flex items-center gap-4 cursor-pointer group bg-orange-50 p-6 border-2 border-orange-200 hover:border-orange-500 transition-all mb-4">
            <div className="relative flex items-center shrink-0">
              <input
                type="checkbox"
                checked={highlightColor}
                onChange={(e) => setHighlightColor(e.target.checked)}
                className="peer appearance-none h-6 w-6 border-2 border-black rounded-none checked:bg-black transition-all cursor-pointer"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 peer-checked:opacity-100 text-white font-black text-xs">✓</div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-black uppercase tracking-widest text-black">Premium Highlight Upgrade</span>
                <span className="text-[9px] font-black bg-orange-500 text-white px-2 py-0.5 uppercase tracking-widest animate-pulse leading-none">High Velocity</span>
              </div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight mt-1">Select a custom signature color for your listing (+$49)</p>
            </div>
          </label>

          {highlightColor && (
            <div className="flex items-center gap-4 p-4 border-2 border-black bg-white animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-black mb-2">Signature Brand Color</p>
                <div className="flex items-center gap-3">
                  <Input
                    name="highlightColor"
                    type="color"
                    defaultValue="#f97316"
                    className="w-12 h-12 border-2 border-black rounded-none p-1 cursor-pointer bg-white"
                  />
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                    This color will be used for your job's <br />
                    premium border and highlights.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-8 border-t-2 border-black flex flex-col gap-6">
        <Button
          type="submit"
          disabled={submitting}
          className="group relative w-full h-16 bg-black text-white text-sm font-black uppercase tracking-[0.3em] rounded-none hover:bg-orange-500 transition-all shadow-[8px_8px_0px_rgba(0,0,0,0.1)] active:scale-[0.98] overflow-hidden"
        >
          <span className="relative z-10">{submitting ? "Processing Transaction..." : "Initialize Posting - $59"}</span>
          <div className="absolute inset-0 bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </Button>

        {error && (
          <div className="border-2 border-black bg-red-50 p-6 rounded-none text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">Authentication Error: {error}</p>
          </div>
        )}
      </div>
    </form>
  );
}
