# BookBuddy Backend

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Copy environment variables:**
```bash
cp .env.example .env
```

3. **Update `.env` with your values:**
- `DATABASE_URL` - PostgreSQL connection string
- `MINIMAX_API_KEY` - Your MiniMax API key (get from https://platform.minimaxi.com)
- `BETTER_AUTH_SECRET` - Generate with: `openssl rand -base64 32`

4. **Set up database:**
```bash
npx prisma migrate dev --name init
```

5. **Run the server:**
```bash
npm run dev
```

## Tech Stack

- **Express** - Web framework
- **Prisma** - ORM with PostgreSQL
- **Better Auth** - Authentication (email/password, sessions)
- **AI SDK** - AI integration (MiniMax M2.5 default)

## API Routes

| Route | Description |
|-------|-------------|
| `/v1/auth/*` | Authentication (sign up, sign in, sessions) |
| `/v1/books/*` | Book management |
| `/v1/users/*` | User profiles |
| `/v1/reading-sessions/*` | Reading tracking |
| `/v1/ai/*` | AI-powered features |

## AI Features

- **POST /v1/ai/chat** - Chat with AI about books
- **POST /v1/ai/summary** - Generate book summaries
- **POST /v1/ai/insights** - Get insights from reading notes
- **POST /v1/ai/recommendations** - Get book recommendations

### Default Model
- **MiniMax M2.5** - Fast, affordable, great for text generation

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `MINIMAX_API_KEY` | Yes* | MiniMax API key |
| `OPENAI_API_KEY` | Yes* | OpenAI API key |
| `ANTHROPIC_API_KEY` | Yes* | Anthropic API key |
| `BETTER_AUTH_SECRET` | Yes | Auth encryption secret |
| `FRONTEND_URL` | No | Frontend URL for CORS |

*At least one AI provider required
