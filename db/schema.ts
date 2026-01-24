import {
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
  numeric,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const campaignStatusEnum = pgEnum("campaign_status", [
  "pending",
  "approved",
  "rejected",
  "active",
  "ended",
]);

export const clipStatusEnum = pgEnum("clip_status", [
  "pending",
  "approved",
  "rejected",
]);

export const clipPlatformEnum = pgEnum("clip_platform", [
  "instagram",
  "tiktok",
  "youtube",
]);

export const clippingCampaigns = pgTable("clipping_campaigns", {
  id: serial("id").primaryKey(),
  brandName: text("brand_name").notNull(),
  logoUrl: text("logo_url"),
  description: text("description").notNull(),
  goals: text("goals").notNull(), // Stored as text (maybe JSON later, but text is fine for simple descriptions)
  payPerViewRate: numeric("pay_per_view_rate").notNull(),
  status: campaignStatusEnum("status").notNull().default("pending"),
  creatorEmail: text("creator_email").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const clips = pgTable("clips", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id")
    .notNull()
    .references(() => clippingCampaigns.id, { onDelete: "cascade" }),
  clipperEmail: text("clipper_email").notNull(),
  platform: clipPlatformEnum("platform").notNull(),
  link: text("link").notNull(),
  views: integer("views").notNull().default(0),
  status: clipStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const jobTypeEnum = pgEnum("job_type", [
  "full_time",
  "part_time",
  "freelance",
  "contract",
  "internship",
]);

export const remoteScopeEnum = pgEnum("remote_scope", [
  "worldwide",
  "europe",
  "north_america",
  "latam",
  "asia",
]);

export const subscriptionPlanEnum = pgEnum("subscription_plan", [
  "free",
  "premium",
]);

export const roleEnum = pgEnum("user_role", ["user", "employer"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  emailVerified: boolean("email_verified").notNull().default(false),
  role: roleEnum("role").notNull().default("user"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Better Auth compatible tables
export const accounts = pgTable("account", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const verifications = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logoUrl: text("logo_url"),
  websiteUrl: text("website_url"),
  twitterUrl: text("twitter_url"),
  linkedinUrl: text("linkedin_url"),
  location: text("location"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const companyUsers = pgTable("company_users", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  companyId: integer("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("owner"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  companyId: integer("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  location: text("location").notNull(),
  salaryMin: numeric("salary_min"),
  salaryMax: numeric("salary_max"),
  salaryCurrency: text("salary_currency").default("USD"),
  jobType: jobTypeEnum("job_type").notNull().default("full_time"),
  remoteScope: remoteScopeEnum("remote_scope").notNull().default("worldwide"),
  isFeatured: boolean("is_featured").notNull().default(false),
  isPublished: boolean("is_published").notNull().default(false),
  paymentStatus: text("payment_status").notNull().default("pending"), // pending | paid | failed
  polarCheckoutId: text("polar_checkout_id").unique(),
  applyUrl: text("apply_url").notNull(),
  receiveApplicationsByEmail: boolean("receive_applications_by_email").notNull().default(false),
  companyEmail: text("company_email"), // For invoice and email applications
  highlightColor: text("highlight_color"), // Brand color for highlighting
  source: text("source").notNull().default("internal"),
  sourceUrl: text("source_url"),
  descriptionHtml: text("description_html").notNull(),
  tags: text("tags").array(),
  postedAt: timestamp("posted_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const savedJobs = pgTable("saved_jobs", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  jobId: integer("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  keyword: text("keyword"),
  categoryId: integer("category_id").references(() => categories.id),
  jobType: jobTypeEnum("job_type"),
  remoteScope: remoteScopeEnum("remote_scope"),
  minSalary: numeric("min_salary"),
  frequency: text("frequency").notNull().default("daily"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  stripeCustomerId: text("stripe_customer_id").notNull(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull(),
  plan: subscriptionPlanEnum("plan").notNull().default("free"),
  status: text("status").notNull().default("active"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});


export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  // JSON string containing join onboarding answers, keyed by question id.
  data: text("data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userName: text("user_name").notNull(),
  userEmail: text("user_email").notNull(),
  title: text("title").notNull(),
  role: text("role").notNull(),
  projectUrl: text("project_url"),
  thumbnailUrl: text("thumbnail_url"),
  location: text("location"),
  rate: text("rate"),
  description: text("description").notNull(),
  tags: text("tags").array(),
  isAvailable: boolean("is_available").notNull().default(true),
  recommendations: integer("recommendations").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});





