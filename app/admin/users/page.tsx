import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { db } from "../../../db";
import { users } from "../../../db/schema";
import { getServerSession } from "../../../lib/auth-server";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { getSiteUrl, getOgImageUrl } from "../../../lib/site-url";
import { Mail, User, Calendar, Shield } from "lucide-react";

const siteUrl = getSiteUrl();
const ogImage = getOgImageUrl();

export const metadata: Metadata = {
  title: "Users Management – WorkIsWork Admin",
  description: "View and manage all users and their emails.",
};

export default async function AdminUsersPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin/users&role=employer");
  }

  // Check if user is an employer
  const userRow = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)
    .then((rows) => rows[0]);

  if (!userRow || userRow.role !== "employer") {
    return (
      <div className="flex min-h-screen flex-col bg-white text-black">
        <header className="border-b-2 border-black bg-yellow-400">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <Link href="/admin" className="text-sm font-bold text-black hover:underline">
              ← Back to admin
            </Link>
          </div>
        </header>
        <main className="flex-1 mx-auto max-w-5xl px-4 py-16 sm:px-6 bg-white">
          <div className="rounded-2xl border-2 border-black bg-white p-8 text-center shadow-lg">
            <h1 className="text-xl font-bold text-black">
              Employer access required
            </h1>
            <p className="mt-2 text-sm text-black/80 font-medium">
              You need to be logged in as an employer to access this page.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Fetch all users
  const allUsers = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      emailVerified: users.emailVerified,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .orderBy(users.createdAt);

  const userCount = allUsers.length;
  const employerCount = allUsers.filter((u) => u.role === "employer").length;
  const userRoleCount = allUsers.filter((u) => u.role === "user").length;

  return (
    <div className="flex min-h-screen flex-col bg-yellow-400 text-black">
      <header className="border-b-2 border-black bg-yellow-500">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-sm font-bold text-black hover:underline">
              ← Back to admin
            </Link>
            <span className="text-xs text-black/80 font-medium">|</span>
            <h1 className="text-lg font-bold text-black">Users Management</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border-2 border-black bg-white p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-5 w-5 text-black" />
              <span className="text-sm font-bold text-black">Total Users</span>
            </div>
            <div className="text-2xl font-bold text-black">{userCount}</div>
          </div>
          <div className="rounded-xl border-2 border-black bg-white p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-black" />
              <span className="text-sm font-bold text-black">Employers</span>
            </div>
            <div className="text-2xl font-bold text-black">{employerCount}</div>
          </div>
          <div className="rounded-xl border-2 border-black bg-white p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-5 w-5 text-black" />
              <span className="text-sm font-bold text-black">Job Seekers</span>
            </div>
            <div className="text-2xl font-bold text-black">{userRoleCount}</div>
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-xl border-2 border-black bg-white shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black text-yellow-400">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-bold">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-bold">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-bold">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-bold">Verified</th>
                  <th className="px-4 py-3 text-left text-sm font-bold">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {allUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-black/80 font-medium">
                      No users found
                    </td>
                  </tr>
                ) : (
                  allUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-yellow-300 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-black" />
                          <span className="text-sm font-bold text-black">{user.email || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-black">{user.name || "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-bold ${
                            user.role === "employer"
                              ? "bg-black text-yellow-400"
                              : "bg-yellow-400 text-black border-2 border-black"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-bold ${
                            user.emailVerified
                              ? "bg-black text-yellow-400"
                              : "bg-yellow-400 text-black border-2 border-black"
                          }`}
                        >
                          {user.emailVerified ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-black" />
                          <span className="text-sm font-medium text-black">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 rounded-xl border-2 border-black bg-white p-4 shadow-lg">
          <p className="text-sm font-medium text-black">
            <strong>Note:</strong> All user emails are stored in the database. If you don't see emails here, 
            they may not have been saved during signup. Check the Better Auth configuration to ensure emails 
            are being properly saved to the users table.
          </p>
        </div>
      </main>

    </div>
  );
}

