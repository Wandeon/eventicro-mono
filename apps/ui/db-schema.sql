-- Database schema for EventiCRO application
-- Run this in your PostgreSQL database

-- Create the app schema
CREATE SCHEMA IF NOT EXISTS app;

-- Create the events table
CREATE TABLE IF NOT EXISTS app.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    city VARCHAR(100),
    venue_name VARCHAR(255),
    price VARCHAR(100),
    category VARCHAR(50),
    image_url TEXT,
    url TEXT,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_start_time ON app.events(start_time);
CREATE INDEX IF NOT EXISTS idx_events_city ON app.events(city);
CREATE INDEX IF NOT EXISTS idx_events_category ON app.events(category);
CREATE INDEX IF NOT EXISTS idx_events_verified ON app.events(verified);

-- Create a full-text search index
CREATE INDEX IF NOT EXISTS idx_events_fts ON app.events USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Insert some sample data
INSERT INTO app.events (title, description, start_time, city, venue_name, category, price) VALUES
('Rock Concert Zagreb', 'Amazing rock concert in the heart of Zagreb', '2024-12-15 20:00:00+01', 'Zagreb', 'Arena Zagreb', 'music', '€25'),
('Football Match Dinamo vs Hajduk', 'Classic Croatian derby', '2024-12-20 19:00:00+01', 'Zagreb', 'Maksimir Stadium', 'sport', '€15'),
('Theater Performance Hamlet', 'Shakespeare classic in Croatian', '2024-12-18 19:30:00+01', 'Zagreb', 'Croatian National Theater', 'theatre', '€20'),
('Summer Music Festival', 'Annual music festival with local artists', '2024-07-15 18:00:00+02', 'Split', 'Diocletian Palace', 'festival', '€30');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON app.events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
