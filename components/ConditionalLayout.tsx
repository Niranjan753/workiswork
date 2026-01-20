"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { authClient } from "@/lib/auth-client";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = authClient.useSession();
    const pathname = usePathname();

    // Sidebar should stay on all pages when logged in
    // OR if we are specifically on a dashboard route
    const isDashboardRoute = pathname.startsWith("/dashboard");
    const useSidebarLayout = session && isDashboardRoute;

    if (useSidebarLayout) {
        return <AdminPanelLayout>{children}</AdminPanelLayout>;
    }

    return (
        <>
            <Navbar />
            <div>{children}</div>
            <Footer />
        </>
    );
}
