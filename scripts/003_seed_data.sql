-- Insert sample vehicles (will need authenticated users to run this properly)
-- This is a template - actual data will be inserted through the app UI after users sign up

-- Sample for testing purposes only
-- Note: These inserts will fail with RLS unless executed by the actual owner
-- Users should create their listings through the app interface

INSERT INTO public.vehicles (owner_id, category, listing_type, title, description, manufacturer, model, year, price_per_day, sale_price, location, capacity, specifications, images, is_available, is_published)
VALUES
  -- Example structure (will need real user IDs)
  -- ('user-uuid-here', 'boat', 'rent', 'Luxury Yacht 50ft', 'Beautiful yacht perfect for ocean cruising', 'Azimut', 'Flybridge 50', 2020, 5000.00, NULL, 'Tokyo Bay', 12, '{"engine":"Twin diesel","length":"50ft"}', ARRAY['https://example.com/yacht1.jpg'], TRUE, TRUE)
ON CONFLICT DO NOTHING;

-- This script serves as a template for data structure
-- Actual data will be created through the application UI
