ALTER TABLE "reservation_settings" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "reservation_settings" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "reservation_settings" ADD COLUMN "cafe_capacity" integer DEFAULT 30 NOT NULL;--> statement-breakpoint
ALTER TABLE "reservation_settings" ADD COLUMN "almoco_capacity" integer DEFAULT 30 NOT NULL;--> statement-breakpoint
ALTER TABLE "reservation_settings" ADD COLUMN "jantar_capacity" integer DEFAULT 30 NOT NULL;--> statement-breakpoint
ALTER TABLE "reservation_settings" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "reservation_settings" DROP COLUMN "maxBreakfast";--> statement-breakpoint
ALTER TABLE "reservation_settings" DROP COLUMN "maxLunch";--> statement-breakpoint
ALTER TABLE "reservation_settings" DROP COLUMN "maxDinner";--> statement-breakpoint
ALTER TABLE "reservation_settings" DROP COLUMN "updatedAt";