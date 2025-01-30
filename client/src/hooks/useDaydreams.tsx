import { useAgentStore } from "@/stores/useAgentStore";
import { useEffect, useCallback } from "react";
import {
  AppMessage,
  WelcomeMessage,
  ResponseMessage,
  ErrorMessage,
  GoalCreatedMessage,
  GoalUpdatedMessage,
  GoalCompletedMessage,
  GoalFailedMessage,
  ActionStartMessage,
  ActionCompleteMessage,
  ActionErrorMessage,
  SystemMessage,
} from "../types/message";

// WebSocket singleton
let globalWs: WebSocket | null = null;
const messageQueue: string[] = [];
let isConnecting = false;

export function useDaydreamsWs() {
  const { addMessage, setIsConnected } = useAgentStore();

  const ensureConnection = useCallback(async () => {
    if (globalWs?.readyState === WebSocket.OPEN) {
      return true;
    }

    if (isConnecting) {
      return new Promise<boolean>((resolve) => {
        const checkConnection = setInterval(() => {
          if (globalWs?.readyState === WebSocket.OPEN) {
            clearInterval(checkConnection);
            resolve(true);
          }
        }, 100);
      });
    }

    return new Promise<boolean>((resolve) => {
      isConnecting = true;
      const wsUrl = import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:8080";
      globalWs = new WebSocket(wsUrl);

      globalWs.onopen = () => {
        console.log(`✅ Connected to Daydreams WebSocket at ${wsUrl}!`);
        setIsConnected(true);
        isConnecting = false;

        // Flush the message queue
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
          const data = JSON.parse(event.data) as AppMessage;
          console.log("📥 Received message:", data);
          handleMessage(data);
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

      let reconnectAttempts = 0;
      const MAX_RECONNECT_ATTEMPTS = 5;

      globalWs.onclose = (event) => {
        console.log("❌ Disconnected from Daydreams WebSocket.");
        console.log("🔍 Close event details:", event);
        setIsConnected(false);
        globalWs = null;
        isConnecting = false;

        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          const timeout = Math.min(1000 * 2 ** reconnectAttempts, 30000); // Exponential backoff
          console.log(
            `🔄 Attempting to reconnect in ${timeout / 1000} seconds...`,
          );
          setTimeout(() => {
            reconnectAttempts++;
            ensureConnection();
          }, timeout);
        } else {
          console.warn("🚫 Max reconnection attempts reached.");
        }
      };
    });
  }, [setIsConnected]);

  // Handle incoming messages based on their type
  const handleMessage = (message: AppMessage) => {
    switch (message.type) {
      case "welcome":
        handleWelcomeMessage(message);
        break;
      case "response":
        handleResponseMessage(message);
        break;
      case "error":
        handleErrorMessage(message);
        break;
      case "goal_created":
        handleGoalCreatedMessage(message);
        break;
      case "goal_updated":
        handleGoalUpdatedMessage(message);
        break;
      case "goal_completed":
        handleGoalCompletedMessage(message);
        break;
      case "goal_failed":
        handleGoalFailedMessage(message);
        break;
      case "action_start":
        handleActionStartMessage(message);
        break;
      case "action_complete":
        handleActionCompleteMessage(message);
        break;
      case "action_error":
        handleActionErrorMessage(message);
        break;
      case "system":
        handleSystemMessage(message);
        break;
      default:
        console.warn("❓ Unknown message type");
        addMessage(message);
    }
  };

  // Define handlers for each message type
  const handleWelcomeMessage = (message: WelcomeMessage) => {
    addMessage({
      type: "welcome",
      message: message.message,
      timestamp: message.timestamp,
      emoji: message.emoji,
    });
  };

  const handleResponseMessage = (message: ResponseMessage) => {
    addMessage({
      type: "response",
      message: message.message,
      timestamp: message.timestamp,
      emoji: message.emoji,
    });
  };

  const handleErrorMessage = (message: ErrorMessage) => {
    addMessage({
      type: "error",
      error: message.error,
      timestamp: message.timestamp,
      emoji: message.emoji,
    });
  };

  const handleGoalCreatedMessage = (message: GoalCreatedMessage) => {
    addMessage({
      type: "goal_created",
      data: message.data,
      timestamp: message.timestamp,
      emoji: message.emoji,
    });
    // Optionally, handle orchestrator lists or other specific actions
  };

  const handleGoalUpdatedMessage = (message: GoalUpdatedMessage) => {
    addMessage({
      type: "goal_updated",
      data: message.data,
      timestamp: message.timestamp,
      emoji: message.emoji,
    });
  };

  const handleGoalCompletedMessage = (message: GoalCompletedMessage) => {
    addMessage({
      type: "goal_completed",
      data: message.data,
      timestamp: message.timestamp,
      emoji: message.emoji,
    });
  };

  const handleGoalFailedMessage = (message: GoalFailedMessage) => {
    addMessage({
      type: "goal_failed",
      data: message.data,
      timestamp: message.timestamp,
      emoji: message.emoji,
    });
  };

  const handleActionStartMessage = (message: ActionStartMessage) => {
    addMessage({
      type: "action_start",
      data: message.data,
      timestamp: message.timestamp,
      emoji: message.emoji,
    });
  };

  const handleActionCompleteMessage = (message: ActionCompleteMessage) => {
    addMessage({
      type: "action_complete",
      data: message.data,
      timestamp: message.timestamp,
      emoji: message.emoji,
    });
  };

  const handleActionErrorMessage = (message: ActionErrorMessage) => {
    addMessage({
      type: "action_error",
      data: message.data,
      timestamp: message.timestamp,
      emoji: message.emoji,
    });
  };

  const handleSystemMessage = (message: SystemMessage) => {
    addMessage({
      type: "system",
      message: message.message,
      timestamp: message.timestamp,
      emoji: message.emoji,
    });
  };

  useEffect(() => {
    ensureConnection();
    // Cleanup on unmount
    return () => {
      if (globalWs) {
        globalWs.close();
      }
    };
  }, [ensureConnection]);

  const sendMessage = async (message: string) => {
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
