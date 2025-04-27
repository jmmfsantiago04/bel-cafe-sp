ALTER TABLE "menu_items" ADD COLUMN "hasDiscount" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN "discountPercentage" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN "discountedPrice" numeric(10, 2);