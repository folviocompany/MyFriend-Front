import { NextRequest, NextResponse } from "next/server";

type ChatRequestBody = {
  message?: unknown;
};

function getErrorDetail(payload: unknown): string | undefined {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "detail" in payload &&
    typeof payload.detail === "string"
  ) {
    return payload.detail;
  }

  return undefined;
}

function getBackendUrl(value: string): string | null {
  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  let body: ChatRequestBody;

  try {
    body = (await request.json()) as ChatRequestBody;
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
        { detail: getErrorDetail(data) || `Erro ${response.status}` },
        { status: response.status, headers },
      );
    }

    return NextResponse.json(data, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
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
