# MyFriend Frontend

Interface web do assistente de suporte técnico para provedores de internet. O projeto oferece um chat em estilo terminal, integrado ao backend MyFriend e ao Gemini por meio de um proxy seguro no Next.js.

Produção: [myfriend-tau.vercel.app/chat](https://myfriend-tau.vercel.app/chat)

## Tecnologias

- Next.js 16 com App Router
- React 19
- TypeScript em modo estrito
- Tailwind CSS 4
- pnpm
- Vercel para o frontend e o proxy
- Railway para o backend

## Funcionalidades

- Chat responsivo com mensagens de usuário e assistente
- Indicador de carregamento e scroll automático
- Renderização segura de negrito, itálico e quebras de linha
- Tratamento visual de erros HTTP
- Proxy server-side para evitar CORS
- Chave da API protegida e adicionada somente no servidor
- Timeout de 30 segundos e respostas sem cache

## Arquitetura

```text
Navegador
   │ POST /api/chat (sem chave)
   ▼
Next.js / Vercel
   │ POST /api/v1/chat + X-API-Key
   ▼
Backend / Railway
   │
   ▼
Gemini
```

O navegador nunca recebe `BACKEND_API_KEY`. A rota `app/api/chat/route.ts` lê a chave no ambiente do servidor, chama o backend e devolve apenas a resposta necessária ao frontend.

## Executando localmente

### Pré-requisitos

- Node.js 20 ou superior
- pnpm
- Backend MyFriend disponível localmente ou em uma URL acessível

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/folviocompany/MyFriend-Front.git
cd MyFriend-Front
pnpm install
```

Crie um arquivo `.env.local` apenas para desenvolvimento:

```env
BACKEND_API_URL=http://localhost:8080
BACKEND_API_KEY=sua-chave-local
```

Inicie o projeto:

```bash
pnpm dev
```

Acesse [localhost:3000/chat](http://localhost:3000/chat).

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `BACKEND_API_URL` | Sim | URL base do backend, sem `/api/v1/chat` |
| `BACKEND_API_KEY` | Sim | Mesmo valor de `APP_API_KEY` configurado no backend |

Essas variáveis são exclusivas do servidor. Não use o prefixo `NEXT_PUBLIC_` e nunca versione `.env.local` ou uma chave real.

## Scripts

| Comando | Descrição |
| --- | --- |
| `pnpm dev` | Inicia o ambiente de desenvolvimento |
| `pnpm build` | Gera o build de produção |
| `pnpm start` | Executa o build de produção |
| `pnpm type-check` | Valida os tipos TypeScript |
| `pnpm lint` | Executa o ESLint |

Antes de enviar alterações, execute:

```bash
pnpm type-check
pnpm lint
pnpm build
```

## Rotas

| Rota | Finalidade |
| --- | --- |
| `/chat` | Interface principal do assistente |
| `POST /api/chat` | Proxy seguro entre o navegador e o backend |

Exemplo de requisição ao proxy:

```json
{
  "message": "O cliente está com LOS na ONU"
}
```

Resposta esperada:

```json
{
  "response": "Resposta do assistente",
  "provider": "gemini"
}
```

## Deploy na Vercel

1. Importe este repositório na Vercel.
2. Em **Settings → Environment Variables**, configure `BACKEND_API_URL` para o endereço do Railway.
3. Configure `BACKEND_API_KEY` como Secret, usando o mesmo valor de `APP_API_KEY` do backend.
4. Aplique as variáveis ao ambiente Production.
5. Faça um novo deploy para que as alterações entrem em vigor.

Após o deploy, confirme no DevTools que o navegador chama somente `/api/chat` e que nenhum cabeçalho `X-API-Key` é enviado pelo cliente.

## Estrutura principal

```text
app/
├── api/chat/route.ts      # Proxy server-side
└── chat/page.tsx          # Página do chat
src/
├── components/            # Interface e estados visuais
└── lib/
    ├── api-client.ts      # Cliente do proxy local
    ├── errors.ts          # Mensagens amigáveis de erro
    ├── markdown.ts        # Markdown simples e seguro
    └── types.ts           # Tipos compartilhados
```

## Segurança

- A chave do backend existe somente no ambiente do servidor.
- O proxy não repassa cabeçalhos enviados pelo navegador.
- As mensagens são validadas antes da chamada ao Railway.
- Respostas do backend não são armazenadas em cache.
- O projeto não possui autenticação do cliente nem histórico persistente nesta etapa.
