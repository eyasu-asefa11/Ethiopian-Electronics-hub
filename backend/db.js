const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "dilla_marketplace",
  password: "5800",
  port: 5432,
});

module.exports = pool;