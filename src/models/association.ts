const initAssociations = (models: any) => {
  const { AssetType, Accounts, Transactions, TransactionEntries } = models;

  // AssetType → Accounts
  AssetType.hasMany(Accounts, { foreignKey: "assetTypeId" });
  Accounts.belongsTo(AssetType, { foreignKey: "assetTypeId" });

  // Transactions → TransactionEntries
  Transactions.hasMany(TransactionEntries, { foreignKey: "transactionId" });
  TransactionEntries.belongsTo(Transactions, {
    foreignKey: "transactionId",
  });

  // Accounts → TransactionEntries
  Accounts.hasMany(TransactionEntries, { foreignKey: "accountId" });
  TransactionEntries.belongsTo(Accounts, { foreignKey: "accountId" });

  console.log("Associations Setup Done");
};

export default initAssociations;
