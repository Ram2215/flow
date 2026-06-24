CREATE TABLE "Order" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" varchar(10) NOT NULL,
	"order_date" date DEFAULT current_date NOT NULL,
	"customer" varchar(10) NOT NULL,
	"country" varchar(15) NOT NULL,
	"total" integer NOT NULL,
	CONSTRAINT "Order_order_id_unique" UNIQUE("order_id")
);
