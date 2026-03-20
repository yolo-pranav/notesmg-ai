<div align="center">
  
  # NotesMG AI
  
  **A blazingly fast, privacy-first note-taking app powered by local AI.** 
  Instantly search your thoughts by *concept*, not just by keyword.
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
  [![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io)
  [![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
</div>

<br/>

## ✨ Features

- **Semantic AI Search**: Type "cooking", find your note on "pasta recipes". Powered entirely offline by `@xenova/transformers`.
- **Hybrid Scoring Engine**: Combines conceptual dot-product scoring with exact-keyword boosting for perfect query relevancy.
- **Secure Sessions**: HTTP-only PostgreSQL sessions instead of vulnerable localStorage JWTs.
- **Docker Ready**: One command spin-up for the frontend, backend, and isolated database network.

---

## 🚀 Quick Start (Docker)

1. **Clone & Setup Network**:
   ```bash
   git clone https://github.com/yolo-pranav/notesmg-ai.git && cd notesmg-ai
   ```
2. **Boot the Stack**:
   ```bash
   docker compose up
   ```

**URLs:**
- **App**: [http://localhost:3000](http://localhost:3000)
- **API**: [http://localhost:8080](http://localhost:8080)

---

## 🧠 How the AI Works

The app runs an offline HuggingFace pipeline inside the Node backend. When you search:
1. **Embeddings:** Your query is converted into a multi-dimensional unit vector matrix.
2. **Scoring:** We calculate the `Cosine Similarity` (pure dot-product) against all notes in memory. 
3. **Thresholding:** To guarantee quality, any note structurally scoring below `0.40` is discarded as contextual noise.
4. **Keyword Bonus:** True exact substring matches safely inject a targeted boost.

---

## 🛠️ Local Development (No Docker)

If you prefer to run the services without Docker:

1. **Install PostgreSQL**:
   Download and install PostgreSQL from the [official website](https://www.postgresql.org/download/). Once installed, open pgAdmin or `psql` and create a new database named `notesmg`.

2. **Configure Environment Variables**:
   Copy the example environment files to create your active `.env` configuration files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
   *Note: Update the `DATABASE_URL` inside `backend/.env` with your specific local Postgres credentials if they differ from the defaults.*

3. **Boot Backend**:
   ```bash
   cd backend
   npm install
   npx prisma db push
   npm run dev
   ```

4. **Boot Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## 📁 Project Structure

```text
notesmg-ai/
├── backend/                  # Node.js Express API
│   ├── prisma/               # Database schema & migrations
│   ├── src/
│   │   ├── config/           # Database & environment setup
│   │   ├── middleware/       # Express session/auth guards
│   │   ├── routes/           # API endpoints (Auth, Notes)
│   │   └── services/         # ML Pipeline (Xenova Transformers)
│   └── server.js             # API Entry point
│
├── frontend/                 # React UI (Vite)
│   ├── src/
│   │   ├── api/              # Axios interceptors & fetchers
│   │   ├── components/       # Reusable UI widgets
│   │   └── pages/            # Main React views (Dashboard, Login)
│   └── index.html
│
└── docker-compose.yml        # Orchestrates the DB, Backend, and Frontend
```

---

## 🔮 What Could Be Improved With More Time

1. **Search Highlights**: Visually highlighting exactly which sentences matched the search query on the frontend.
2. **Note Organization**: Allowing users to group their notes using lightweight #tags or custom folders.
3. **Pagination**: Implementing infinite scrolling on the frontend to smoothly handle thousands of notes without loading them all at once.
4. **Soft Deletes**: Adding a "Trash Bin" so users can restore accidentally deleted notes before permanent destruction.

---

<div align="center">
  <i>Assumptions: Strictly uses local ML execution to prevent API limits; CORS runs permissive for dev. Built with simplicity and privacy in mind.</i>
</div>
