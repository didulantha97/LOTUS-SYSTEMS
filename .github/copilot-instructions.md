# GitHub Copilot Instruction File
## Project: Multi-Product Provisioning Platform for Isolated Customer Deployments

Use this file as the primary implementation instruction for GitHub Copilot when generating code, architecture, modules, and project scaffolding.

---

## 1. Project Goal
Build a production-oriented web platform that sells and provisions multiple software systems, starting with a Smart POS System.

The platform must allow customers to:
- browse multiple products from one marketplace website
- choose a product plan
- buy a new domain or connect an existing domain
- buy a dedicated database or connect their own database
- complete signup and checkout
- automatically provision an isolated environment for that customer
- access their own deployed system through their own domain

Important:
- this platform itself must NOT depend on Salesforce
- the platform must have its own admin dashboard and customer portal
- Salesforce is only an optional integration inside products that need it
- each customer must have a separate deployment and separate database
- do not use a shared multi-tenant runtime for customer product data

---

## 2. High-Level Architecture
Build the system with 3 major layers:

### A. Marketplace Website
Purpose:
- public website for all products
- pricing pages
- product detail pages
- signup and login
- checkout
- onboarding wizard

### B. Control Plane / Admin Platform
Purpose:
- manage customers
- manage products and plans
- manage subscriptions and orders
- manage domains
- manage dedicated databases
- manage provisioning jobs
- manage deployments
- manage environment lifecycle
- provide admin dashboard and customer portal

### C. Product Runtime Environments
Purpose:
- isolated environment per customer
- separate frontend
- separate backend
- separate database
- separate domain
- separate secrets and config

---

## 3. Technical Stack
Use the following stack unless a strong technical reason exists to change it:

### Frontend
- Next.js for marketplace website and customer/admin portal
- React for product frontend applications
- TypeScript everywhere on frontend
- Tailwind CSS for styling
- component-driven architecture

### Backend
- Spring Boot for control plane APIs
- Spring Boot for product backend services
- REST APIs
- use DTOs, service layer, repository layer, configuration layer, and integration adapters

### Databases
- PostgreSQL for platform metadata and control plane
- dedicated database per customer for product runtime
- keep platform data separate from product operational data

### Payments
- Stripe Checkout
- Stripe webhooks for post-payment provisioning triggers

### Domain Management
- provider abstraction for domain operations
- initial provider can be Route 53
- support both:
  - buy new domain
  - connect existing domain

### Database Provisioning
- provider abstraction for database creation
- initial provider can be Neon or another API-driven DB provider
- support both:
  - provision dedicated database
  - connect customer-provided database

### Infrastructure / Deployment
- Dockerized services
- deployment templates per customer environment
- isolated deployment for each customer product instance
- support future Terraform / Kubernetes integration

### Secrets / Security
- use secure secret storage abstraction
- never store raw secrets in plain text
- isolate credentials per customer environment

---

## 4. Non-Functional Requirements
Always generate code with these qualities:
- production-oriented structure
- clean architecture
- modularity
- strong separation of concerns
- scalability
- maintainability
- idempotent provisioning steps
- retryable background jobs
- audit logging
- secure defaults
- testability

Do not generate demo-only code unless clearly marked.
Do not hardcode credentials.
Do not build everything in a single service class.
Do not tightly couple domain, billing, provisioning, and deployment logic.

---

## 5. Core Functional Modules
Generate the platform around the following modules.

### 5.1 Product Catalog Module
Features:
- list products
- product details
- pricing plans
- add-ons
- feature lists
- versioning support

Entities:
- Product
- ProductVersion
- Plan
- AddOn
- Feature

### 5.2 Customer & Identity Module
Features:
- customer registration
- login
- role-based access
- admin users
- customer portal users

Entities:
- Customer
- CustomerUser
- Role
- Permission
- Session

### 5.3 Orders & Billing Module
Features:
- create checkout session
- order creation
- subscription tracking
- invoice history
- payment event processing
- renewal state handling

