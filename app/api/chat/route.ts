import { NextRequest, NextResponse } from "next/server";

type ChatRequestBody = {
  message?: unknown;
};

type ChatResponseBody = {
  response: string;
  provider: string;
};

const MAX_REQUEST_BYTES = 16_384;
const MAX_MESSAGE_LENGTH = 4_000;

function hasStringProperty(
  payload: unknown,
  property: string,
): payload is Record<string, string> {
  if (
    typeof payload === "object" &&
    payload !== null &&
    property in payload &&
    typeof (payload as Record<string, unknown>)[property] === "string"
  ) {
    return true;
  }

  return false;
}

function isChatResponse(payload: unknown): payload is ChatResponseBody {
  return (
    hasStringProperty(payload, "response") &&
    hasStringProperty(payload, "provider")
  );
}

function getSafeUpstreamError(status: number): string {
  switch (status) {
    case 400:
      return "Requisição inválida";
    case 401:
    case 403:
      return "Falha de autenticação com o serviço";
    case 429:
      return "Limite de requisições excedido";
    case 504:
      return "Timeout na resposta do servidor";
    default:
      return status >= 500
        ? "Serviço indisponível"
        : "Não foi possível processar a solicitação";
  }
}

function getBackendUrl(value: string): string | null {
  try {
    const url = new URL(value);
    const isLoopback =
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "[::1]";

    if (
      (url.protocol !== "https:" && !(url.protocol === "http:" && isLoopback)) ||
      url.username ||
      url.password
    ) {
      return null;
    }

    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  let body: ChatRequestBody;

  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json(
      { detail: "Origem não permitida" },
      { status: 403 },
    );
  }

  const contentType = request.headers.get("content-type");
  if (!contentType?.toLowerCase().startsWith("application/json")) {
    return NextResponse.json(
      { detail: "Content-Type deve ser application/json" },
      { status: 415 },
    );
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json(
      { detail: "Requisição muito grande" },
      { status: 413 },
    );
  }

  try {
    const rawBody = await request.text();

    if (new TextEncoder().encode(rawBody).byteLength > MAX_REQUEST_BYTES) {
      return NextResponse.json(
        { detail: "Requisição muito grande" },
        { status: 413 },
      );
    }

    body = JSON.parse(rawBody) as ChatRequestBody;
  } catch {
    return NextResponse.json(
      { detail: "Corpo da requisição inválido" },
      { status: 400 },
    );
  }

  if (typeof body.message !== "string" || !body.message.trim()) {
    return NextResponse.json(
      { detail: 'Campo "message" é obrigatório' },
      { status: 400 },
    );
  }

  if (body.message.trim().length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { detail: `A mensagem deve ter no máximo ${MAX_MESSAGE_LENGTH} caracteres` },
      { status: 400 },
    );
  }

  const rawBackendUrl = process.env.BACKEND_API_URL;
  const apiKey = process.env.BACKEND_API_KEY;

  if (!rawBackendUrl || !apiKey) {
    console.error(
      "Variáveis de ambiente BACKEND_API_URL ou BACKEND_API_KEY não configuradas",
    );
    return NextResponse.json(
      { detail: "Configuração do servidor incompleta" },
      { status: 500 },
    );
  }

  const backendUrl = getBackendUrl(rawBackendUrl);

  if (!backendUrl) {
    console.error("BACKEND_API_URL possui um valor inválido");
    return NextResponse.json(
      { detail: "Configuração do servidor incompleta" },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(`${backendUrl}/api/v1/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({ message: body.message.trim() }),
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    });

    const data: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      const headers = new Headers();
      const retryAfter = response.headers.get("retry-after");

      if (retryAfter) {
        headers.set("Retry-After", retryAfter);
      }

      return NextResponse.json(
        { detail: getSafeUpstreamError(response.status) },
        { status: response.status, headers },
      );
    }

    if (!isChatResponse(data)) {
      console.error("Backend retornou um formato de resposta inválido");
      return NextResponse.json(
        { detail: "Resposta inválida do serviço" },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { response: data.response, provider: data.provider },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    const isTimeout =
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError");

    console.error("Falha ao chamar o backend", {
      errorType: error instanceof Error ? error.name : "UnknownError",
    });

    return NextResponse.json(
      {
        detail: isTimeout
          ? "Timeout na resposta do servidor"
          : "Serviço indisponível",
      },
      { status: isTimeout ? 504 : 503 },
    );
  }
}
