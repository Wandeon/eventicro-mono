const { Pool } = require('pg');

// Simulate the same environment as the application
process.env.POSTGRES_URL = 'postgresql://postgres:cs5SA7tuU6LqGpMoix6mu4ZypkZ2JKmq@localhost:5432/eventicro';
process.env.NODE_ENV = 'development';

console.log('Testing database connection from application context...');
console.log('POSTGRES_URL:', process.env.POSTGRES_URL);

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  console.error('❌ POSTGRES_URL is not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
  ssl: false
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    
    const result = await client.query('SELECT COUNT(*) FROM app.events');
    console.log('✅ Events count:', result.rows[0].count);
    
    const events = await client.query('SELECT title, city, category FROM app.events LIMIT 3');
    console.log('✅ Sample events:');
    events.rows.forEach(event => {
      console.log(`  - ${event.title} (${event.city}, ${event.category})`);
    });
    
    client.release();
    await pool.end();
    console.log('✅ Connection test completed successfully!');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Error details:', error);
    await pool.end();
    process.exit(1);
  }
}

testConnection();
