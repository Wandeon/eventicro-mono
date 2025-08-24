@echo off
echo Starting EventiCRO application with database connection...

set POSTGRES_URL=postgresql://postgres:cs5SA7tuU6LqGpMoix6mu4ZypkZ2JKmq@localhost:5432/eventicro
set NODE_ENV=development
set GIT_SHA=unknown

echo Database URL: %POSTGRES_URL%

cd apps\ui
npm run dev
