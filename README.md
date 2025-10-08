# Tugasin - Guest-Only Kanban Board

A beautiful, guest-only Kanban board application that replicates core Trello functionality with auto-expiring boards and real-time collaboration.

## 🛠️ Tech Stack

- **Frontend**: React + Vite (JavaScript)
- **Styling**: Tailwind CSS with Skylight theme
- **Animations**: Framer Motion + CSS transitions
- **Drag & Drop**: @hello-pangea/dnd
- **Backend**: Node.js + Express (JavaScript)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Package Manager**: pnpm

## ✨ Features

- **No login required** - Instant access for all users
- **Landing page** as entry point with marketing-style design
- **Collaboration via shareable links** - Anyone with the board URL can join and edit
- **Auto-expiring boards** - Boards are automatically deleted after 1 week of inactivity
- **Room master can manually delete** boards when all tasks are done
- **Beautiful, professional UI** with Skylight theme (bright, modern, animated)
- **Production-ready code** in JavaScript
- **pnpm** as package manager

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL
- pnpm

### Installation

```bash
# Clone and install dependencies
pnpm install

# Set up PostgreSQL database
cd apps/server && cp .env.example .env && # edit DATABASE_URL

# Setup database
pnpm run db:setup

#Create the migration
cd apps/server
npx prisma migrate dev --name init

# Start development servers
cd ../../
pnpm run dev
```

### Auto-Expiry
```bash
# Run daily cleanup to remove expired boards:
pnpm run cleanup
```

### 🚀 Production
```bash
# Build for production:
pnpm run build
```

### 📄 License

MIT License

This complete application provides:

1. **Guest-only access** - No authentication required
2. **Beautiful UI** - Skylight theme with animations
3. **Real-time collaboration** - Shareable board links
4. **Auto-expiring boards** - 7-day inactivity cleanup
5. **Manual board deletion** - Room master control
6. **Full CRUD operations** - Create, read, update, delete
7. **Drag & drop functionality** - Smooth animations
8. **Responsive design** - Works on all devices
9. **Production-ready code** - Clean architecture
10. **pnpm monorepo** - Efficient dependency management

The application uses Prisma ORM with PostgreSQL, provides a beautiful modern UI with Tailwind CSS, and includes all the requested features with proper auto-expiry functionality.