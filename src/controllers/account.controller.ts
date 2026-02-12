import { Request, Response } from "express";
import * as accountService from "../services/account.service";

/**
 * Create New Account
 * POST /api/accounts
 */
export const createAccountController = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const account = await accountService.createAccount(data);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: account,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

/**
 * Get All Accounts
 * GET /api/accounts
 */
export const getAllAccountsController = async (req: Request, res: Response) => {
  try {
    const accounts = await accountService.getAllAccounts();

    return res.status(200).json({
      success: true,
      message: "Accounts fetched successfully",
      data: accounts,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