Entities:
- Order
- OrderItem
- Subscription
- Invoice
- PaymentEvent

### 5.4 Domain Management Module
Features:
- check domain availability
- purchase domain via provider integration
- connect existing domain
- DNS verification workflow
- domain lifecycle statuses

Entities:
- Domain
- DomainPurchaseRequest
- DnsRecord
- DomainVerification

### 5.5 Database Management Module
Features:
- provision dedicated database
- connect existing customer database
- credential reference management
- migration tracking
- readiness checks

Entities:
- DatabaseProvider
- DatabaseInstance
- DatabaseCredentialRef
- DatabaseMigration

### 5.6 Provisioning Orchestration Module
Features:
- create provisioning job after successful payment
- step-based provisioning workflow
- retries and failure tracking
- status transitions
- full audit log

Entities:
- ProvisioningJob
- ProvisioningStep
- EnvironmentConfig
- DeploymentTarget

### 5.7 Environment Management Module
Features:
- customer environment record
- deployment metadata
- runtime config
- health status
- environment suspension / activation

Entities:
- TenantEnvironment
- RuntimeConfig
- DeploymentRecord
- EnvironmentHealth

### 5.8 Support & Admin Operations Module
Features:
- admin dashboard
- customer support notes
- operational logs
- environment lookup
- manual retry / rerun provisioning

Entities:
- SupportRequest
- AuditLog
- AdminActionLog
- TenantEvent

---

## 6. Product Integration Principle
The marketplace platform itself must NOT require Salesforce.

Rule:
- platform management logic runs entirely in our own app
- Salesforce is optional only inside products that need it

Examples:
- POS product may later push business events to Salesforce
- another product may sync accounts or orders to Salesforce
- this must be built as a plug-in/integration module per product, not as a core platform dependency

---

## 7. Provisioning Lifecycle
Generate provisioning logic as a step-based state machine.

Suggested statuses:
- ORDER_CREATED
- PAYMENT_PENDING
- PAYMENT_CONFIRMED
- DOMAIN_IN_PROGRESS
- DATABASE_IN_PROGRESS
- DEPLOYMENT_IN_PROGRESS
- MIGRATION_IN_PROGRESS
- HEALTHCHECK_IN_PROGRESS
- ACTIVE
- FAILED
- SUSPENDED
- CANCELLED

Provisioning steps should include:
1. create customer tenant record
2. validate chosen product and plan
3. process domain action
4. process database action
5. generate environment config
6. create secure secret references
7. deploy isolated frontend
8. deploy isolated backend
9. connect database
10. run schema migrations
11. seed starter data
12. verify health
13. activate environment
14. notify customer

Requirements:
- each step must be idempotent
- retries must be safe
- failures must be logged clearly
- status must be queryable from admin and customer portal

---

## 8. API Design Principles
Generate well-structured REST APIs with clear DTOs, validation, and error handling.

### Public APIs
- GET /api/products
- GET /api/products/{slug}
- GET /api/plans/{productId}
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/domain/check
- POST /api/checkout/session

### Customer Portal APIs
- GET /api/me
- GET /api/my-orders
- GET /api/my-subscriptions
- GET /api/my-environments
- GET /api/my-domains
- GET /api/my-databases
- GET /api/provisioning-jobs/{id}

### Internal APIs
- POST /internal/provisioning/start
- POST /internal/provisioning/domain
- POST /internal/provisioning/database
- POST /internal/provisioning/deploy
- POST /internal/provisioning/activate

### Webhooks
- POST /webhooks/stripe
- POST /webhooks/domain-provider
- POST /webhooks/deployment-provider

Requirements:
- input validation
- consistent response wrapper when appropriate
- proper HTTP status codes
- centralized exception handling
- correlation IDs for traceability

---

## 9. Folder Structure
Generate the repository with a clean monorepo-style structure.

