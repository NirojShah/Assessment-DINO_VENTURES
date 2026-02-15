import { Request, Response } from "express";
import {
  getWalletByUserId,
  topupWallet,
  spendFromWallet,
} from "../services/wallet.service";

/**
 * GET Wallet Balance
 */
export const getWalletController = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);

    const wallet = await getWalletByUserId(userId);

    res.json({
      success: true,
      message: "Wallet fetched successfully",
      data: wallet,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * POST Wallet Topup
 */
export const topupWalletController = async (req: Request, res: Response) => {
  try {
    const { userId, amount } = req.body;

    const transaction = await topupWallet(userId, amount);

    res.json({
      success: true,
      message: "Wallet topped up successfully",
      data: transaction,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * POST Wallet Spend
 */
export const spendWalletController = async (req: Request, res: Response) => {
  try {
    const { userId, amount } = req.body;

    const transaction = await spendFromWallet(userId, amount);

    res.json({
      success: true,
      message: "Spend successful",
      data: transaction,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
