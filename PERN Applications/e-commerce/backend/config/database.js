const { Sequelize } = require("sequelize");
require("dotenv").config(); // helps to access the environment variables through process.env --- by Vansh

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",  // tells sequelize that ,we are using postgresSQL Database,
        logging: false,       // sql queries dekhna too set true
    }
);
//now we have created the connection with the postgresDatabase

// sequelize ko export kr rhe h taki baki models me table create kr skkee;1
module.exports = sequelize;