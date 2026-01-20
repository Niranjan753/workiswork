"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Bell, Shield, Mail, ArrowRight, Plus, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
    "Software Development", "Customer Service", "Design", "Marketing",
    "Sales / Business", "Product", "Project Management", "AI / ML",
    "Data Analysis", "Devops / Sysadmin", "Finance", "Human Resources",
    "QA", "Writing", "Legal", "Medical", "Education"
];

export default function DashboardAlertsPage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/sign-in?callbackUrl=/dashboard/alerts");
        }
    }, [session, isPending, router]);

    if (isPending) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Job Alerts</h1>
                    <p className="text-gray-500 text-lg font-medium">
                        Manage your email notifications and never miss a new opportunity.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Create New Alert
                </button>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {isCreating && (
                        <div className="bg-white border-2 border-blue-100 shadow-xl shadow-blue-500/5 rounded-[2.5rem] p-8 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900">New Alert</h3>
                                <button onClick={() => setIsCreating(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Select Category</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {CATEGORIES.slice(0, 10).map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={cn(
                                                "px-4 py-3 text-left text-sm font-bold rounded-xl border transition-all",
                                                selectedCategory === cat
                                                    ? "bg-blue-50 border-blue-200 text-blue-600"
                                                    : "bg-white border-gray-100 text-gray-600 hover:border-gray-200"
                                            )}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl disabled:opacity-30"
                                disabled={!selectedCategory}
                                onClick={() => setIsCreating(false)}
                            >
                                Save Alert
                            </button>
                        </div>
                    )}

                    <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] p-10 space-y-10">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-gray-900 leading-tight">Active Alerts</h2>
                                <p className="text-[15px] font-medium text-gray-400">
                                    You'll receive an email when jobs matching these criteria are posted.
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                                <Bell className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>

                        {/* Empty State / placeholder */}
                        <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl space-y-6">
                            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                                <Mail className="w-8 h-8 text-gray-300" />
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-lg font-bold text-gray-900">No active alerts</p>
                                <p className="text-sm font-medium text-gray-400">
                                    Start a search on the jobs board to create your first alert.
                                </p>
                            </div>
                            <button
                                onClick={() => router.push("/dashboard/jobs")}
                                className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl active:scale-95 flex items-center gap-2"
                            >
                                Browse Jobs <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] p-10">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-gray-900">Email Frequency</h3>
                                <p className="text-[15px] font-medium text-gray-400">How often should we ping you?</p>
                            </div>
                            <div className="flex bg-gray-50 p-1 rounded-xl w-full sm:w-auto">
                                {['Daily', 'Weekly'].map((freq) => (
                                    <button
                                        key={freq}
                                        className={cn(
                                            "flex-1 sm:flex-none px-8 py-2.5 text-sm font-bold rounded-lg transition-all",
                                            freq === 'Daily' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400"
                                        )}
                                    >
                                        {freq}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Tips */}
                <div className="space-y-6">
                    <div className="bg-gray-900 rounded-[2rem] p-8 text-white space-y-6 shadow-2xl shadow-blue-500/10">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xl font-bold">Privacy First</h4>
                            <p className="text-sm text-gray-400 font-medium leading-relaxed">
                                We'll never share your email with third parties. You can unsubscribe at any time with one click.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-[2rem] p-8 space-y-4">
                        <h4 className="font-bold text-gray-900">Need help?</h4>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed">
                            Our team can help you set up advanced boolean searches for highly specific roles.
                        </p>
                        <button className="text-blue-600 text-sm font-bold hover:underline">Contact Support →</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
