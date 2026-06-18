CREATE TABLE "Brand" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"products" text NOT NULL,
	"createdat" timestamp DEFAULT now() NOT NULL
);
