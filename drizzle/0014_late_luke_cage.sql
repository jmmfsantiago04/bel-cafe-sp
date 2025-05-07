DROP TABLE "categories" CASCADE;--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN "isAlmoco" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN "isJantar" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN "isSobremesa" boolean DEFAULT false NOT NULL;