-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Vehicle categories enum
CREATE TYPE vehicle_category AS ENUM (
  'boat',
  'car', 
  'plane',
  'motorcycle',
  'construction',
  'bicycle'
);

-- Listing type enum
CREATE TYPE listing_type AS ENUM (
  'rent',
  'share',
  'sale'
);

-- Booking status enum
CREATE TYPE booking_status AS ENUM (
  'pending',
  'confirmed',
  'completed',
  'cancelled'
);

-- Purchase request status enum
CREATE TYPE purchase_status AS ENUM (
  'requested',
  'accepted',
  'declined',
  'completed'
);

-- Profiles table (public user data)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  company_name TEXT,
  is_business BOOLEAN DEFAULT FALSE,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category vehicle_category NOT NULL,
  listing_type listing_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  manufacturer TEXT,
  model TEXT,
  year INTEGER,
  price_per_day DECIMAL(10, 2),
  price_per_hour DECIMAL(10, 2),
  sale_price DECIMAL(12, 2),
  location TEXT NOT NULL,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  capacity INTEGER,
  specifications JSONB DEFAULT '{}',
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_available BOOLEAN DEFAULT TRUE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  renter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status booking_status DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchase requests table
CREATE TABLE IF NOT EXISTS public.purchase_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  offer_price DECIMAL(12, 2) NOT NULL,
  message TEXT,
  status purchase_status DEFAULT 'requested',
  response_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, vehicle_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vehicles_owner ON public.vehicles(owner_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_category ON public.vehicles(category);
CREATE INDEX IF NOT EXISTS idx_vehicles_listing_type ON public.vehicles(listing_type);
CREATE INDEX IF NOT EXISTS idx_vehicles_available ON public.vehicles(is_available, is_published);
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle ON public.bookings(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_bookings_renter ON public.bookings(renter_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_purchase_requests_vehicle ON public.purchase_requests(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_purchase_requests_buyer ON public.purchase_requests(buyer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_vehicle ON public.reviews(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (TRUE);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- RLS Policies for vehicles
CREATE POLICY "vehicles_select_published" ON public.vehicles FOR SELECT USING (is_published = TRUE OR owner_id = auth.uid());
CREATE POLICY "vehicles_insert_own" ON public.vehicles FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "vehicles_update_own" ON public.vehicles FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "vehicles_delete_own" ON public.vehicles FOR DELETE USING (auth.uid() = owner_id);

-- RLS Policies for bookings
CREATE POLICY "bookings_select_own" ON public.bookings FOR SELECT USING (
  auth.uid() = renter_id OR 
  auth.uid() IN (SELECT owner_id FROM public.vehicles WHERE id = vehicle_id)
);
CREATE POLICY "bookings_insert_renter" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = renter_id);
CREATE POLICY "bookings_update_participants" ON public.bookings FOR UPDATE USING (
  auth.uid() = renter_id OR 
  auth.uid() IN (SELECT owner_id FROM public.vehicles WHERE id = vehicle_id)
);
CREATE POLICY "bookings_delete_renter" ON public.bookings FOR DELETE USING (auth.uid() = renter_id AND status = 'pending');

-- RLS Policies for purchase requests
CREATE POLICY "purchase_requests_select_participants" ON public.purchase_requests FOR SELECT USING (
  auth.uid() = buyer_id OR 
  auth.uid() IN (SELECT owner_id FROM public.vehicles WHERE id = vehicle_id)
);
CREATE POLICY "purchase_requests_insert_buyer" ON public.purchase_requests FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "purchase_requests_update_participants" ON public.purchase_requests FOR UPDATE USING (
  auth.uid() = buyer_id OR 
  auth.uid() IN (SELECT owner_id FROM public.vehicles WHERE id = vehicle_id)
);
CREATE POLICY "purchase_requests_delete_buyer" ON public.purchase_requests FOR DELETE USING (auth.uid() = buyer_id AND status = 'requested');

-- RLS Policies for reviews
CREATE POLICY "reviews_select_all" ON public.reviews FOR SELECT USING (TRUE);
CREATE POLICY "reviews_insert_reviewer" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "reviews_update_own" ON public.reviews FOR UPDATE USING (auth.uid() = reviewer_id);
CREATE POLICY "reviews_delete_own" ON public.reviews FOR DELETE USING (auth.uid() = reviewer_id);

-- RLS Policies for favorites
CREATE POLICY "favorites_select_own" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "favorites_insert_own" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_delete_own" ON public.favorites FOR DELETE USING (auth.uid() = user_id);
