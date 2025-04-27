ALTER TABLE "menu_items" ADD COLUMN "discount" numeric(5, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN "discountStartDate" varchar(50);--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN "discountEndDate" varchar(50);--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN "isDiscounted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN "finalPrice" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN "mediumFinalPrice" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN "largeFinalPrice" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "menu_items" DROP COLUMN "hasDiscount";--> statement-breakpoint
ALTER TABLE "menu_items" DROP COLUMN "discountPercentage";--> statement-breakpoint
ALTER TABLE "menu_items" DROP COLUMN "discountedPrice";