export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getFriendlyErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return "Não foi possível concluir a solicitação";
  }

  switch (error.status) {
    case 0:
      return "Não foi possível conectar ao serviço";
    case 400:
      return "Requisição inválida";
    case 401:
      return "Acesso não autorizado";
    case 429:
      return "Limite de requisições excedido, tente novamente em alguns segundos";
    case 502:
    case 503:
      return "Serviço indisponível";
    case 504:
      return "Timeout na resposta do servidor";
    default:
      return "Ocorreu um erro inesperado";
  }
}
