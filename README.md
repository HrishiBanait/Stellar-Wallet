# 🚀 Stellar Wallet

A minimal React dApp for sending XLM on the **Stellar Testnet** using the Freighter browser wallet.

---

## 📋 Project Description

Stellar Send is a lightweight decentralized application built with **React** and **Vite** that lets users connect their Freighter wallet, view their XLM balance, and send XLM payments on the Stellar Testnet — all from a clean, modern UI.

Built with:
- [`@stellar/freighter-api`](https://www.npmjs.com/package/@stellar/freighter-api) — wallet connection & transaction signing
- [`@stellar/stellar-sdk`](https://www.npmjs.com/package/@stellar/stellar-sdk) — transaction building & Horizon API
- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) — UI & dev tooling

---

## ⚙️ Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Freighter Wallet](https://www.freighter.app/) browser extension installed
- A funded Stellar **Testnet** account

### 1. Clone the repository

```bash
git clone https://github.com/your-username/stellar-freighter-dapp.git
cd stellar-freighter-dapp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production

```bash
npm run build
npm run preview
```

### 5. Fund your Testnet account

If your account isn't funded yet, use Friendbot:

```
https://friendbot.stellar.org/?addr=YOUR_PUBLIC_KEY
```

---

## 🧭 How to Use

### Connect Your Wallet
1. Make sure the **Freighter** extension is installed in your browser
2. Open Freighter and switch the network to **Testnet**
3. Click **"Connect Freighter"** — your wallet address and XLM balance will appear

### Check Your Balance
- Your current XLM balance is displayed automatically after connecting
- Click the **↺ refresh** button at any time to fetch the latest balance

### Send XLM
1. Paste the **recipient's Stellar address** (starts with `G...`) into the address field
2. Enter the **amount** of XLM to send
3. Click **"Send XLM"**
4. Freighter will open a popup — **review and sign** the transaction
5. Once confirmed, a success message appears with the transaction hash and a link to view it on [Stellar Expert](https://stellar.expert/explorer/testnet)

---

## 📁 Project Structure

```
src/
├── main.jsx          # React entry point
├── App.jsx           # Root component
├── index.css         # Global styles
├── useFreighter.js   # Custom hook for wallet state & actions
├── stellar.js        # Stellar SDK helpers
├── Transaction.jsx   # Send XLM form component
└── Transaction.css   # Component styles
```

---

## ⚠️ Notes

- This app runs on **Testnet only** — do not use real XLM
- Freighter must be set to **Testnet** in its network settings or transactions will fail
- Minimum send amount is `0.0000001 XLM`

Screenshots:
