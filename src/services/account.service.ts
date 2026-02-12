import Database from "../config/db";

/**
 * Create Account Service
 */
export const createAccount = async (data: any) => {
  const { Accounts } = Database.getModels();

  const account = await Accounts.create({
    accountName: data.accountName,
    userId: data.userId,
    accountType: data.accountType || "USER",
    assetTypeId: data.assetTypeId,
    balance: data.balance || 0,
  });

  return account;
};

/**
 * Get All Accounts
 */
export const getAllAccounts = async () => {
  const { Accounts, AssetType } = Database.getModels();

  const accounts = await Accounts.findAll({
    include: [
      {
        model: AssetType,
      },
    ],
  });

  return accounts;
};

/**
 * Get Account By ID
 */
export const getAccountById = async (accountId: number) => {
  const { Accounts } = Database.getModels();

  const account = await Accounts.findByPk(accountId);

  if (!account) {
    throw new Error("Account not found");
  }

  return account;
};
