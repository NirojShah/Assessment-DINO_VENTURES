# 💰 Wallet Service API (Double Entry Ledger System)

This project is a **Wallet Service Backend API** built using:

- Node.js + Express + TypeScript
- Sequelize ORM + MySQL
- Double-entry ledger accounting system
- Deadlock-safe transactional balance updates
- Docker + Docker Compose setup

---

## 🚀 Features Implemented

### ✅ Wallet System

- Create user wallet accounts
- Fetch wallet balance
- Spend from wallet safely

### ✅ Double Entry Ledger Architecture

Every transaction creates **two ledger entries**:

- Debit from one account
- Credit to another account

This ensures:

- Auditability
- Accurate history
- No silent balance manipulation

---

## ✅ Brownie Points Achieved

| Bonus Requirement | Status |
|------------------|--------|
| Deadlock Avoidance (row locking + ordered locking) | ✅ Done |
| Ledger-Based Architecture (double-entry system) | ✅ Done |
| Containerization (Docker + Compose) | ✅ Done |
| Hosting (Live Deployment URL) | ❌ Not yet |

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Database:** MySQL
- **ORM:** Sequelize
- **Security:** Helmet, CORS
- **Containerization:** Docker + Docker Compose

---

# 📌 API Endpoints

## Health Check

GET /health

---

## Accounts

### Get All Accounts
GET /accounts

### Create Account
POST /accounts

Example JSON:
{
  "accountName": "User 103 Wallet",
  "userId": 103,
  "accountType": "USER",
  "assetTypeId": 1,
  "balance": 0
}

---

## Wallet

### Get Wallet by User ID
GET /wallet/:userId

Example:
curl http://localhost:3000/wallet/101

### Spend Wallet Balance
POST /wallet/spend

Example JSON:
{
  "userId": 101,
  "amount": 50
}

---

## Transactions

### Get All Transactions
GET /transactions

### Create Transaction (Ledger)
POST /transactions

Example JSON:
{
  "type": "BONUS",
  "referenceId": "bonus-req-001",
  "entries": [
    { "accountId": 1, "entryType": "DEBIT", "amount": 100 },
    { "accountId": 2, "entryType": "CREDIT", "amount": 100 }
  ]
}

---

# 🐳 Docker Setup

Run:
docker-compose up --build

Stop:
docker-compose down

---

# 📌 Author

**Niroj Shah**  
Junior Full Stack Developer  
