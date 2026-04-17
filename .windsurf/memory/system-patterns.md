# System Patterns

## Design Patterns in Use

### 1. Component Patterns

#### Compound Components

Used for complex UI components with multiple related parts.

```typescript
// Example: Modal compound component
<Modal>
  <Modal.Trigger>Open</Modal.Trigger>
  <Modal.Content>
    <Modal.Header>Title</Modal.Header>
    <Modal.Body>Content</Modal.Body>
    <Modal.Footer>Actions</Modal.Footer>
  </Modal.Content>
</Modal>
```

#### Render Props

For flexible component composition.

#### Custom Hooks

All data fetching and side effects encapsulated in hooks.

### 2. Data Patterns

#### Repository Pattern

Database access abstracted through repository layer.

```typescript
// lib/repositories/user-repository.ts
export const UserRepository = {
  findById: async (id: string) => { ... },
  create: async (data: CreateUserInput) => { ... },
  // ...
};
```

#### DTO Pattern

Separate types for API inputs/outputs vs database models.

### 3. State Patterns

#### Atomic State

Small, composable state atoms with Zustand.

```typescript
// stores/user-store.ts
export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
```

#### Selector Pattern

Optimize re-renders with fine-grained selectors.

### 4. API Patterns

#### Route Handler Pattern

Consistent API route structure.

```typescript
// app/api/users/route.ts
export async function GET(request: Request) {
  // Validate query params
  // Fetch data
  // Return formatted response
}

export async function POST(request: Request) {
  // Validate body
  // Create record
  // Return formatted response
}
```

### 5. Form Patterns

#### Controlled Forms

All forms use React Hook Form with Zod validation.

```typescript
const form = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: { ... },
});
```

### 6. Error Handling Patterns

#### Error Boundaries

React error boundaries for component-level errors.

#### API Error Interceptors

Centralized API error handling.

#### User Feedback

Toast notifications for async operations.

### 7. Caching Patterns

#### SWR Pattern

Stale-while-revalidate for client-side caching.

#### Route Cache

Next.js route segment caching strategies.

## File Naming Conventions

| Type       | Pattern              | Example                |
| ---------- | -------------------- | ---------------------- |
| Components | PascalCase           | `UserCard.tsx`         |
| Hooks      | camelCase with 'use' | `useAuth.ts`           |
| Utilities  | camelCase            | `formatDate.ts`        |
| Types      | PascalCase           | `UserTypes.ts`         |
| Constants  | UPPER_SNAKE_CASE     | `API_ENDPOINTS.ts`     |
| Styles     | kebab-case           | `user-card.module.css` |

## Code Organization Principles

1. **Cohesion**: Related code lives together
2. **Single Responsibility**: One file, one purpose
3. **Dependency Inversion**: Depend on abstractions
4. **DRY**: Don't repeat yourself
5. **Explicit over Implicit**: Clear, readable code
