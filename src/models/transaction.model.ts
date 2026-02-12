import { DataTypes, Sequelize } from "sequelize";

const TransactionModel = (sequelize: Sequelize) => {
  const Transactions = sequelize.define(
    "Transactions",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      type: {
        type: DataTypes.ENUM("TOPUP", "BONUS", "SPEND"),
        allowNull: false,
      },

      referenceId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // idempotency key
      },

      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM("PENDING", "SUCCESS", "FAILED"),
        defaultValue: "SUCCESS",
      },
    },
    {
      tableName: "transactions",
      timestamps: true,
    }
  );

  return Transactions;
};

export default TransactionModel;
