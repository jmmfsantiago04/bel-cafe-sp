CREATE TABLE "capacity" (
	"date" text PRIMARY KEY NOT NULL,
	"cafe" integer DEFAULT 30 NOT NULL,
	"almoco" integer DEFAULT 30 NOT NULL,
	"jantar" integer DEFAULT 30 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "reservation_settings" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "reservation_settings" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "reservation_settings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "reservation_settings" ADD COLUMN "maxBreakfast" integer DEFAULT 30 NOT NULL;--> statement-breakpoint
ALTER TABLE "reservation_settings" ADD COLUMN "maxLunch" integer DEFAULT 50 NOT NULL;--> statement-breakpoint
ALTER TABLE "reservation_settings" ADD COLUMN "maxDinner" integer DEFAULT 40 NOT NULL;--> statement-breakpoint
ALTER TABLE "reservation_settings" ADD COLUMN "updatedAt" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "reservation_settings" DROP COLUMN "cafe_capacity";--> statement-breakpoint
ALTER TABLE "reservation_settings" DROP COLUMN "almoco_capacity";--> statement-breakpoint
ALTER TABLE "reservation_settings" DROP COLUMN "jantar_capacity";--> statement-breakpoint
ALTER TABLE "reservation_settings" DROP COLUMN "updated_at";