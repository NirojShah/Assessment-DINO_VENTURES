import Database from "../config/db";
import { Transaction } from "sequelize";

/**
 * Create Transaction (Double Entry Ledger)
 *
 * Treasury -> User (Topup/Bonus)
 * User -> Treasury (Spend)
 */
export const createTransaction = async (data: any) => {
  const sequelize = Database.getInstance();

  // Correct: Get models from Database (already initialized)
  const { Transactions, TransactionEntries, Accounts } = Database.getModels();

  return await sequelize.transaction(async (t: Transaction) => {
    const { type, referenceId, entries } = data;

    /**
     * Step 1: Create Parent Transaction
     */
    const transaction = await Transactions.create(
      {
        type,
        referenceId,
        status: "SUCCESS",
      },
      { transaction: t },
    );

    /**
     * Step 2: Validate Ledger Entries
     */
    if (!entries || entries.length < 2) {
      throw new Error("Transaction must have at least 2 entries");
    }

    /**
     * Step 3: Process Each Entry
     */
    for (const entry of entries) {
      const account = await Accounts.findByPk(entry.accountId, {
        transaction: t,
        lock: t.LOCK.UPDATE, // 🔥 prevents race condition
      });

      if (!account) throw new Error("Account not found");

      // Debit reduces balance
      if (entry.entryType === "DEBIT") {
        if (Number(account.balance) < entry.amount) {
          throw new Error("Insufficient balance");
        }

        account.balance = Number(account.balance) - entry.amount;
      }

      // Credit increases balance
      if (entry.entryType === "CREDIT") {
        account.balance = Number(account.balance) + entry.amount;
      }

      await account.save({ transaction: t });

      /**
       * Step 4: Create Ledger Entry
       */
      await TransactionEntries.create(
        {
          transactionId: transaction.id,
          accountId: entry.accountId,
          entryType: entry.entryType,
          amount: entry.amount,
        },
        { transaction: t },
      );
    }

    return transaction;
  });
};

/**
 * Get All Transactions
 */
export const getAllTransactions = async () => {
  // Correct: use initialized models
  const { Transactions, TransactionEntries } = Database.getModels();

  return await Transactions.findAll({
    include: [{ model: TransactionEntries }],
  });
};
