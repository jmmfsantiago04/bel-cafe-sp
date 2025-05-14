CREATE TABLE "store_status" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "store_status_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"isOpen" boolean DEFAULT true NOT NULL,
	"reason" varchar(255),
	"reopenDate" varchar(50),
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
