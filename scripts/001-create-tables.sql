-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create games table to track all game sessions
CREATE TABLE games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  mode VARCHAR(20) NOT NULL CHECK (mode IN ('country', 'city')),
  location_name VARCHAR(100) NOT NULL,
  questions_asked INTEGER NOT NULL,
  completion_time_seconds INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  won BOOLEAN DEFAULT TRUE
);

-- Create locations table
CREATE TABLE locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('country', 'city')),
  continent VARCHAR(50),
  country VARCHAR(100), -- For cities, which country they're in
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_played_locations to track what each user has played
CREATE TABLE user_played_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  location_id UUID REFERENCES locations(id),
  played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, location_id)
);

-- Create indexes for better performance
CREATE INDEX idx_games_mode_completed_at ON games(mode, completed_at DESC);
CREATE INDEX idx_games_user_id ON games(user_id);
CREATE INDEX idx_user_played_locations_user_id ON user_played_locations(user_id);
CREATE INDEX idx_locations_type ON locations(type);
