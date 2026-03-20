# NotesMG AI

A full-stack, AI-powered note-taking application. This project utilizes a modern React frontend along with a Node.js/Express backend that leverages Prisma ORM and local offline AI models for semantic search using `@xenova/transformers`.

## Deliverables

- **GitHub Repository**: Contains the complete source code for the frontend, backend, and Docker orchestration setup.
- **README File**: (You are reading it) Contains detailed instructions on how to run the project, assumptions made, and future improvements.
- **Docker Setup**: Fully containerized environment for seamless deployment of the database, backend, and frontend.

---

## Tech Stack

**Frontend**
- React (Vite)
- React Router DOM
- Axios
- SweetAlert2 & React Hot Toast for notifications
- React Icons

**Backend**
- Node.js 20+
- Express 5
- Prisma ORM
- PostgreSQL
- `express-session` & `connect-pg-simple` (session-based authentication)
- `@xenova/transformers` (local sequence embeddings for AI search)

---

## How to Run the Project

The easiest way to get the project running is via Docker Compose. This ensures all services (PostgreSQL, Node Backend, and React Frontend) boot up natively.

### Prerequisites
- Docker & Docker Compose
- Node.js (Optional, if running locally without Docker)

### Running with Docker (Recommended)

1. **Clone the repository** (if not already done) and open a terminal in the root folder.
2. **Create the shared Docker network**:
   ```bash
   docker network create notes_network
   ```
3. **Start the containers**:
   ```bash
   docker compose up
   ```
   *Note: If you run into database authentication issues (`P1000: Authentication failed`), or if you have old conflicting Docker volumes, run `docker compose down -v` to reset your volumes before running the build command.*

3. **Access the application**:
   - **Frontend UI**: `http://localhost:3000`
   - **Backend API**: `http://localhost:8080`
   - **PostgreSQL Database**: Exposed on host port `5433`

The database schema will automatically be pushed and instantiated by the backend (`npx prisma db push`) upon startup, and all dependencies (including OpenSSL for the Alpine images) are handled automatically in the `Dockerfile`.

### Running Locally (Without Docker)

If you prefer to run the services bare-metal:

1. **Start a PostgreSQL Instance**:
   - Ensure a database named `notesmg` exists.
2. **Configure Backend**:
   - `cd backend`
   - `npm install`
   - Create a `.env` file or export your variables (e.g., `DATABASE_URL="postgresql://postgres:123@localhost:5432/notesmg"`).
   - Run `npx prisma db push` to initialize the database tables.
   - Run `npm run dev` to start the backend.
3. **Configure Frontend**:
   - `cd frontend`
   - `npm install`
   - Run `npm run dev` to start the frontend development server.

---

## AI Search & Scoring Logic

The search endpoint (`/api/notes/search`) uses a robust hybrid scoring approach to retrieve notes, combining local AI embeddings with algorithmic keyword matching to guarantee relevancy:

1. **Semantic Context Scoring**: 
   The local `@xenova/transformers` pipeline generates pre-normalized unit vectors for each note when it is created. When you search, the AI generates a multi-dimensional vector from your search string. A pure dot-product computation (Cosine Similarity) is calculated to determine the conceptual semantic link between the two.
2. **Keyword Augmentation bypass**: 
   If a query is deemed meaningful (≥ 3 characters), the algorithm parses exact-text overlaps. Substring matches directly inside a note's Title inject a `+0.5` highly relevant score bonus, while matches inside the body Content provide a `+0.25` bonus. Single-letter text anomalies are bypassed to prevent substring-match spam.
3. **Strict Inclusion Threshold**: 
   Because smaller transformer models (`all-MiniLM-L6-v2`) frequently attribute minor baseline similarities (`~0.15 - 0.25`) to unrelated sentences due to matching grammar or stop words, the engine completely discards any resulting score **below `0.40`**. This threshold mathematically guarantees that unless a note has a definitive conceptual link OR a direct keyword bypass, it is not presented to the user.

---

## Assumptions Made During Development

- **Local AI Execution**: To avoid API rate limits, privacy concerns, and external network latency, the app assumes running the embeddings locally using `@xenova/transformers` is better than relying on remote APIs (like HuggingFace or OpenAI). The initial load might be slightly slower while the model downloads, but subsequent searches are completely offline and private.
- **Session-based Authentication**: JSON Web Tokens (JWT) were bypassed in favor of secure, HTTP-only session cookies backed by PostgreSQL (`connect-pg-simple`). This provides better security out-of-the-box against XSS token harvesting and allows for easier session management/invalidation.
- **Development Environment Config**: The backend dynamically accepts any CORS origin. This assumes the current runtime is strictly a development/testing environment. 
- **PostgreSQL Intramural Networking**: Docker Compose automatically bridges DNS logic, so the backend can refer to the database via `db:5432` rather than `localhost`.

---

## What Could Be Improved With More Time

1. **Production-Ready Configuration**:
   - Harden the CORS configuration to strict whitelists for production domains.
   - Create multi-stage `Dockerfile` paths specific to production (e.g., building the React UI statically and serving it via NGINX rather than using Vite's development server).
2. **Advanced AI Database Integration (`pgvector`)**:
   - Currently, embeddings might need to be recalculated or kept in memory. With more time, I would install the `pgvector` extension for PostgreSQL using Prisma. This would allow the database to store the embedding arrays persistently and handle cosine-similarity searches natively at the database level, vastly improving performance on massive datasets.
3. **AI Model Optimization**:
   - Cache the `@xenova/transformers` model weights inside the Docker image during the `docker build` phase so the container doesn't have to download the model on the very first query after a fresh installation.
4. **Testing & Validation**:
   - Add robust unit tests (Jest/Vitest) for all backend business logic.
   - Add end-to-end (E2E) testing scenarios for the UI using Playwright or Cypress.
   - Introduce strict runtime request validation schemas (using Zod) for all backend endpoints.
