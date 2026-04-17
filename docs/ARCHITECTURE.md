# Project Architecture

## System Overview

```mermaid
flowchart TB
    subgraph Client["Client Layer"]
        Browser["Browser"]
        NextUI["Next.js UI"]
        Components["React Components"]
        State["Zustand State"]
    end

    subgraph Server["Server Layer"]
        AppRouter["App Router"]
        APIRoutes["API Routes"]
        Auth["NextAuth.js"]
        Middleware["Middleware"]
    end

    subgraph Data["Data Layer"]
        ORM["Drizzle ORM"]
        DB[(PostgreSQL)]
        Cache[(Redis)]
    end

    subgraph External["External Services"]
        AI["AI APIs"]
        Crawler["Firecrawl"]
        Unstructured["Unstructured.io"]
    end

    Browser --> NextUI
    NextUI --> Components
    Components --> State
    NextUI --> AppRouter
    AppRouter --> APIRoutes
    APIRoutes --> Auth
    Auth --> Middleware
    APIRoutes --> ORM
    ORM --> DB
    ORM --> Cache
    APIRoutes --> AI
    APIRoutes --> Crawler
    APIRoutes --> Unstructured
```

## Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant API as API Route
    participant S as Server Action
    participant DB as Database

    U->>C: Action (click/submit)
    C->>API: HTTP Request
    API->>S: Validate & Process
    S->>DB: Query/Mutate
    DB-->>S: Result
    S-->>API: Response
    API-->>C: JSON Response
    C-->>U: UI Update
```

## Component Hierarchy

```mermaid
graph TD
    Root["Root Layout"] --> App["App Layout"]
    App --> Nav["Navigation"]
    App --> Main["Main Content"]

    Main --> Pages["Page Routes"]
    Pages --> Dashboard["Dashboard"]
    Pages --> Knowledge["Knowledge Base"]
    Pages --> Settings["Settings"]

    Dashboard --> Widgets["Widgets"]
    Widgets --> Stats["Stats Card"]
    Widgets --> Chart["Charts"]
    Widgets --> List["Item Lists"]

    Knowledge --> Search["Search"]
    Knowledge --> Tree["Document Tree"]
    Knowledge --> Editor["Document Editor"]
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant N as NextAuth
    participant DB as Database

    U->>C: Click Login
    C->>N: SignIn Request
    N->>DB: Validate Credentials
    DB-->>N: User Data
    N-->>C: Session Token
    C-->>U: Authenticated UI

    Note over C,N: Session maintained via JWT
```

## State Management

```mermaid
graph LR
    subgraph Global["Global State"]
        User["User Store"]
        UI["UI Store"]
        Config["Config Store"]
    end

    subgraph Local["Local State"]
        Form["Form State"]
        Component["Component State"]
    end

    subgraph Server["Server State"]
        RSC["React Server Components"]
        Query["TanStack Query"]
    end

    User --> Components
    UI --> Components
    Config --> Components
    Form --> Forms
    Component --> Components
    RSC --> Pages
    Query --> Components
```

## Build & Deploy Pipeline

```mermaid
flowchart LR
    Dev["Development"] --> Lint["Lint & Type Check"]
    Lint --> Test["Unit Tests"]
    Test --> Build["Next.js Build"]
    Build --> E2E["E2E Tests"]
    E2E --> Deploy["Deploy"]

    subgraph Quality Gates
        Lint
        Test
        E2E
    end
```

## Module Dependencies

```mermaid
graph TB
    subgraph Core["Core Modules"]
        Utils["lib/utils.ts"]
        Types["types/"]
        Config["next.config.js"]
    end

    subgraph Features["Feature Modules"]
        Auth["lib/auth.ts"]
        DB["db/"]
        API["app/api/"]
    end

    subgraph UI["UI Modules"]
        Components["components/"]
        Styles["tailwind.config.ts"]
    end

    Utils --> Features
    Types --> Features
    Types --> UI
    Config --> All["All Modules"]
    Auth --> API
    DB --> API
