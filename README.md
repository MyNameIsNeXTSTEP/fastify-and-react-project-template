## Fastify and ReactJS project template

### Backend:
(TypeScript / JavaScript)
- Fastify
- PostgreSQL
- Kysely
- Dokcer Compose

### Frontend
(TypeScript / JavaScript)
- ReactJS
- Vite
- MobX
- UI lib (to be defined later)

## Get started
### Prerequisites
- Node.js (v20 or higher)
- Yarn package manager v4.6.0 & Corepack enabled
- Docker and Docker Compose

### Quick Start

**Before working - copy environment file:**
   ```bash
   cp .env.example .env
   ```
   *Then edit `.env` file with your specific configuration values if needed*\
   *(not recommended until passing the instructions and getting familiar with the project)*

1. **Install dependencies:**
   ```bash
   yarn install
   ```


2. **Start the database:**
   ```bash
   yarn db:build
   yarn db:up
   ```

3. **Run database migrations:**
   ```bash
   yarn db:migrate:latest
   ```

4. **Start development servers:**
   
   **Option A: Start both client and server separately**
   ```bash
   # Terminal 1 - Start server
   yarn server:dev
   
   # Terminal 2 - Start client
   yarn client:dev
   ```
   
   **Option B: Or use individual commands**
   ```bash
   yarn server:dev    # Start server in development mode
   yarn client:dev    # Start client in development mode
   ```

### Production Build

1. **Build applications:**
   ```bash
   yarn server:build
   yarn client:build
   ```

2. **Start production servers:**
   ```bash
   yarn server:start
   yarn client:start
   ```

### Database Commands
- `yarn db:build` - Build database container
- `yarn db:up` - Start database container
- `yarn db:down` - Stop database container
- `yarn db:migrate:up` - Run single migration
- `yarn db:migrate:latest` - Run all pending migrations
- `yarn db:rollback` - Rollback last migration
- `yarn db:seed:run` - Run database seeds

### Development Commands
- `yarn lint` - Run linter
- `yarn lint:fix` - Fix linting issues
- `yarn lint:all` - Lint entire codebase
