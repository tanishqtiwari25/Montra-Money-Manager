## Transactions Service (`/services/transactions.api.js`)

### 1. Fetch Transactions
- **Endpoint:** `/transactions`
- **Method:** `GET`
- **Query Params:** `page`, `limit`, `search`, `type`, `category`
- **Used In:** `src/pages/transactions/Transactions.jsx` via `useTransactions` hook

## Accounts Service (`/services/accounts.api.js`)

### 1. Get Accounts
- **Endpoint:** `/accounts`
- **Method:** `GET`
- **Used In:** `src/pages/accounts/Accounts.jsx` via `useAccounts` hook

### 2. Create Account
- **Endpoint:** `/accounts`
- **Method:** `POST`
- **Payload Body:** `{ name, type, balance, accountNumber }`
- **Used In:** `src/pages/accounts/Accounts.jsx`