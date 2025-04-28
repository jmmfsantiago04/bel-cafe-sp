ALTER TABLE "menu_items" ADD COLUMN "isGlutenFree" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN "isVegetarian" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN "isVegan" boolean DEFAULT false NOT NULL;