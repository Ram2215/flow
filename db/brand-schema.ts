import { pgTable,serial,text,timestamp } from "drizzle-orm/pg-core";

export const brand=pgTable("Brand",{
    id:serial("id").primaryKey().notNull(),
    name:text("name").notNull(),

});