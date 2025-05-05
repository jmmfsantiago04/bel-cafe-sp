CREATE TABLE "reservation_settings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "reservation_settings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"maxBreakfast" integer DEFAULT 30 NOT NULL,
	"maxLunch" integer DEFAULT 50 NOT NULL,
	"maxDinner" integer DEFAULT 40 NOT NULL,
	"updatedAt" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reservations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "reservations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"date" varchar(50) NOT NULL,
	"time" varchar(50) NOT NULL,
	"guests" integer NOT NULL,
	"mealPeriod" varchar(20) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"createdAt" varchar(50) NOT NULL,
	"updatedAt" varchar(50) NOT NULL
);
