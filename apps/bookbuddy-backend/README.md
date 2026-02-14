# BookBuddy Setup

## Quick Start

### 1. Start Database
```bash
cd apps/bookbuddy-backend
docker-compose up -d
```

### 2. Copy env file
```bash
cp .env.example .env
# Edit .env with your keys
```

### 3. Generate Prisma Client & Migrate
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Start Server
```bash
npm run dev
```

### 5. Frontend (new terminal)
```bash
cd apps/bookbuddy-frontend
# Add BASE_URL=http://localhost:3001 to .env
npx expo start
```

## Env Vars Needed
- DATABASE_URL (auto with docker-compose)
- BETTER_AUTH_SECRET (32+ chars)
- GOOGLE_API_KEY (for book search)
- MINIMAX_API_KEY (for AI chat)
