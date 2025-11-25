# System Architecture Diagram
# Zenith Student Marketplace

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Web App    │  │  Mobile Web  │  │  Admin Panel │              │
│  │  (Next.js)   │  │ (Responsive) │  │  (Next.js)   │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         │                  │                  │                       │
│         └──────────────────┴──────────────────┘                      │
│                            │                                          │
└────────────────────────────┼──────────────────────────────────────────┘
                             │
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │              Next.js Server (SSR/API Routes)                  │  │
│  │                                                               │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │  │
│  │  │    Auth     │  │  Products   │  │   Orders    │         │  │
│  │  │   Routes    │  │   Routes    │  │   Routes    │         │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘         │  │
│  │                                                               │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │  │
│  │  │  Messages   │  │  Payments   │  │   Admin     │         │  │
│  │  │   Routes    │  │   Routes    │  │   Routes    │         │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘         │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    Middleware Layer                           │  │
│  │                                                               │  │
│  │  • Authentication & Authorization                            │  │
│  │  • Error Handling & Logging                                  │  │
│  │  • Rate Limiting                                             │  │
│  │  • Request Validation                                        │  │
│  │  • Performance Monitoring                                    │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└────────────────────────────┬──────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       DATA ACCESS LAYER                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    Prisma ORM                                 │  │
│  │                                                               │  │
│  │  • Type-safe database queries                                │  │
│  │  • Migration management                                      │  │
│  │  • Connection pooling                                        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└────────────────────────────┬──────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────────────────────────────────┐             │
│  │              MySQL Database                        │             │
│  │                                                    │             │
│  │  Tables:                                           │             │
│  │  • Users              • Products                   │             │
│  │  • AccountSecurity    • Categories                 │             │
│  │  • Orders             • Payments                   │             │
│  │  • Messages           • Notifications              │             │
│  │  • UserRoles          • Conversations              │             │
│  └────────────────────────────────────────────────────┘             │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES LAYER                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   PayFast    │  │   AWS S3     │  │    Email     │              │
│  │   Payment    │  │  File Storage│  │   Service    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Sentry     │  │   Google     │  │   Vercel     │              │
│  │   Logging    │  │   Analytics  │  │   Hosting    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND COMPONENTS                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    Layout Components                        │    │
│  │  • Header          • Footer         • Sidebar              │    │
│  │  • Navigation      • Auth Provider  • Cart Provider        │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    Feature Components                       │    │
│  │                                                             │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │    │
│  │  │   Product   │  │    Cart     │  │   Search    │       │    │
│  │  │    Card     │  │   Widget    │  │     Bar     │       │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘       │    │
│  │                                                             │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │    │
│  │  │  Message    │  │ Notification│  │   Payment   │       │    │
│  │  │    List     │  │  Dropdown   │  │    Form     │       │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘       │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    UI Components (shadcn/ui)                │    │
│  │  • Button    • Input      • Card        • Dialog           │    │
│  │  • Select    • Checkbox   • Badge       • Toast            │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### User Registration Flow
```
┌──────────┐                ┌──────────┐               ┌──────────┐
│          │   1. Submit    │          │  2. Validate  │          │
│  Client  │───────────────▶│   API    │──────────────▶│ Validate │
│          │                │  Route   │               │  Schema  │
└──────────┘                └──────────┘               └────┬─────┘
     ▲                           │                          │
     │                           │                          │
     │ 6. Return                 │ 3. Create User           │
     │    Token                  ▼                          ▼
     │                      ┌──────────┐              ┌──────────┐
     │                      │          │  4. Hash     │          │
     └──────────────────────│  Prisma  │◀─────────────│  bcrypt  │
                            │   ORM    │              │          │
                            └────┬─────┘              └──────────┘
                                 │
                                 │ 5. Insert Record
                                 ▼
                            ┌──────────┐
                            │  MySQL   │
                            │ Database │
                            └──────────┘
```

### Product Purchase Flow
```
┌─────────┐  1. Browse   ┌─────────┐  2. Search   ┌──────────┐
│         │─────────────▶│         │─────────────▶│          │
│  User   │              │ Product │              │ Database │
│         │◀─────────────│  Page   │◀─────────────│          │
└─────────┘  3. Results  └─────────┘  4. Return   └──────────┘
     │
     │ 5. Add to Cart
     ▼
┌─────────┐  6. View Cart ┌─────────┐
│  Cart   │◀──────────────│  Cart   │
│  State  │               │  Page   │
└─────────┘               └────┬────┘
     │                         │
     │ 7. Checkout             │ 8. Create Order
     ▼                         ▼
┌─────────┐              ┌──────────┐
│ Payment │─────────────▶│  Order   │
│  API    │  9. Init     │   API    │
└────┬────┘              └────┬─────┘
     │                        │
     │ 10. Process            │ 11. Save Order
     ▼                        ▼
┌─────────┐              ┌──────────┐
│ PayFast │              │ Database │
│Gateway  │              └──────────┘
└────┬────┘
     │
     │ 12. Webhook
     ▼
┌─────────┐  13. Update  ┌──────────┐
│Webhook  │─────────────▶│  Order   │
│Handler  │              │  Status  │
└─────────┘              └──────────┘
```

