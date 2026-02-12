import { Request, Response } from "express";
import * as transactionService from "../services/transaction.service";

/**
 * Create Transaction
 * POST /api/transactions
 */
export const createTransactionController = async (
  req: Request,
  res: Response,
) => {
  try {
    const data = req.body;

    const transaction = await transactionService.createTransaction(data);

    return res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: transaction,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

/**
 * Get All Transactions
 * GET /api/transactions
 */
export const getAllTransactionsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const transactions = await transactionService.getAllTransactions();

    return res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      data: transactions,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
