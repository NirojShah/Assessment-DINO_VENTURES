import { Sequelize } from "sequelize";
import AssetTypeModel from "../models/assettype.model";
import AccountsModel from "../models/accounts.model";
import TransactionModel from "../models/transaction.model";
import TransactionEntryModel from "../models/transactionentry.model";

const initializeModel = (sequelize: Sequelize) => {
  console.log("Initializing Models...");

  return {
    AssetType: AssetTypeModel(sequelize),
    Accounts: AccountsModel(sequelize),
    Transactions: TransactionModel(sequelize),
    TransactionEntries: TransactionEntryModel(sequelize),
  };
};

export default initializeModel;
