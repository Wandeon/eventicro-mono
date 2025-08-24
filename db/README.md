# Database

The UI expects a Postgres schema `app` with table `app.events`.

## Connect locally

Use SSL disabled for local/dev to avoid CA headaches:

psql "$POSTGRES_URL?sslmode=disable"

## Apply migrations

psql "$POSTGRES_URL?sslmode=disable" -f db/migrations/001_init.sql

Seed files (optional) live in `db/seeds/`.