```text
marketplace-platform/
├── apps/
│   ├── web/                          # Next.js marketplace + portal
│   ├── control-plane-api/            # Spring Boot backend
│   ├── provisioning-worker/          # background worker service
│   └── product-pos-template/         # product runtime template starter
│
├── packages/
│   ├── shared-types/
│   ├── ui-components/
│   ├── billing-sdk/
│   ├── domain-sdk/
│   ├── database-sdk/
│   └── provisioning-sdk/
│
├── infrastructure/
│   ├── docker/
│   ├── terraform/
│   ├── kubernetes/
│   ├── scripts/
│   └── environments/
│
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── provisioning/
│   ├── runbooks/
│   └── decisions/
│
└── .github/
    └── copilot-instructions.md
```

Also generate an isolated product template structure like this:

```text
product-pos-template/
├── frontend/
├── backend/
├── database/
│   ├── migrations/
│   └── seeds/
├── deployment/
│   ├── docker/
│   ├── templates/
│   └── env/
└── docs/
```

---

## 10. Coding Standards
### Frontend
- use TypeScript
- use feature-based folder structure
- use reusable UI components
- use forms with validation
- use API service layer
- use clean state management
- avoid business logic directly inside page components

### Backend
- use controller -> service -> repository layering
- use DTOs and mapper classes
- use configuration classes for provider integrations
- use interfaces for provider abstractions
- use background job handlers for long-running provisioning
- include integration tests for critical flows

### Database
- use migration scripts
- use explicit indexes where appropriate
- use audit columns on critical tables
- avoid storing secrets directly

---

## 11. Security Requirements
Generate the code with these requirements:
- isolated customer environments
- separate database per customer runtime
- secure handling of provider credentials
- encrypted secret references
- role-based access for admin and customer users
- webhook signature verification
- audit logging for provisioning and admin actions
- no exposure of sensitive config in frontend
- environment-specific config loading

---

## 12. UX Requirements
The website and dashboards should look modern and professional.

Pages to generate:
- landing page
- product catalog page
- product detail page
- pricing page
- signup/login pages
- checkout flow
- onboarding wizard
- customer dashboard
- admin dashboard
- environment detail page
- provisioning status page
- domain setup page
- database setup page

Admin dashboard sections:
- products
- plans
- customers
- orders
- subscriptions
- domains
- databases
- provisioning jobs
- environments
- support logs

Customer portal sections:
- my products
- my subscriptions
- my environments
- domain status
- database status
- billing history
- onboarding status

---

## 13. MVP Priority
Build the MVP in this order:

### Phase 1
- product catalog
- signup/login
- Stripe checkout integration
- order creation
- customer dashboard
- admin dashboard
- provisioning job framework
- isolated POS deployment template

### Phase 2
- domain purchase/connect flow
- dedicated database purchase/connect flow
- environment activation flow
- provisioning status tracking

### Phase 3
- support tooling
- advanced billing states
- optional product-level Salesforce integration
- additional products beyond POS

---

## 14. What Copilot Should Optimize For
When generating code, always optimize for:
- extensibility for many products
- isolation per customer runtime
- provider abstraction for domain and database services
- maintainability
- enterprise-friendly design
- future support for white-label or reseller workflows

---

## 15. What Copilot Must Avoid
Do NOT:
- build the platform around Salesforce
- use one shared product database for all customers
- mix platform admin data with customer operational runtime data
- hardcode provider implementations everywhere
- create giant controller or giant service classes
- skip retry and failure handling for provisioning
- assume demo data architecture is production architecture

---

## 16. Expected Deliverables from Copilot
Generate:
- full repository scaffold
- initial database schema
- backend entities and DTOs
- REST API endpoints
- frontend pages and dashboard layout
- Stripe integration skeleton
- domain provider abstraction
- database provider abstraction
- provisioning workflow framework
- environment management model
- admin and customer dashboards
- starter product POS template
- README with local setup instructions

---

## 17. Final Instruction
Treat this as a serious production-capable marketplace and provisioning platform, not a sample app.

Start with clean scaffolding and end-to-end flow for one product, but design everything so additional products can be added later without major rework.