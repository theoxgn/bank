require("dotenv").config()
const { DB_CLIENT,
  DB_NAME_LOCAL,DB_USER_LOCAL,DB_PASSWORD_LOCAL,DB_HOST_LOCAL
} = process.env

const AllDb = {
    database_local:{
      host: DB_HOST_LOCAL,
      username: DB_USER_LOCAL,
      password: DB_PASSWORD_LOCAL,
      database: DB_NAME_LOCAL,
      port: 5432,
      dialect: DB_CLIENT,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
}
  
module.exports = AllDb