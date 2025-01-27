import { useAgentStore } from "@/stores/useAgentStore";
import { useEffect, useCallback } from "react";

interface ServerMessage {
  type: string;
  message?: string;
  error?: string;
  orchestrators?: Array<{
    id: string;
    name: string;
  }>;
  orchestratorId?: string;
  content?: string;
  messageType?: string;
  timestamp?: number;
}

// Connexion WebSocket singleton
let globalWs: WebSocket | null = null;
const messageQueue: unknown[] = [];
let isConnecting = false;

export function useDaydreamsWs() {
  const { addMessage, setIsConnected } = useAgentStore();

  const ensureConnection = useCallback(async () => {
    if (globalWs?.readyState === WebSocket.OPEN) {
      return true;
    }

    if (isConnecting) {
      await new Promise((resolve) => {
        const checkConnection = setInterval(() => {
          if (globalWs?.readyState === WebSocket.OPEN) {
            clearInterval(checkConnection);
            resolve(true);
          }
        }, 100);
      });
      return true;
    }

    return new Promise<boolean>((resolve) => {
      isConnecting = true;
      const wsUrl = import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:8080";
      globalWs = new WebSocket(wsUrl);

      globalWs.onopen = () => {
        console.log(`✅ Connected to Daydreams WebSocket at ${wsUrl}!`);
        setIsConnected(true);
        isConnecting = false;

        while (messageQueue.length > 0) {
          const message = messageQueue.shift();
          if (message && globalWs?.readyState === WebSocket.OPEN) {
            globalWs.send(JSON.stringify(message));
          }
        }

        resolve(true);
      };

      globalWs.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as ServerMessage;
          console.log("📥 Received message:", data);
          addMessage(data);

          if (data.type === "welcome" || data.type === "orchestrators_list") {
            console.log("🎯 Setting default orchestrator");
          }
        } catch (err) {
          console.error(
            "❌ Failed to parse WebSocket message:",
            event.data,
            err,
          );
        }
      };

      globalWs.onerror = (error) => {
        console.error("WebSocket error:", error);
        isConnecting = false;
        resolve(false);
      };

      globalWs.onclose = () => {
        console.log("❌ Disconnected from Daydreams WebSocket.");
        setIsConnected(false);
        globalWs = null;
        isConnecting = false;
      };
    });
  }, [addMessage, setIsConnected]);

  useEffect(() => {
    ensureConnection();
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }, [ensureConnection]);

  const sendMessage = async (message: unknown) => {
    const isConnected = await ensureConnection();

    if (!isConnected) {
      console.warn(
        "Could not establish WebSocket connection. Adding message to queue.",
      );
      messageQueue.push(message);
      return;
    }

    if (globalWs?.readyState === WebSocket.OPEN) {
      globalWs.send(JSON.stringify(message));
    } else {
      messageQueue.push(message);
    }
  };

  return {
    sendMessage,
  };
}
