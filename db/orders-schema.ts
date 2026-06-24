import {varchar,pgTable,integer,date,serial} from "drizzle-orm/pg-core"
import {sql} from "drizzle-orm"

export const orders = pgTable("Order",{
    id:serial("id").primaryKey().notNull(),
    order_id:varchar("order_id",{
        length:10
    }).notNull().unique(),
    date:date("order_date").default(sql `current_date`).notNull(),
    customer:varchar("customer",{
        length:10
    }).notNull(),
    country:varchar("country",{
        length:15
    }).notNull(),
    total:integer("total").notNull()

})