import { Client } from "pg";
import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(__dirname, "../../../packages/psql/.env");
dotenv.config({ path: envPath });

let client: Client | null = null;

export const pgClient = () => {
  if (!client) {
    client = new Client({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: parseInt(process.env.PGPORT || "5432"),
    });

    client.connect().catch((err) => {
      console.log(`Error connecting to Postgres: ${err}`);
    });
  }

  return client;
};
