import { pgClient } from "../index";

async function seed() {
  await pgClient().query(`
        DROP TABLE IF EXISTS "samsung_prices";
        CREATE TABLE "samsung_prices"(
            time            TIMESTAMP WITH TIME ZONE NOT NULL,
            price   DOUBLE PRECISION,
            volume      DOUBLE PRECISION,
            currency_code   VARCHAR (10)
        );
        
        SELECT create_hypertable('samsung_prices', 'time', 'price', 2);
    `);

  await pgClient().query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS klines_1m AS
        SELECT
            time_bucket('1 minute', time) AS bucket,
            first(price, time) AS open,
            max(price) AS high,
            min(price) AS low,
            last(price, time) AS close,
            sum(volume) AS volume,
            currency_code
        FROM samsung_prices
        GROUP BY bucket, currency_code;
    `);

  await pgClient().query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS klines_1h AS
        SELECT
            time_bucket('1 hour', time) AS bucket,
            first(price, time) AS open,
            max(price) AS high,
            min(price) AS low,
            last(price, time) AS close,
            sum(volume) AS volume,
            currency_code
        FROM samsung_prices
        GROUP BY bucket, currency_code;
    `);

  await pgClient().query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS klines_1w AS
        SELECT
            time_bucket('1 week', time) AS bucket,
            first(price, time) AS open,
            max(price) AS high,
            min(price) AS low,
            last(price, time) AS close,
            sum(volume) AS volume,
            currency_code
        FROM samsung_prices
        GROUP BY bucket, currency_code;
    `);

  await pgClient().end();
  console.log("Database initialized successfully");
}

seed().catch((err) => {
  console.log(`Error seeding database: ${err}`);
});
