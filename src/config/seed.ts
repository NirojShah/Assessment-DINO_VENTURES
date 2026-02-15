import Database from "./db";

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting Database Seeding...");

    const { AssetType, Accounts, Transactions, TransactionEntries } =
      Database.getModels();

    // -------------------------------
    // 1. Seed Asset Types
    // -------------------------------
    await AssetType.bulkCreate(
      [
        { name: "Gold Coins" },
        { name: "Diamonds" },
        { name: "Reward Points" },
      ],
      { ignoreDuplicates: true }
    );

    console.log("✅ Asset Types Seeded");

    // Fetch Gold Coins Asset
    const goldAsset = await AssetType.findOne({
      where: { name: "Gold Coins" },
    });

    if (!goldAsset) throw new Error("Gold Coins asset missing");

    // -------------------------------
    // 2. Seed Treasury Account
    // -------------------------------
    const treasury = await Accounts.create({
      accountName: "System Treasury",
      userId: null,
      accountType: "SYSTEM",
      assetTypeId: goldAsset.id,
      balance: 100000,
    });

    console.log("✅ Treasury Account Seeded");

    // -------------------------------
    // 3. Seed User Accounts
    // -------------------------------
    const user101 = await Accounts.create({
      accountName: "User 101 Wallet",
      userId: 101,
      accountType: "USER",
      assetTypeId: goldAsset.id,
      balance: 0,
    });

    const user102 = await Accounts.create({
      accountName: "User 102 Wallet",
      userId: 102,
      accountType: "USER",
      assetTypeId: goldAsset.id,
      balance: 0,
    });

    console.log("✅ User Wallet Accounts Created");

    // -------------------------------
    // 4. Seed Initial Balances via Ledger
    // -------------------------------
    const seedInitialBalance = async (
      userAccount: any,
      amount: number,
      referenceId: string
    ) => {
      const tx = await Transactions.create({
        type: "BONUS",
        referenceId,
        description: "Initial Wallet Balance Seed",
        status: "SUCCESS",
      });

      // Treasury → Debit
      await TransactionEntries.create({
        transactionId: tx.id,
        accountId: treasury.id,
        entryType: "DEBIT",
        amount,
        note: "Initial seed funding",
      });

      // User → Credit
      await TransactionEntries.create({
        transactionId: tx.id,
        accountId: userAccount.id,
        entryType: "CREDIT",
        amount,
        note: "Initial wallet credit",
      });

      // Update balances
      await treasury.decrement("balance", { by: amount });
      await userAccount.increment("balance", { by: amount });
    };

    await seedInitialBalance(user101, 500, "seed-user-101");
    await seedInitialBalance(user102, 300, "seed-user-102");

    console.log("✅ Initial Ledger Balances Seeded");

    console.log("🎉 Database Seeding Completed Successfully");
  } catch (error) {
    console.error("❌ Seeding Failed:", error);
  }
};

export default seedDatabase;
