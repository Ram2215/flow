CREATE TABLE "OrderItems" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" varchar(10) NOT NULL,
	"product_name" text NOT NULL,
	"brand" text NOT NULL,
	"category" text NOT NULL,
	"price" numeric NOT NULL,
	"qty" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Order" ADD COLUMN "email" varchar(60) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_order_id_Order_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."Order"("order_id") ON DELETE cascade ON UPDATE no action;