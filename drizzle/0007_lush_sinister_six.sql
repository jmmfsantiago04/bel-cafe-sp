ALTER TABLE "menu_items" DROP CONSTRAINT "menu_items_categoryId_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN "isSalgado" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN "isDoce" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN "isCafeDaManha" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "menu_items" DROP COLUMN "categoryId";