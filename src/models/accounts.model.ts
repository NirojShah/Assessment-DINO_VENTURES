import { DataTypes, Sequelize } from "sequelize";

const AccountsModel = (sequelize: Sequelize) => {
  const Accounts = sequelize.define(
    "Accounts",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: true, // null → system wallet
      },

      accountName: {
        type: DataTypes.STRING,
        allowNull: false, // Treasury, Revenue, User Wallet
      },

      accountType: {
        type: DataTypes.ENUM("USER", "SYSTEM"),
        allowNull: false,
        defaultValue: "USER",
      },

      assetTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "asset_types",
          key: "id",
        },
      },
    },
    {
      tableName: "accounts",
      timestamps: true,
    }
  );

  return Accounts;
};

export default AccountsModel;
