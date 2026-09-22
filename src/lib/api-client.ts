import { ApiError } from "@/lib/errors";
import type { ChatRequest, ChatResponse } from "@/lib/types";

type ProblemDetail = {
  detail?: string;
};

function hasStringProperty(
  value: unknown,
  property: string,
): value is Record<string, string> {
  return (
    typeof value === "object" &&
    value !== null &&
    property in value &&
    typeof (value as Record<string, unknown>)[property] === "string"
  );
}

function isChatResponse(value: unknown): value is ChatResponse {
  return (
    hasStringProperty(value, "response") &&
    hasStringProperty(value, "provider")
  );
}

async function readProblemDetail(response: Response): Promise<ProblemDetail> {
  const payload: unknown = await response.json().catch(() => null);

  return hasStringProperty(payload, "detail")
    ? { detail: payload.detail }
    : {};
}

export async function askAssistant(
  message: string,
  apiKey?: string,
): Promise<ChatResponse> {
  const normalizedMessage = message.trim();

  if (!normalizedMessage) {
    throw new ApiError(400, "Mensagem não pode ser vazia");
  }

  const apiUrl = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
  ).replace(/\/$/, "");
  const body: ChatRequest = { message: normalizedMessage };

  let response: Response;

  try {
    response = await fetch(`${apiUrl}/api/v1/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { "X-API-Key": apiKey } : {}),
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "Falha de conexão com o serviço");
  }

  if (!response.ok) {
    const problem = await readProblemDetail(response);
    throw new ApiError(
      response.status,
      problem.detail || `HTTP ${response.status}`,
    );
  }

  const payload: unknown = await response.json();

  if (!isChatResponse(payload)) {
    throw new ApiError(502, "Resposta inválida do serviço");
  }

  return payload;
}
