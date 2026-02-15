import { Transaction } from "sequelize";
import Database from "../config/db";

export const createTransaction = async (data: any) => {
  const sequelize = Database.getInstance();
  const { Transactions, TransactionEntries, Accounts } = Database.getModels();

  return await sequelize.transaction(async (t: Transaction) => {
    const { type, referenceId, entries } = data;

    // -------------------------------
    // ✅ Step 0: Idempotency Check
    // -------------------------------
    const existingTx = await Transactions.findOne({
      where: { referenceId },
      transaction: t,
      lock: t.LOCK.KEY_SHARE,
    });

    if (existingTx) {
      return existingTx;
    }

    // -------------------------------
    // Step 1: Validate Entries
    // -------------------------------
    if (!entries || entries.length < 2) {
      throw new Error("Transaction must have at least 2 entries");
    }

    // -------------------------------
    // ✅ Step 2: Debit = Credit Validation
    // -------------------------------
    const totalDebit = entries
      .filter((e: any) => e.entryType === "DEBIT")
      .reduce((sum: number, e: any) => sum + e.amount, 0);

    const totalCredit = entries
      .filter((e: any) => e.entryType === "CREDIT")
      .reduce((sum: number, e: any) => sum + e.amount, 0);

    if (totalDebit !== totalCredit) {
      throw new Error("Ledger mismatch: Total Debit must equal Total Credit");
    }

    // -------------------------------
    // Step 3: Create Parent Transaction
    // -------------------------------
    const transaction = await Transactions.create(
      {
        type,
        referenceId,
        status: "SUCCESS",
      },
      { transaction: t },
    );

    // -------------------------------
    // ✅ Step 4: Deadlock Avoidance
    // Lock accounts in consistent order
    // -------------------------------
    const accountIds = [
      ...new Set(entries.map((e: any) => e.accountId)),
    ].sort();

    const lockedAccounts: any = {};

    for (const id of accountIds) {
      const acc = await Accounts.findByPk(id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!acc) throw new Error(`Account ${id} not found`);

      lockedAccounts[id as any] = acc;
    }

    // -------------------------------
    // Step 5: Apply Balance Changes + Ledger Insert
    // -------------------------------
    for (const entry of entries) {
      const account = lockedAccounts[entry.accountId];

      // Debit reduces balance
      if (entry.entryType === "DEBIT") {
        if (Number(account.balance) < entry.amount) {
          throw new Error("Insufficient balance");
        }

        await account.decrement("balance", {
          by: entry.amount,
          transaction: t,
        });
      }

      // Credit increases balance
      if (entry.entryType === "CREDIT") {
        await account.increment("balance", {
          by: entry.amount,
          transaction: t,
        });
      }

      // Create Ledger Entry
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

export const getAllTransactions = async () => {
  // Correct: use initialized models
  const { Transactions, TransactionEntries } = Database.getModels();
  return await Transactions.findAll({
    include: [{ model: TransactionEntries }],
  });
};
