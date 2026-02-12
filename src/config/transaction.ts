import Database from "../config/db";

const createTransaction = async () => {
  const sequelize = Database.getInstance();

  const transaction = await sequelize.transaction();

  return transaction;
};

export default createTransaction;
