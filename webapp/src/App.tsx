import "./App.css";
import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { chain, createClient, configureChains, WagmiConfig } from "wagmi";
import { Connect } from "./Connect";

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  // TODO: { alchemyId: process.env.ALCHEMY_ID }
  [alchemyProvider(), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Super Block",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <div
          style={{
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Connect />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
