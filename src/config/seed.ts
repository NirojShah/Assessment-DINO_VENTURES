import Database from "./db";

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting Database Seeding...");

    // Get already initialized models
    const { AssetType, Accounts, Transactions, TransactionEntries } =
      Database.getModels();

    // -------------------------------
    // 1. Seed Asset Types
    // -------------------------------
    await AssetType.bulkCreate(
      [{ name: "Gold Coins" }, { name: "Diamonds" }, { name: "Reward Points" }],
      { ignoreDuplicates: true },
    );

    console.log("Asset Types Seeded");

    // -------------------------------
    // 2. Seed System Treasury Account
    // -------------------------------
    const treasury = await Accounts.create({
      accountName: "System Treasury",
      userId: null,
      accountType: "SYSTEM",
      assetTypeId: 1,
      balance: 100000,
    });

    console.log("Treasury Account Seeded");

    // -------------------------------
    // 3. Seed User Accounts
    // -------------------------------
    await Accounts.bulkCreate([
      {
        accountName: "User 101 Wallet",
        userId: 101,
        accountType: "USER",
        assetTypeId: 1,
        balance: 500,
      },
      {
        accountName: "User 102 Wallet",
        userId: 102,
        accountType: "USER",
        assetTypeId: 1,
        balance: 300,
      },
    ]);

    console.log("User Accounts Seeded");

    console.log("🎉 Seeding Completed Successfully");
  } catch (error) {
    console.error("❌ Seeding Failed:", error);
  }
};

export default seedDatabase;
