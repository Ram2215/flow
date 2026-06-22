import {pgTable,serial,text} from "drizzle-orm/pg-core"


export const category=pgTable("Category",{
    id:serial("id").primaryKey().notNull(),
    name:text("name").notNull()
})
