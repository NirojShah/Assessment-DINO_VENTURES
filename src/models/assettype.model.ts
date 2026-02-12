import { DataTypes, Sequelize } from "sequelize";

const AssetTypeModel = (sequelize: Sequelize) => {
  const AssetType = sequelize.define(
    "AssetType",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Gold Coins, Diamonds
      },

      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "asset_types",
      timestamps: true,
    },
  );

  return AssetType;
};

export default AssetTypeModel;
