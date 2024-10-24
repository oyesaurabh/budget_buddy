import postgres from "postgres";

let { ENV, PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGHOST_DEV } = process.env;

const sql = postgres({
  host: ENV === "production" ? PGHOST : PGHOST_DEV,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: "require",
});

export { sql };
