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

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: integer("expires_at"),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
  sessionToken: text("session_token").notNull().unique(),
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
  isPremium: boolean("is_premium").notNull().default(false),
  applyUrl: text("apply_url").notNull(),
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


