CREATE TABLE "drinks" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "drinks_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(100) NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"imageUrl" text,
	"isHotDrink" boolean DEFAULT true NOT NULL,
	"isAvailable" boolean DEFAULT true NOT NULL,
	"isPopular" boolean DEFAULT false NOT NULL,
	"isGlutenFree" boolean DEFAULT false NOT NULL,
	"isVegetarian" boolean DEFAULT false NOT NULL,
	"isVegan" boolean DEFAULT false NOT NULL,
	"hasSize" boolean DEFAULT true NOT NULL,
	"mediumSizePrice" numeric(10, 2),
	"largeSizePrice" numeric(10, 2),
	"discount" numeric(5, 2) DEFAULT '0' NOT NULL,
	"discountStartDate" varchar(50),
	"discountEndDate" varchar(50),
	"isDiscounted" boolean DEFAULT false NOT NULL,
	"finalPrice" numeric(10, 2),
	"mediumFinalPrice" numeric(10, 2),
	"largeFinalPrice" numeric(10, 2)
);
