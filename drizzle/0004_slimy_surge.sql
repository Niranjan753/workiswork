ALTER TABLE "jobs" ADD COLUMN "receive_applications_by_email" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "company_email" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "highlight_color" text;