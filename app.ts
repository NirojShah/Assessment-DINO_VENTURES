import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import accountRouter from "./src/route/account.route";
import transactionRoute from "./src/route/transaction.route";

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// app.use('/api/wallet', walletRoutes);

app.use("/accounts", accountRouter);
app.use("/transactions", transactionRoute);
// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

export default app;
