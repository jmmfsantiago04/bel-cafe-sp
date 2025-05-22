ALTER TABLE "menu_categories" ADD COLUMN "startTime" varchar(5);--> statement-breakpoint
ALTER TABLE "menu_categories" ADD COLUMN "endTime" varchar(5);--> statement-breakpoint
ALTER TABLE "menu_categories" ADD COLUMN "useTimeRestriction" boolean DEFAULT false NOT NULL;