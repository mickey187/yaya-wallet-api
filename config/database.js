const dotenv = require('dotenv');
const { createConnection, DataSource } = require("typeorm");
const fs = require('fs');
const path = require('path');
const Payload = require('../entity/Payload.js');
dotenv.config();

const sslPath = path.join(__dirname, '..', 'config','ca.pem');
const connectionOptions = {
    type: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    autoLoadEntities: true,
    logging: false,
    ssl: {
      ca: fs.readFileSync(sslPath).toString(),
      
      rejectUnauthorized: false, // Ensure server certificate is valid
    },
    
    entities: [
      Payload
    ],

  };
  
  
  const AppDataSource = new DataSource(connectionOptions);
  const connectDB = async () => {
    try {
      // await createConnection(connectionOptions);
     await AppDataSource.initialize();
      console.log("PostgreSQL connected");
    } catch (err) {
      console.error("PostgreSQL connection error", err);
      process.exit(1);
    }
  };
  
  module.exports = {connectDB, AppDataSource};