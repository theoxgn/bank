const { Sequelize } = require('sequelize')
require("dotenv").config()
const dbConfig = require("../config/db.config")

// set config multi database
const dbLocalConfig = dbConfig.database_local

// db local
const dbLocal = new Sequelize(dbLocalConfig.database, dbLocalConfig.username, dbLocalConfig.password, {
    host: dbLocalConfig.host,
    dialect: dbLocalConfig.dialect,
    operatorAlias: false,
    port: dbLocalConfig.port,
    timezone: '+07:00', // Untuk WIB
    dialectOptions: {
        timezone: '+07:00'
    },
    pool: {
        max: dbLocalConfig.pool.max,
        min: dbLocalConfig.pool.min,
        acquire: dbLocalConfig.pool.acquire,
        idle: dbLocalConfig.pool.idle,
    },
    //logging: console.log,
})

// export database
module.exports = {dbLocal}