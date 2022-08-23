const { Pool } = require('pg');

const { ELEPHANTSQL_CONNECTION_STRING } = process.env;

const pool = new Pool({
  connectionString: ELEPHANTSQL_CONNECTION_STRING,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
