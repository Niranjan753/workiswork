"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SubmissionForm({ campaignId }: { campaignId: number }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            campaignId,
            clipperEmail: formData.get("clipperEmail"),
            platform: formData.get("platform"),
            link: formData.get("link"),
        };

        try {
            const res = await fetch("/api/clip/submissions", {
                method: "POST",
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed");

            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                router.push("/clip/dashboard");
            }, 2000);
        } catch (error) {
            alert("Error submitting. Try again.");
        } finally {
            setIsLoading(false);
        }
    }

    if (isSuccess) {
        return (
            <div className="bg-green-50 p-6 text-center border-2 border-green-500 border-dashed">
                <p className="text-xs font-black uppercase tracking-widest text-green-700 mb-2">Clip Submitted!</p>
                <p className="text-[10px] font-bold text-green-600">Redirecting to dashboard...</p>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
                <label className="text-[9px] text-black font-black uppercase tracking-[0.2em] text-gray-500">Your Email</label>
                <input required name="clipperEmail" type="email" placeholder="you@example.com" className="w-full text-black bg-gray-50 border-2 border-gray-200 p-3 text-xs font-bold focus:border-black focus:outline-none transition-colors rounded-none" />
            </div>

            <div className="space-y-1.5">
                <label className="text-[9px] text-black font-black uppercase tracking-[0.2em] text-gray-500">Platform</label>
                <div className="relative">
                    <select required name="platform" className="w-full bg-gray-50 border-2 border-gray-200 p-3 text-xs font-bold focus:border-black focus:outline-none transition-colors text-black appearance-none rounded-none cursor-pointer">
                        <option value="tiktok">TikTok</option>
                        <option value="instagram">Instagram</option>
                        <option value="youtube">YouTube</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[8px]">▼</div>
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-[9px] text-black font-black uppercase tracking-[0.2em] text-gray-500">Clip URL</label>
                <input required name="link" type="url" placeholder="https://tiktok.com/@user/video/..." className="w-full bg-gray-50 border-2 border-gray-200 p-3 text-xs font-bold text-black focus:border-black focus:outline-none transition-colors rounded-none" />
            </div>

            <button
                disabled={isLoading}
                type="submit"
                className="w-full bg-black text-white py-3 px-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-500 transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
                {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                {isLoading ? "Submitting..." : "Submit Tracking Link"}
            </button>
        </form>
    );
}
