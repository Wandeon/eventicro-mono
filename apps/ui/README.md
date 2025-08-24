# EventiCRO UI

A SvelteKit-based frontend for the EventiCRO event management application.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Database Setup

1. Create a PostgreSQL database
2. Run the schema file: `psql -d your_database -f db-schema.sql`
3. Set the `POSTGRES_URL` environment variable:
   ```
   POSTGRES_URL=postgresql://username:password@localhost:5432/your_database
   ```

### 3. Environment Variables

Create a `.env` file in the `apps/ui` directory with:

```
POSTGRES_URL=postgresql://username:password@localhost:5432/your_database
NODE_ENV=development
GIT_SHA=unknown
```

### 4. Run the Application

```bash
npm run dev
# or
pnpm dev
```

The application will be available at `http://127.0.0.1:3000`

## Features

- Event listing with search and filtering
- Interactive map view
- Responsive design
- Real-time database integration

## API Endpoints

- `GET /api/events` - List events with filtering and pagination
- `POST /api/events` - Create new events
- `GET /api/health` - Health check endpoint

## Database Schema

The application uses a PostgreSQL database with the following main table:

- `app.events` - Stores event information including title, description, dates, location, etc.

See `db-schema.sql` for the complete schema definition.
