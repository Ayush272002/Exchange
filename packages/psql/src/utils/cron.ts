import { pgClient } from "..";

async function cron() {
  await pgClient().query("REFRESH MATERIALIZED VIEW klines_1m");
  await pgClient().query("REFRESH MATERIALIZED VIEW klines_1h");
  await pgClient().query("REFRESH MATERIALIZED VIEW klines_1w");

  console.log("Materialized views refreshed successfully");
}

cron().catch((err) => {
  console.log(`Error refreshing materialized views: ${err}`);
});

setInterval(() => {
  cron().catch((err) => {
    console.log(`Error refreshing materialized views: ${err}`);
  });
}, 1000 * 10);
