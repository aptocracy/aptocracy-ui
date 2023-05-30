import React from "react";
import logo from "./logo.svg";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import Navbar from "./components/Navbar/Navbar";
import Routes from "./Routes";
import { Buffer } from "buffer";
import TransactionModal from "./components/TransactionsModal/TransactionModal";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
window.Buffer = Buffer;

function App() {
  const wallets = [new PetraWallet()];
  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      <Navbar />
      <NotificationContainer />
      <Routes />
      <TransactionModal />
    </AptosWalletAdapterProvider>
  );
}

export default App;
