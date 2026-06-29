import {varchar,pgTable,integer,date,serial,text,decimal} from "drizzle-orm/pg-core"
import {sql} from "drizzle-orm"

export const orders = pgTable("Order",{
    id:serial("id").primaryKey().notNull(),
    order_id:varchar("order_id",{
        length:10
    }).notNull().unique(),
    date:date("order_date").default(sql `current_date`).notNull(),
    customer:varchar("customer",{
        length:40
    }).notNull(),
    email:varchar("email",{
        length:60
    }).notNull().default(""),
    country:varchar("country",{
        length:15
    }).notNull(),
    total:integer("total").notNull()
})

export const orderItems = pgTable("OrderItems",{
    id:serial("id").primaryKey().notNull(),
    order_id:varchar("order_id",{length:10}).notNull().references(() => orders.order_id, { onDelete: "cascade" }),
    product_name:text("product_name").notNull(),
    brand:text("brand").notNull(),
    category:text("category").notNull(),
    price:decimal("price").notNull(),
    qty:integer("qty").notNull(),
})
