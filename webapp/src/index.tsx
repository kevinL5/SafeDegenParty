import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// rainbowkit
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";

// wagmi
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { chain, createClient, configureChains, WagmiConfig } from "wagmi";

// notistack
import { SnackbarProvider } from "notistack";

const { chains, provider } = configureChains(
  [chain.polygon],
  [alchemyProvider(), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Safe Degen Party",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <SnackbarProvider
          maxSnack={2}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          iconVariant={{
            success: "✅",
            error: "✖️",
            warning: "⚠️",
            info: "ℹ️",
          }}
        >
          <App />
        </SnackbarProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
