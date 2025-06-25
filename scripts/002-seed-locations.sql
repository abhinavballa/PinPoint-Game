-- Insert sample countries
INSERT INTO locations (name, type, continent, difficulty_level) VALUES
('France', 'country', 'Europe', 2),
('Japan', 'country', 'Asia', 3),
('Brazil', 'country', 'South America', 2),
('Egypt', 'country', 'Africa', 3),
('Australia', 'country', 'Oceania', 1),
('Norway', 'country', 'Europe', 4),
('Thailand', 'country', 'Asia', 3),
('Kenya', 'country', 'Africa', 4),
('Chile', 'country', 'South America', 4),
('Canada', 'country', 'North America', 2),
('India', 'country', 'Asia', 2),
('Germany', 'country', 'Europe', 2),
('Mexico', 'country', 'North America', 2),
('South Africa', 'country', 'Africa', 3),
('Argentina', 'country', 'South America', 3);

-- Insert sample cities
INSERT INTO locations (name, type, country, difficulty_level) VALUES
('Paris', 'city', 'France', 1),
('Tokyo', 'city', 'Japan', 2),
('New York', 'city', 'United States', 1),
('London', 'city', 'United Kingdom', 1),
('Sydney', 'city', 'Australia', 2),
('Mumbai', 'city', 'India', 3),
('Cairo', 'city', 'Egypt', 3),
('Rio de Janeiro', 'city', 'Brazil', 2),
('Bangkok', 'city', 'Thailand', 3),
('Berlin', 'city', 'Germany', 2),
('Vancouver', 'city', 'Canada', 4),
('Dubai', 'city', 'United Arab Emirates', 3),
('Barcelona', 'city', 'Spain', 3),
('Singapore', 'city', 'Singapore', 4),
('Istanbul', 'city', 'Turkey', 4);
