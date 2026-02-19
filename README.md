# 🎫 Support Ticket System

A beautiful, modern single-page support ticket management application built with Django REST Framework and React.

## ✨ Features

- **📝 Single Page Design** - Everything you need on one clean, professional page
- **🎨 Modern UI** - Card-based layout with shadows, rounded corners, and beautiful styling
- **🎟️ Create & Manage Tickets** - Intuitive form with real-time AI suggestions
- **📊 Live Statistics Dashboard** - Real-time analytics with colored metric cards
- **🔍 Smart Search & Filtering** - Advanced filtering by category, priority, status, and text
- **🤖 AI-Powered Classification** - Automatic ticket categorization using OpenAI GPT-3.5
- **📱 Fully Responsive** - Works perfectly on desktop, tablet, and mobile devices
- **⚡ Real-time Updates** - Statistics and ticket lists update automatically
- **🛠️ RESTful API** - Complete backend API for integration with other systems

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed on your machine

### 1. Clone & Run
```bash
# Clone the repository
git clone <your-repo-url>
cd support-ticket-system

# Start the application
docker-compose up --build
```

### 2. Access the Application
- **🎫 Single Page App**: **http://localhost:3000**
- **🔧 Backend API**: http://localhost:8000
- **⚙️ Admin Panel**: http://localhost:8000/admin/

That's it! The application will automatically:
- Set up the PostgreSQL database
- Run database migrations
- Start the Django backend server
- Start the React development server

### 3. What You'll See
**Beautiful Single Page Layout:**
- **Header** - Clean branding and welcome message
- **Left Panel** - Create ticket form with AI-powered suggestions
- **Right Panel** - Live statistics dashboard with colored metric cards
- **Bottom Section** - Complete ticket management table with advanced filtering

## 🔧 Configuration

### OpenAI Integration (Optional)
For AI-powered ticket classification, set your OpenAI API key:

**Windows PowerShell:**
```powershell
$env:OPENAI_API_KEY="your-openai-api-key"
```

**Linux/macOS:**
```bash
export OPENAI_API_KEY="your-openai-api-key"
```

> **Note**: The app works perfectly without OpenAI - classification will use intelligent defaults.

## 📚 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tickets/tickets/` | List all tickets with filtering |
| `POST` | `/api/tickets/tickets/` | Create a new ticket |
| `PATCH` | `/api/tickets/tickets/{id}/` | Update ticket status/priority |
| `GET` | `/api/tickets/stats/` | Get ticket statistics |
| `POST` | `/api/tickets/classify/` | AI ticket classification |

### Filtering & Search
Add query parameters to `/api/tickets/tickets/`:
- `?category=technical` - Filter by category
- `?priority=high` - Filter by priority  
- `?status=open` - Filter by status
- `?search=login` - Search title and description

## 🎨 Application Design

### Single Page Layout
The application features a modern, card-based single-page design:

```
┌─────────────────────────────────────────────────┐
│                 🎫 Header                       
│            Support Ticket System                │
└─────────────────────────────────────────────────┘
┌─────────────────────┐  ┌─────────────────────────┐
│  📝 Create Ticket  │   │   📊 Live Statistics   │
│                     │  │                         │
│  • Title & Desc.    │  │  • Total Tickets        │
│  • AI Suggestions   │  │  • Open Tickets         │
│  • Category/Priority│  │  • Priority Breakdown   │
│  • Submit Button    │  │  • Category Breakdown   │
└─────────────────────┘  └─────────────────────────┘
┌─────────────────────────────────────────────────┐
│              🎟️ Ticket Management               │
│                                                  
│  🔍 Advanced Filters & Search                   │
│  📋 Interactive Table with Status Updates       │
└─────────────────────────────────────────────────┘
```

## 🛠️ Development

### Project Structure
```
support-ticket-system/
├── backend/                 # Django REST API
│   ├── support/            # Django project settings
│   ├── tickets/            # Main application
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile         # Backend container config
├── frontend/               # Single Page React App
│   ├── src/
│   │   ├── App.js         # Main single-page component
│   │   ├── api.js        # API configuration
│   │   └── constants.js  # Shared constants
│   ├── package.json      # Node.js dependencies
│   └── Dockerfile        # Frontend container config
└── docker-compose.yml     # Multi-container orchestration
```

### Making Changes
- **Backend**: Edit files in `backend/` - changes reflect immediately
- **Frontend**: Edit `frontend/src/App.js` - single file contains entire UI with hot reload
- **Styling**: All styles are inline in `App.js` for easy customization
- **Database**: Migrations auto-run on container startup

### Key Features in Action
- **🤖 AI Classification**: Type a description → AI suggests category/priority automatically
- **📊 Live Updates**: Create tickets → Statistics update in real-time
- **🔍 Smart Filtering**: Filter tickets by multiple criteria simultaneously
- **📱 Responsive**: Grid layout adapts to screen size automatically

### Available Categories & Priorities
- **Categories**: billing, technical, account, general
- **Priorities**: low, medium, high, critical
- **Statuses**: open, in_progress, resolved, closed

## 🌟 Technology Stack

- **Backend**: Django 5.2, Django REST Framework, PostgreSQL
- **Frontend**: React 18, Axios for API calls
- **Infrastructure**: Docker & Docker Compose
- **AI Integration**: OpenAI GPT-3.5-turbo
- **Database**: PostgreSQL 15

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

**Ready to manage support tickets with style? Start with `docker-compose up --build` and visit http://localhost:3000! 🚀**
