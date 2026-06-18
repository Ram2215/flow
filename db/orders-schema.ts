import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, decimal, index } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const order = pgTable("orders", {
  id: text("id").primaryKey(),
  customerId: text("customer_id").references(() => user.id, { onDelete: "set null" }),
  country: text("country"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("placed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("orders_customer_id_idx").on(table.customerId),
  index("orders_status_idx").on(table.status),
  index("orders_created_at_idx").on(table.createdAt),
]);

export const orderRelations = relations(order, ({ one }) => ({
  customer: one(user, {
    fields: [order.customerId],
    references: [user.id],
  }),
}));