## Database Schema Relationships

```
┌────────────┐           ┌──────────────────┐
│    User    │───────────│ AccountSecurity  │
│            │ 1:1       │                  │
│ • id       │           │ • userId         │
│ • email    │           │ • passwordHash   │
│ • name     │           │ • salt           │
└─────┬──────┘           └──────────────────┘
      │
      │ 1:N
      ├──────────────────────┐
      │                      │
      ▼                      ▼
┌────────────┐         ┌────────────┐
│  Product   │         │   Order    │
│            │         │            │
│ • sellerId │─────┐   │ • buyerId  │
│ • title    │ 1:N │   │ • amount   │
│ • price    │     │   └─────┬──────┘
└─────┬──────┘     │         │
      │            │         │ 1:1
      │ N:1        │         ▼
      │            │   ┌────────────┐
      ▼            │   │  Payment   │
┌────────────┐    │   │            │
│  Category  │    │   │ • orderId  │
│            │    │   │ • status   │
│ • name     │    │   └────────────┘
│ • slug     │    │
└────────────┘    │
                  │
                  └─────▶ ┌────────────┐
                          │   Order    │
                          │            │
                          │ • productId│
                          └────────────┘

┌────────────┐  N:1  ┌──────────────┐  1:N  ┌────────────┐
│  Message   │───────│ Conversation │───────│    User    │
│            │       │              │       │            │
│ • senderId │       │ • id         │       │ • id       │
│ • content  │       └──────────────┘       └────────────┘
└────────────┘
```

## Security Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                    Security Layers                            │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  Layer 1: HTTPS/TLS Encryption                               │
│  └─ All traffic encrypted in transit                         │
│                                                               │
│  Layer 2: Authentication                                      │
│  ├─ JWT tokens (HTTP-only cookies)                           │
│  ├─ bcrypt password hashing (12 rounds)                      │
│  └─ Session management                                       │
│                                                               │
│  Layer 3: Authorization                                       │
│  ├─ Role-based access control (RBAC)                         │
│  ├─ Resource ownership verification                          │
│  └─ Permission checks on every request                       │
│                                                               │
│  Layer 4: Input Validation                                    │
│  ├─ Schema validation (Zod)                                  │
│  ├─ SQL injection prevention (Prisma)                        │
│  ├─ XSS protection (React auto-escaping)                     │
│  └─ File upload validation                                   │
│                                                               │
│  Layer 5: Rate Limiting                                       │
│  ├─ Per-IP rate limits                                       │
│  ├─ API endpoint throttling                                  │
│  └─ Brute force protection                                   │
│                                                               │
│  Layer 6: Data Protection                                     │
│  ├─ Separate security table for credentials                  │
│  ├─ Field-level encryption for sensitive data                │
│  └─ Database backups & replication                           │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Deployment Architecture (Production)

```
┌─────────────────────────────────────────────────────────────────┐
│                         CDN Layer                               │
│                   (Vercel Edge Network)                         │
│  • Static assets caching                                        │
│  • Image optimization                                           │
│  • Global distribution                                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Application Servers                          │
│                   (Vercel Serverless)                           │
│                                                                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐              │
│  │   Region   │  │   Region   │  │   Region   │              │
│  │   US-East  │  │   Europe   │  │   Asia     │              │
│  └────────────┘  └────────────┘  └────────────┘              │
│                                                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Database Cluster                              │
│                   (PlanetScale / RDS)                           │
│                                                                 │
│  ┌────────────┐           ┌────────────┐                      │
│  │  Primary   │   Sync    │  Replica   │                      │
│  │  Database  │◀─────────▶│  Database  │                      │
│  └────────────┘           └────────────┘                      │
│                                                                 │
│  • Automatic failover                                          │
│  • Point-in-time recovery                                      │
│  • Automated backups                                           │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **State Management**: React Context + Hooks
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Fetch API

### Backend
- **Runtime**: Node.js 20
- **Framework**: Next.js API Routes
- **Database ORM**: Prisma
- **Authentication**: JWT + HTTP-only cookies
- **Validation**: Zod schemas
- **File Upload**: Multipart form-data

### Database
- **Primary**: MySQL 8.0
- **ORM**: Prisma
- **Migrations**: Prisma Migrate
- **Connection Pool**: Prisma Connection Pool

### DevOps
- **Hosting**: Vercel
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry
- **Analytics**: Google Analytics
- **Version Control**: Git + GitHub

### Testing
- **Unit Tests**: Jest
- **Integration Tests**: Jest + Supertest
- **E2E Tests**: Playwright
- **Coverage**: Jest Coverage
