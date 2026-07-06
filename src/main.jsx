import { Buffer } from "buffer";
// Solana web3.js + wallet adapters expect a global Buffer in the browser.
if (!window.Buffer) window.Buffer = Buffer;

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import SolanaProvider from "./wallet/SolanaProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SolanaProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SolanaProvider>
  </StrictMode>
);
