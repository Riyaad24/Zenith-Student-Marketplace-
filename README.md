# Zenith Student Marketplace

A full-stack marketplace for students to buy/sell textbooks, notes, electronics, and tutoring services. This repository contains the frontend Next.js application (`Zenith-OG`), a small `backend/` service, database schema and Prisma migrations, documentation, and scripts used while developing and operating the platform.

## Contents
- `Zenith-OG/` — Next.js (App Router) frontend and API routes (main web app). Uses Next.js 14, TypeScript, Tailwind, Prisma and stores uploads under `public/uploads/` (development).
- `backend/` — backend service utilities and scripts.
- `.github/workflows/` — CI workflows (typecheck + build, CI/CD).
- `prisma/` — Prisma schema and migrations.
- `Zenith-OG/__tests__/` and `Zenith-OG/tests/` — unit and integration tests.
- Documentation files like `ARCHITECTURE_DIAGRAM.md`, `DOCUMENTATION_INDEX.md`, and `Zenith-OG/ADMIN_MANAGEMENT_GUIDE.md`.

## Quickstart (development)
Prerequisites:
- Node.js 22.x (or compatible), npm
- A MySQL server for Prisma (or a Docker container)

1. Clone the repo:

```powershell
git clone https://github.com/Riyaad24/Zenith-Student-Marketplace-.git
cd Zenith-Student-Marketplace-/Zenith-OG
```

2. Install dependencies:

```powershell
npm install
```

3. Configure environment variables
- Create `.env.local` in `Zenith-OG/` with at minimum:

```
DATABASE_URL="mysql://user:pass@host:3306/zenith_marketplace"
JWT_SECRET=your-jwt-secret
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
# any other env keys referenced in `Zenith-OG/.env` or docs
```

4. Run database migrations / generate Prisma client:

```powershell
npx prisma generate
npx prisma migrate deploy   # or `prisma migrate dev` for local dev
```

5. Start dev server:

```powershell
npm run dev
```

The app will be available at `http://localhost:3000` by default.

## Production build
From the `Zenith-OG` folder:

```powershell
npm ci
npm run build
npm start  # or run under a process manager like PM2
```

Notes:
- The project uses HttpOnly cookies for authentication; ensure `JWT_SECRET` and cookie settings are set in production.
- Many API routes access request cookies/headers and are marked dynamic. Keep Next runtime considerations in mind.

## Tests & Typecheck
- Run type-only check:

```powershell
cd Zenith-OG
npx tsc --noEmit
```

- Run tests (if configured):

```powershell
cd Zenith-OG
npm test
```

There are unit and integration tests under `Zenith-OG/__tests__`.

## CI / GitHub Actions
This repo contains CI workflows under `.github/workflows/` that run TypeScript checks and build on pushes/PRs. Review `.github/workflows/ci.yml` and `.github/workflows/ci-cd.yml` for details.

## Recommended production changes
- Move user uploads and large binary files out of the repository to object storage (S3, Azure Blob, or similar) and serve via CDN. The repo currently contains uploaded files under `Zenith-OG/public/uploads/` which should not be committed in production history.
- Add stricter CI checks (lint + typecheck + tests) as required status checks.
- Add monitoring/alerts for background jobs and DB performance.

## Where to look next
- Admin portal code: `Zenith-OG/app/admin/...`
- API routes: `Zenith-OG/app/api/...`
- Docs & guides: `Zenith-OG/` root and repo-level markdown files (`DOCUMENTATION_INDEX.md`, `ADMIN_MANAGEMENT_GUIDE.md`, etc.)

## License
See repository owner for license details (none added by default).

If you want, I can expand this README with deploy examples (Docker, Azure Static Web Apps, Vercel), add a quick `Makefile` or `dev` script, or create a short troubleshooting section. Which would you prefer next?

## Azure Deployment Example
These instructions show a simple way to deploy the Next.js app (`Zenith-OG`) to Azure App Service and use Azure Blob Storage for user uploads. They are templates — adjust service names, resource group and secrets to your environment.

1) Prepare Azure resources

```powershell
# login
az login

# create resource group
az group create --name zenith-rg --location "South Africa West"

# create app service plan
az appservice plan create --name zenith-plan --resource-group zenith-rg --sku P1V2 --is-linux

# create web app
az webapp create --resource-group zenith-rg --plan zenith-plan --name zenith-marketplace --runtime "NODE|22-lts"

# create storage account for uploads
az storage account create --name zenithstorageacct --resource-group zenith-rg --sku Standard_LRS --location "South Africa West"
az storage container create --name uploads --account-name zenithstorageacct --public-access blob
```

2) Configure secrets / app settings

```powershell
# set connection strings and app settings on the web app
az webapp config appsettings set --resource-group zenith-rg --name zenith-marketplace --settings \
	DATABASE_URL="<your-db-connection>" JWT_SECRET="<your-jwt-secret>" AZURE_STORAGE_ACCOUNT=zenithstorageacct AZURE_STORAGE_CONTAINER=uploads
```

3) Build & Deploy

Use the GitHub Actions workflow (example added under `.github/workflows/azure_deploy.yml`) or deploy from local:

```powershell
cd Zenith-OG
npm ci
npm run build
zip -r app.zip .next package.json public node_modules
az webapp deployment source config-zip --resource-group zenith-rg --name zenith-marketplace --src app.zip
```

4) Upload existing uploads to Azure Blob and update DB

Use `az storage blob upload-batch` to upload files under `Zenith-OG/public/uploads` and then update product/user records to point to blob URLs. See `MIGRATION_PLAN.md` for a full migration plan.

## Troubleshooting (short)
- Build fails with "Dynamic server usage" warnings: ensure API routes that read request cookies/headers are marked `export const dynamic = 'force-dynamic'`.
- Missing env var errors: create `.env.local` in `Zenith-OG/` and add `DATABASE_URL` and `JWT_SECRET`.
- Images not found in production: confirm upload storage (public/uploads) is available; consider migrating to Azure Blob and update image URLs in DB.
- Unexpected 401 from admin API: ensure cookie auth is enabled and `JWT_SECRET` matches on all deployed instances; confirm cookies are sent by client (SameSite & Secure in production).

## Makefile & dev helper scripts
I added a minimal `Makefile` at the repo root and simple dev helper scripts under `scripts/` to simplify common tasks.

Usage examples:

```powershell
# from repo root
make install        # install deps for the app
make dev            # starts dev server in Zenith-OG
make build          # build the Next.js app
make tag            # create release candidate tag (local)

# or run helper script on Windows PowerShell
./scripts/dev.ps1
```

## Cleaning large files and preparing migration
Large uploaded files currently exist under `Zenith-OG/public/uploads/`. I added a `MIGRATION_PLAN.md` describing recommended steps to migrate those files to Azure Blob Storage, update database references, and remove large binaries from git history using `git filter-repo` or BFG. Review and follow that plan before running history-rewrite commands.
