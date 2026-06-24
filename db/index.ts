import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { user, session, account, verification, userRelations, sessionRelations, accountRelations } from "./auth-schema";
import {orders} from "./orders-schema"
import { customer } from "./customer_schema";
import { brand } from "./brand-schema";
import { product } from "./product-schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema: { user, session, account, verification, userRelations, sessionRelations, accountRelations,orders, customer,brand,product,}
});