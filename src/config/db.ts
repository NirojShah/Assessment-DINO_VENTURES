// src/config/db.ts

import mysql2 from "mysql2/promise";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";
import initializeModel from "./intiallizemodel";
import initModels from "../models/association";
import seedDatabase from "./seed";

// Load .env properly
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

class Database {
  private static instance: Sequelize;
  public static Models: any; // 👈 Models will be stored here

  static async initialize(): Promise<Sequelize> {
    try {
      // ENV values
      const DB_NAME = process.env.DB_NAME || "wallet_db";
      const DB_HOST = process.env.DB_HOST || "localhost";
      const DB_PORT = Number(process.env.DB_PORT) || 3306;
      const DB_USER = process.env.DB_USER || "root";
      const DB_PASSWORD = process.env.DB_PASSWORD || "root";

      // mysql2 config
      const mysql2Config = {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        port: DB_PORT,
      };

      // Sequelize config
      const sequelizeConfig = {
        host: DB_HOST,
        username: DB_USER,
        password: DB_PASSWORD,
        port: DB_PORT,
      };

      // ----------------------------------------
      // STEP 1: Create database if not exists
      // ----------------------------------------
      const connection = await mysql2.createConnection(mysql2Config);

      await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);

      console.log(`Database '${DB_NAME}' ready`);

      await connection.end();

      // ----------------------------------------
      // STEP 2: Initialize Sequelize
      // ----------------------------------------
      this.instance = new Sequelize({
        database: DB_NAME,
        ...sequelizeConfig,
        dialect: "mysql",

        logging: process.env.NODE_ENV === "development" ? console.log : false,

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
      // ----------------------------------------
      // STEP 4: Initialize Models
      // ----------------------------------------
      this.Models = initializeModel(this.instance);

      // ----------------------------------------
      // STEP 5: Initialize Associations
      // ----------------------------------------
      initModels(this.Models);

      // ----------------------------------------
      // STEP 6: Sync Database Tables
      // ----------------------------------------
      await this.instance.sync({
        force: true,
        logging: false,
      });

      if (process.env.RUN_SEED === "true") {
        console.log("SEEDING...");
        await seedDatabase();
        process.env.RUN_SEED = "false"
      }

      return this.instance;
    } catch (error: any) {
      console.error("❌ Database Error:", {
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

  static getModels() {
    if (!this.Models) {
      throw new Error("Models not initialized. Call initialize() first.");
    }

    return this.Models;
  }
}

export default Database;
