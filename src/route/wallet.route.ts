import { Router } from "express";
import {
  getWalletController,
  topupWalletController,
  spendWalletController,
} from "../controllers/wallet.controller";

const walletRouter = Router();

/**
 * GET Wallet Balance
 * /wallet/101
 */
walletRouter.get("/:userId", getWalletController);

/**
 * POST Wallet Topup
 * /wallet/topup
 */
walletRouter.post("/topup", topupWalletController);

/**
 * POST Wallet Spend
 * /wallet/spend
 */
walletRouter.post("/spend", spendWalletController);

export default walletRouter;
