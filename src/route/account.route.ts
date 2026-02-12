import { Router } from "express";
import {
  createAccountController,
  getAllAccountsController,
} from "../controllers/account.controller";

const accountRouter = Router();

// CREATE ACCOUNT
accountRouter.post("/", createAccountController);

// GET ALL ACCOUNTS
accountRouter.get("/", getAllAccountsController);

export default accountRouter;
