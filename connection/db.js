const { Pool } = require('pg')

// Setup connection
const dbPool = new Pool({
    database: 'dumbways_task',
    port: 5432,
    user: 'postgres',
    password: 'lucia'
})

module.exports = dbPool