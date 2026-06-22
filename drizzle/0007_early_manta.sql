CREATE TABLE "Product" (
	"id" serial PRIMARY KEY NOT NULL,
	"brand" text NOT NULL,
	"category" text NOT NULL,
	"price" numeric NOT NULL,
	"stock" integer NOT NULL
);
