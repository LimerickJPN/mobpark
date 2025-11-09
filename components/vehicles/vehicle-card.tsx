import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Vehicle } from "@/lib/types"
import { MapPin } from "lucide-react"

const categoryLabels = {
  boat: "船",
  car: "自動車",
  plane: "飛行機",
  motorcycle: "バイク",
  construction: "建設機械",
  bicycle: "自転車",
}

const listingTypeLabels = {
  rent: "レンタル",
  share: "シェア",
  sale: "売買",
}

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const mainImage = vehicle.images[0] || "/diverse-city-street.png"

  const priceDisplay =
    vehicle.listing_type === "sale"
      ? `¥${vehicle.sale_price?.toLocaleString()}`
      : vehicle.price_per_day
        ? `¥${vehicle.price_per_day.toLocaleString()}/日`
        : vehicle.price_per_hour
          ? `¥${vehicle.price_per_hour.toLocaleString()}/時間`
          : "価格応相談"

  return (
    <Link href={`/vehicles/${vehicle.id}`}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image src={mainImage || "/placeholder.svg"} alt={vehicle.title} fill className="object-cover" />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="secondary">{categoryLabels[vehicle.category]}</Badge>
            <Badge>{listingTypeLabels[vehicle.listing_type]}</Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{vehicle.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{vehicle.description}</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{vehicle.location}</span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <span className="font-bold text-lg">{priceDisplay}</span>
          {vehicle.profiles && <span className="text-sm text-muted-foreground">{vehicle.profiles.display_name}</span>}
        </CardFooter>
      </Card>
    </Link>
  )
}
