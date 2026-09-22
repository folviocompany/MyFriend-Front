export type ChatRequest = {
  message: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  provider?: string;
};

export type ChatResponse = {
  response: string;
  provider: string;
};
