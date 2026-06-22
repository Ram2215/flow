import {pgTable,serial,text,decimal,integer} from "drizzle-orm/pg-core";

export const product=pgTable("Product",{
    id:serial("id").primaryKey().notNull(),
    name:text("name").notNull(),
    brand:text("brand").notNull(),
    category:text("category").notNull(),
    price:decimal("price").notNull(),
    stock:integer("stock").notNull(),
})