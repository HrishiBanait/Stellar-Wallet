import * as StellarSdk from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";
import { server, networkPassphrase } from "./file.js";
import { isConnected, requestAccess } from "@stellar/freighter-api";
import { useEffect, useState } from "react";



function getBalance({ publicKey }) {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey) return;

      const account = await server.loadAccount(publicKey);

      const xlmBalance = account.balances.find(
        (b) => b.asset_type === "native"
      );

      setBalance(xlmBalance.balance);
    };

    fetchBalance();
  }, [publicKey]);

  return (
    <div className="card balance-card">
      <div className="card-header">
        <h2>Account balance</h2>
      </div>

      <div className="balance-value">
        <span className="balance-amount">
          {balance ? balance : "—"}
        </span>
        <span className="balance-currency">XLM</span>
      </div>
    </div>
  );
}
function Transaction({ publicKey }) {
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  const fetchBalance = async () => {
    if (!publicKey) return;
    setBalanceLoading(true);
    try {
      const account = await server.loadAccount(publicKey);
      const xlm = account.balances.find((b) => b.asset_type === "native");
      setBalance(xlm ? parseFloat(xlm.balance).toFixed(4) : "0.0000");
    } catch (err) {
      console.error("Failed to fetch balance:", err);
      setBalance(null);
    } finally {
      setBalanceLoading(false);
    }
  };

  // Fetch on mount and whenever publicKey changes
  useEffect(() => {
    fetchBalance();
  }, [publicKey]);

  const sendPayment = async () => {
    try {
      setStatus("Processing...");

      const sourceAccount = await server.loadAccount(publicKey);
      const fee = await server.fetchBaseFee();

      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee,
        networkPassphrase,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination,
            asset: StellarSdk.Asset.native(),
            amount,
          })
        )
        .setTimeout(30)
        .build();

      const signedTx = await signTransaction(transaction.toXDR(), {
        networkPassphrase,
      });

      const tx = StellarSdk.TransactionBuilder.fromXDR(
        signedTx.signedTxXdr,
        networkPassphrase
      );

      const result = await server.submitTransaction(tx);
      setStatus(`✅ Success! Hash: ${result.hash}`);
      await fetchBalance();
    } catch (err) {
      console.error(err);
      setStatus("❌ Transaction failed");
    }
  };

  const isProcessing = status === "Processing...";

  return (
    <div className="card send-card">
      {/* Header */}
      <div className="card-header">
        <div className="card-icon">✦</div>
        <div>
          <h2 className="card-title">Send XLM</h2>
          <p className="card-subtitle">Stellar Testnet</p>
        </div>
      </div>

      {/* Balance */}
      <div className="balance-bar">
        <div className="balance-left">
          <span className="balance-label">Your Balance</span>
          <span className="balance-amount">
            {balanceLoading ? (
              <span className="balance-loading">
                <span className="btn-spinner balance-spinner" />
                Fetching…
              </span>
            ) : balance !== null ? (
              <>{balance} <span className="balance-unit">XLM</span></>
            ) : (
              <span className="balance-error">Unavailable</span>
            )}
          </span>
        </div>
        <button
          className="btn-refresh"
          onClick={fetchBalance}
          disabled={balanceLoading}
          title="Refresh balance"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={balanceLoading ? "spin" : ""}>
            <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
        </button>
      </div>

      <div className="form">
        {/* Receiver */}
        <label className="field">
          <span className="field-label field-label--blue">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            Receiver's Address
          </span>
          <input
            className="input input--blue"
            placeholder="G... Stellar address"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            disabled={isProcessing}
            spellCheck="false"
            autoComplete="off"
          />
        </label>

        {/* Amount */}
        <label className="field">
          <span className="field-label field-label--indigo">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            Amount (XLM)
          </span>
          <div className="input-wrap">
            <input
              className="input input--indigo"
              type="number"
              min="0"
              step="0.000001"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isProcessing}
            />
            <span className="input-badge">XLM</span>
          </div>
        </label>

        {/* Divider */}
        <div className="divider" />

        {/* Submit */}
        <button
          className="btn-send"
          onClick={sendPayment}
          disabled={!destination || !amount || isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="btn-spinner" />
              Sending…
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              Send XLM
            </>
          )}
        </button>
      </div>

      {/* Status */}
      {status && !isProcessing && (
        <div className={`status-box ${status.startsWith("✅") ? "status-box--success" : "status-box--error"}`}>
          <span className="status-text">{status}</span>
          {status.startsWith("✅") && (
            <a
              className="status-link"
              href={`https://stellar.expert/explorer/testnet/tx/${status.split("Hash: ")[1]}`}
              target="_blank"
              rel="noreferrer"
            >
              View on Explorer →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
function WalletConnect({ setPublicKey }) {
  const connectWallet = async () => {
    try {
      const connected = await isConnected();

      if (!connected) {
        alert("Please install Freighter");
        return;
      }

      const access = await requestAccess();
      setPublicKey(access.address);
    } catch (err) {
      console.error(err);
    }
  };

  const disconnectWallet = () => {
    setPublicKey(null);
  };

  return (
    <div className="card wallet-card">
      
      <div className="wallet-actions">
        <button className="btn btn-primary" onClick={connectWallet}>
          Connect wallet
        </button>
        <button className="btn btn-secondary" onClick={disconnectWallet}>
          Disconnect
        </button>
      </div>
    </div>
  );
}
function App() {
  const [publicKey, setPublicKey] = useState(null);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Stellar Wallet</h1>
        </header>

      <section className="app-section">
        <WalletConnect setPublicKey={setPublicKey} />
      </section>

      {publicKey && (
        <section className="app-grid">
          <getBalance publicKey={publicKey} />
          <Transaction publicKey={publicKey} />
        </section>
      )}
    </div>
  );
}

export default App;