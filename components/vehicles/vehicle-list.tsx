import { createClient } from "@/lib/supabase/server"
import { VehicleCard } from "./vehicle-card"
import type { Vehicle } from "@/lib/types"

export async function VehicleList({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const category = params.category as string | undefined
  const types = params.types as string | undefined

  const supabase = await createClient()

  let query = supabase
    .from("vehicles")
    .select(`
      *,
      profiles (
        id,
        display_name,
        avatar_url
      )
    `)
    .eq("is_published", true)
    .eq("is_available", true)
    .order("created_at", { ascending: false })

  if (category && category !== "all") {
    query = query.eq("category", category)
  }

  if (types) {
    const typeArray = types.split(",")
    query = query.in("listing_type", typeArray)
  }

  const { data: vehicles, error } = await query

  if (error) {
    console.error("[v0] Error fetching vehicles:", error)
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">乗り物の読み込みに失敗しました</p>
      </div>
    )
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">該当する乗り物が見つかりませんでした</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle as Vehicle} />
      ))}
    </div>
  )
}
