import React, { useEffect, useState, useCallback, useMemo } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { setup, SetupResult } from "./dojo/setup.ts";
import { DojoProvider } from "./dojo/context.tsx";
import { dojoConfig } from "../dojo.config.ts";
import { Loading } from "@/ui/screens/Loading";
import { SoundPlayerProvider } from "./contexts/sound.tsx";
import { ThemeProvider } from "./ui/elements/theme-provider.tsx";
import { StarknetConfig, jsonRpcProvider, voyager } from "@starknet-react/core";
import { sepolia } from "@starknet-react/chains";
import cartridgeConnector from "./cartridgeConnector.tsx";

import "./index.css";

function rpc() {
  return {
    nodeUrl: import.meta.env.VITE_PUBLIC_NODE_URL,
  };
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

function Main() {
  const connectors = [cartridgeConnector];

  const [setupResult, setSetupResult] = useState<SetupResult | null>(null);

  const loading = useMemo(
    () => {
      return !setupResult
    },
    [setupResult],
  );


  useEffect(() => {
    async function initialize() {
      try {
        const result = await setup(dojoConfig());
        setSetupResult(result);
        
      } catch (error) {
        console.error("Setup failed:", error);
      }
    }
    initialize();
  }, []);


  return (
    <React.StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <StarknetConfig
          autoConnect
          chains={[sepolia]}
          connectors={connectors}
          explorer={voyager}
          provider={jsonRpcProvider({ rpc })}
        >
          {loading ? (
            <Loading /> // Utilisation d'une fonction pour éviter l'appel immédiat
          ) : setupResult ? (
            <DojoProvider value={setupResult}>
              <SoundPlayerProvider>
                <App />
              </SoundPlayerProvider>
            </DojoProvider>
          ) : (
            <div>Error during initialization</div>
          )}
        </StarknetConfig>
      </ThemeProvider>
    </React.StrictMode>
  );
}

root.render(<Main />);