```

## Database Schema (Simplified)

```mermaid
erDiagram
    USERS ||--o{ DOCUMENTS : creates
    USERS ||--o{ SESSIONS : has
    DOCUMENTS ||--o{ CHUNKS : contains
    DOCUMENTS ||--o{ EMBEDDINGS : has

    USERS {
        string id PK
        string email
        string name
        timestamp created_at
    }

    DOCUMENTS {
        string id PK
        string user_id FK
        string title
        string content
        timestamp created_at
    }

    CHUNKS {
        string id PK
        string document_id FK
        string content
        int index
    }

    EMBEDDINGS {
        string id PK
        string chunk_id FK
        vector embedding
    }

    SESSIONS {
        string id PK
        string user_id FK
        timestamp expires
    }
```

## Database Migration System

```mermaid
flowchart TB
    subgraph Schema["Schema Layer"]
        TS["schema.ts<br/>TypeScript Definitions"]
    end

    subgraph Generator["Migration Generator"]
        DK["drizzle-kit<br/>Generate SQL"]
        SQL["0001_add_column.sql<br/>Migration Files"]
        META["meta/<br/>Snapshots"]
    end

    subgraph Deploy["Deployment"]
        MIGRATE["db:migrate<br/>Apply Changes"]
        DB[("PostgreSQL<br/>Database")]
    end

    TS --> DK
    DK --> SQL
    DK --> META
    SQL --> MIGRATE
    MIGRATE --> DB
```

### Migration Architecture

**Schema-First Design**: Define database schema in TypeScript, Drizzle Kit auto-generates SQL migrations.

**Auto-Generation**: When schema changes, run `npm run db:generate` to create migration files.

**Auto-Apply on Deploy**: Migrations run automatically during build via `prebuild` script.

**File Naming**: `0001_description.sql` - Sequential numbers ensure proper order.

### Migration Commands

| Command       | Purpose                        | Auto-Runs   |
| ------------- | ------------------------------ | ----------- |
| `db:generate` | Create SQL from schema changes | postinstall |
| `db:migrate`  | Apply pending migrations       | prebuild    |
| `db:studio`   | Browse/edit data               | Manual      |
| `db:reset`    | Wipe + migrate + seed          | Manual      |

### Migration Flow

1. **Developer** changes `@c:\Users\seoho\Documents\Corporate Brain\lib\db\schema.ts`
2. **Generate**: `npm run db:generate` creates `db/migrations/000X_description.sql`
3. **Commit**: Migration files committed to git
4. **Deploy**: `prebuild` runs `db:migrate` to apply changes
5. **Seed**: Then `db:seed` inserts initial data

---

## Database Seed System

```mermaid
flowchart TB
    subgraph Seeds["db/seeds/"]
        Runner["seed-runner.ts<br/>Master Orchestrator"]
        Tenant["seed-tenants.ts"]
        User["seed-users.ts"]
        Knowledge["seed-knowledge-sources.ts"]
        Conversation["seed-conversations.ts"]
        Integration["seed-integrations.ts"]
    end

    subgraph Execution["Deployment"]
        Build["Build Process"]
        Migrate["Run Migrations"]
        Seed["Auto-Seed"]
        App["Application Ready"]
    end

    Runner --> Tenant
    Tenant --> User
    Tenant --> Knowledge
    Tenant --> Integration
    User --> Conversation

    Build --> Migrate
    Migrate --> Seed
    Seed --> App
```

### Seed Architecture

**Idempotent Design**: Every seed script checks for existing data before inserting. Safe to run multiple times without duplicates.

**Execution Order**:

1. `seed-tenants` - No dependencies
2. `seed-users` - Requires tenant
3. `seed-knowledge-sources` - Requires tenant
4. `seed-integrations` - Requires tenant
5. `seed-conversations` - Requires tenant + user

**Auto-Deployment**: Seeds run automatically during deployment via `npm run db:seed` which executes after migrations.

**Naming Convention**: `seed-{plural-noun}.ts` (e.g., `seed-users.ts`, `seed-materials.ts`)

### Commands

```bash
npm run db:seed      # Run all seeds
npm run db:reset     # Wipe, migrate, seed
npm run db:migrate   # Migrations only
```
