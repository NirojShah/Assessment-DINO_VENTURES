import { DataTypes, Sequelize } from "sequelize";

const TransactionEntryModel = (sequelize: Sequelize) => {
  const TransactionEntries = sequelize.define(
    "TransactionEntries",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      transactionId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "transactions",
          key: "id",
        },
      },

      accountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "accounts",
          key: "id",
        },
      },

      entryType: {
        type: DataTypes.ENUM("DEBIT", "CREDIT"),
        allowNull: false,
      },

      amount: {
        type: DataTypes.BIGINT,
        allowNull: false, // always positive
      },

      note: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "transaction_entries",
      timestamps: true,
    }
  );

  return TransactionEntries;
};

export default TransactionEntryModel;
