export type VehicleCategory = "boat" | "car" | "plane" | "motorcycle" | "construction" | "bicycle"

export type ListingType = "rent" | "share" | "sale"

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled"

export type PurchaseStatus = "requested" | "accepted" | "declined" | "completed"

export interface Profile {
  id: string
  display_name: string
  company_name?: string | null
  is_business: boolean
  phone?: string | null
  avatar_url?: string | null
  bio?: string | null
  created_at: string
  updated_at: string
}

export interface Vehicle {
  id: string
  owner_id: string
  category: VehicleCategory
  listing_type: ListingType
  title: string
  description: string
  manufacturer?: string | null
  model?: string | null
  year?: number | null
  price_per_day?: number | null
  price_per_hour?: number | null
  sale_price?: number | null
  location: string
  latitude?: number | null
  longitude?: number | null
  capacity?: number | null
  specifications?: Record<string, any>
  images: string[]
  is_available: boolean
  is_published: boolean
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Booking {
  id: string
  vehicle_id: string
  renter_id: string
  start_date: string
  end_date: string
  total_price: number
  status: BookingStatus
  notes?: string | null
  created_at: string
  updated_at: string
  vehicles?: Vehicle
  profiles?: Profile
}

export interface PurchaseRequest {
  id: string
  vehicle_id: string
  buyer_id: string
  booking_id?: string | null
  offer_price: number
  message?: string | null
  status: PurchaseStatus
  response_message?: string | null
  created_at: string
  updated_at: string
  vehicles?: Vehicle
  profiles?: Profile
}

export interface Review {
  id: string
  vehicle_id: string
  reviewer_id: string
  booking_id?: string | null
  rating: number
  comment?: string | null
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Favorite {
  id: string
  user_id: string
  vehicle_id: string
  created_at: string
  vehicles?: Vehicle
}
