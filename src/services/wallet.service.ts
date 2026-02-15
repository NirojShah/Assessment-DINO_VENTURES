import Database from "../config/db";
import { createTransaction } from "./transaction.service";

/**
 * Get Wallet Account By User ID
 */
export const getWalletByUserId = async (userId: number) => {
  const { Accounts } = Database.getModels();

  const wallet = await Accounts.findOne({
    where: {
      userId,
      accountType: "USER",
    },
  });

  if (!wallet) {
    throw new Error("Wallet not found for this user");
  }

  return wallet;
};

/**
 * Topup Wallet (Treasury → User)
 */
export const topupWallet = async (userId: number, amount: number) => {
  const treasuryAccountId = 1; // System Treasury

  const userWallet = await getWalletByUserId(userId);

  return await createTransaction({
    type: "BONUS",
    referenceId: `topup-${userId}-${Date.now()}`,
    entries: [
      {
        accountId: treasuryAccountId,
        entryType: "DEBIT",
        amount,
      },
      {
        accountId: userWallet.id,
        entryType: "CREDIT",
        amount,
      },
    ],
  });
};

/**
 * Spend Wallet (User → Treasury)
 */
export const spendFromWallet = async (userId: number, amount: number) => {
  const treasuryAccountId = 1;

  const userWallet = await getWalletByUserId(userId);

  return await createTransaction({
    type: "SPEND",
    referenceId: `spend-${userId}-${Date.now()}`,
    entries: [
      {
        accountId: userWallet.id,
        entryType: "DEBIT",
        amount,
      },
      {
        accountId: treasuryAccountId,
        entryType: "CREDIT",
        amount,
      },
    ],
  });
};
