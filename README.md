# Support Ticket System

This repository contains a simple support ticket application built with:

- **Backend**: Django + Django REST Framework + PostgreSQL
- **Frontend**: React (functional components + hooks)
- **Infrastructure**: Docker & Docker Compose

## Getting Started

Make sure Docker and Docker Compose are installed on your machine.

1. Copy or set the `OPENAI_API_KEY` environment variable in your shell. It's used by the ticket classifier endpoint. It is **not** required for the app to work, but classification will fall back to defaults if omitted.

```powershell
$env:OPENAI_API_KEY="your-key-here"
```

2. Run the entire application with a single command:

```bash
docker-compose up --build
```

3. After building:
   - Backend API will be available at <http://localhost:8000/>
   - Frontend UI will appear at <http://localhost:3000/>

The backend will automatically run migrations on startup.

## API Endpoints

| Method | Path                    | Description                               |
|--------|-------------------------|-------------------------------------------|
| POST   | `/api/tickets/`         | Create a ticket                           |
| GET    | `/api/tickets/`         | List tickets (filters/search supported)   |
| PATCH  | `/api/tickets/<id>/`    | Update ticket (status, category, priority)|
| GET    | `/api/tickets/stats/`   | Retrieve aggregated statistics            |
| POST   | `/api/tickets/classify/`| LLM-based category/priority suggestion    |

## Notes

- Filters on `/api/tickets/` support `category`, `priority`, `status`, and `search` (title + description).
- Stats calculations use database-level aggregation, avoiding Python loops.
- The classifier endpoint speaks to the OpenAI API and gracefully falls back on failure.

## Development

You can iterate on the backend by editing files in `backend/` and the frontend under `frontend/src/`. Containers mount the source directories, so changes will be reflected in real time.

## Project Structure

```
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── support/  (Django project)
│   └── tickets/  (app)
└── frontend/
    ├── package.json
    ├── Dockerfile
    └── src/      (React source code)
```

---

This setup aims to be clear, minimal, and production-ready. Enjoy building!