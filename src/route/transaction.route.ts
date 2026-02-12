import { Router } from "express";
import {
  createTransactionController,
  getAllTransactionsController,
} from "../controllers/transaction.controller";

const transactionRoute = Router();

// CREATE TRANSACTION
transactionRoute.post("/", createTransactionController);

// GET ALL TRANSACTIONS
transactionRoute.get("/", getAllTransactionsController);

export default transactionRoute;
