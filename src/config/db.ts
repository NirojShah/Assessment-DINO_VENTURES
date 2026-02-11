// src/config/db.ts

import mysql2 from "mysql2/promise";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";

// Load .env properly (safe for any folder level)
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

class Database {
  private static instance: Sequelize;

  static async initialize(): Promise<Sequelize> {
    try {
      // Read ENV values safely
      const DB_NAME = process.env.DB_NAME || "wallet_db";
      const DB_HOST = process.env.DB_HOST || "localhost";
      const DB_PORT = Number(process.env.DB_PORT) || 3306;
      const DB_USER = process.env.DB_USER || "root";
      const DB_PASSWORD = process.env.DB_PASSWORD || "root";

      // ----------------------------------------
      // mysql2 config (needs `user`)
      // ----------------------------------------
      const mysql2Config = {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        port: DB_PORT,
      };

      // ----------------------------------------
      // Sequelize config (needs `username`)
      // ----------------------------------------
      const sequelizeConfig = {
        host: DB_HOST,
        username: DB_USER,
        password: DB_PASSWORD,
        port: DB_PORT,
      };

      console.log("Using mysql2 config:", mysql2Config);

      // ----------------------------------------
      // STEP 1: Create database if not exists
      // ----------------------------------------
      console.log("Creating database if not exists...");

      const connection = await mysql2.createConnection({
        ...mysql2Config,
      });

      await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
      console.log(`Database '${DB_NAME}' created/verified`);

      await connection.end();

      // ----------------------------------------
      // STEP 2: Initialize Sequelize
      // ----------------------------------------
      console.log("Connecting Sequelize...");

      this.instance = new Sequelize({
        database: DB_NAME,
        ...sequelizeConfig,
        dialect: "mysql",

        logging:
          process.env.NODE_ENV === "development" ? console.log : false,

        pool: {
          max: 10,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      });

      // ----------------------------------------
      // STEP 3: Authenticate connection
      // ----------------------------------------
      await this.instance.authenticate();
      console.log("Sequelize connected successfully!");

      // ----------------------------------------
      // STEP 4: Sync models
      // ----------------------------------------
      await this.instance.sync({
        alter: false,
        logging: false,
      });

      console.log("Database models synced successfully!");

      return this.instance;
    } catch (error: any) {
      console.error("Database Error:", {
        message: error.message,
        code: error.code,
        sqlMessage: error.parent?.sqlMessage,
      });

      throw error;
    }
  }

  static getInstance(): Sequelize {
    if (!this.instance) {
      throw new Error("Database not initialized. Call initialize() first.");
    }

    return this.instance;
  }
}

export default Database;
