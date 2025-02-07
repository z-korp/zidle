export type MessageType =
  | "welcome"
  | "response"
  | "error"
  | "goal_created"
  | "goal_updated"
  | "goal_completed"
  | "goal_failed"
  | "action_start"
  | "action_complete"
  | "action_error"
  | "system"
  | "thinking_start"
  | "thinking_end";

export interface BaseMessage {
  type: MessageType;
  timestamp: string; // ISO string
  emoji?: string;
}

export interface StartThinkingMessage extends BaseMessage {
  type: "thinking_start";
  message: string;
}

export interface StopThinkingMessage extends BaseMessage {
  type: "thinking_end";
}

export interface WelcomeMessage extends BaseMessage {
  type: "welcome";
  message: string;
}

export interface ResponseMessage extends BaseMessage {
  type: "response";
  message: string;
}

export interface ErrorMessage extends BaseMessage {
  type: "error";
  error: string;
}

export interface GoalCreatedMessage extends BaseMessage {
  type: "goal_created";
  data: {
    id: string;
    description: string;
    priority: number;
    horizon: string;
    timestamp: string;
  };
}

export interface GoalUpdatedMessage extends BaseMessage {
  type: "goal_updated";
  data: {
    id: string;
    status: string; // Use enums if possible
    timestamp: string;
  };
}

export interface GoalCompletedMessage extends BaseMessage {
  type: "goal_completed";
  data: {
    id: string;
    result: string;
    description: string;
    timestamp: string;
  };
}

export interface GoalFailedMessage extends BaseMessage {
  type: "goal_failed";
  data: {
    id: string;
    error: string;
    timestamp: string;
  };
}

export interface ActionStartMessage extends BaseMessage {
  type: "action_start";
  data: {
    actionType: string;
    payload: any; // Define more specific types if possible
  };
}

export interface ActionCompleteMessage extends BaseMessage {
  type: "action_complete";
  data: {
    actionType: string;
    result: any;
    timestamp: string;
  };
}

export interface ActionErrorMessage extends BaseMessage {
  type: "action_error";
  data: {
    actionType: string;
    error: string;
    timestamp: string;
  };
}

export interface SystemMessage extends BaseMessage {
  type: "system";
  message: string;
}

// Union Type for All Messages
export type AppMessage =
  | WelcomeMessage
  | ResponseMessage
  | ErrorMessage
  | GoalCreatedMessage
  | GoalUpdatedMessage
  | GoalCompletedMessage
  | GoalFailedMessage
  | ActionStartMessage
  | ActionCompleteMessage
  | ActionErrorMessage
  | SystemMessage
  | StartThinkingMessage
  | StopThinkingMessage;

const emojiMap: Record<MessageType, string> = {
  welcome: "👋",
  response: "💬",
  error: "❌",
  goal_created: "🎯",
  goal_updated: "📝",
  goal_completed: "✅",
  goal_failed: "❌",
  action_start: "🚀",
  action_complete: "✅",
  action_error: "❌",
  system: "🛠️",
};

export function createMessage<M extends BaseMessage>(
  message: Omit<M, "timestamp" | "emoji">,
): M {
  const timestamp = new Date().toISOString();
  const emoji = emojiMap[message.type];

  return {
    ...message,
    timestamp,
    emoji,
  } as M;
}
