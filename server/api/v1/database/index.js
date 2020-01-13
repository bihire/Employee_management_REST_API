import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
    console.log('Connected to database succesfully');
});

/**
 * Create Managers Table
 */
const createManagerTables = () => {
    const queryText = `DROP TABLE IF EXISTS managers; CREATE TABLE
    managers(
      id SERIAL,
      first_name VARCHAR(128) NOT NULL,
      last_name VARCHAR(128) NOT NULL,
      email VARCHAR(128) UNIQUE NOT NULL,
      password VARCHAR(128) NOT NULL,
      birth_date TIMESTAMPTZ NOT NULL,
      status VARCHAR(128) NOT NULL,
      position VARCHAR(128) NOT NULL,
      phone_number VARCHAR(128) UNIQUE NOT NULL,
      national_id VARCHAR(128) UNIQUE NOT NULL
    )`;
    pool
        .query(queryText)
        .then(res => {
            console.log(res);
            pool.end();
        })
        .catch(err => {
            console.log(err);
            pool.end();
        });
};

/**
 * Create Employees Table
 */
const createEmployeeTables = () => {
    const queryText = `DROP TABLE IF EXISTS employees; CREATE TABLE
    employees(
      id SERIAL,
      first_name VARCHAR(128) NOT NULL,
      last_name VARCHAR(128) NOT NULL,
      email VARCHAR(128) UNIQUE NOT NULL,
      birth_date TIMESTAMPTZ NOT NULL,
      status VARCHAR(128) NOT NULL,
      position VARCHAR(128) NOT NULL,
      phone_number VARCHAR(128) UNIQUE NOT NULL,
      national_id VARCHAR(128) UNIQUE NOT NULL,
      manager_id INTEGER NOT NULL
    )`;
    pool
        .query(queryText)
        .then(res => {
            console.log(res);
            pool.end();
        })
        .catch(err => {
            console.log(err);
            pool.end();
        });
};

pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
});

const createTables = () => {
    createManagerTables();
    createEmployeeTables();
};
module.exports = createTables;

require('make-runnable');