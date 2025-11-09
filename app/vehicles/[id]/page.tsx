import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Anchor, MapPin, Star } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { BookingForm } from "@/components/vehicles/booking-form"
import { PurchaseRequestButton } from "@/components/vehicles/purchase-request-button"
import { VehicleReviews } from "@/components/vehicles/vehicle-reviews"

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

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch vehicle details
  const { data: vehicle, error } = await supabase
    .from("vehicles")
    .select(`
      *,
      profiles (
        id,
        display_name,
        avatar_url,
        company_name,
        is_business
      )
    `)
    .eq("id", id)
    .single()

  if (error || !vehicle) {
    notFound()
  }

  // Check if user is the owner
  const isOwner = user?.id === vehicle.owner_id

  // Fetch reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      *,
      profiles (
        display_name,
        avatar_url
      )
    `)
    .eq("vehicle_id", id)
    .order("created_at", { ascending: false })

  const averageRating =
    reviews && reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0

  const priceDisplay =
    vehicle.listing_type === "sale"
      ? `¥${vehicle.sale_price?.toLocaleString()}`
      : vehicle.price_per_day
        ? `¥${vehicle.price_per_day.toLocaleString()}/日`
        : vehicle.price_per_hour
          ? `¥${vehicle.price_per_hour.toLocaleString()}/時間`
          : "価格応相談"

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
            <Anchor className="h-6 w-6" />
            <span>VehicleShare</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/vehicles" className="text-sm font-medium hover:text-primary transition-colors">
              乗り物を探す
            </Link>
            <Link href="/list-vehicle" className="text-sm font-medium hover:text-primary transition-colors">
              乗り物を掲載
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              サービスについて
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Button variant="ghost" asChild>
                <Link href="/dashboard">ダッシュボード</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">ログイン</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/sign-up">新規登録</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Button variant="ghost" asChild>
            <Link href="/vehicles">← 一覧に戻る</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src={vehicle.images[0] || "/placeholder.svg?height=600&width=800&query=vehicle"}
                  alt={vehicle.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {vehicle.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {vehicle.images.slice(1, 5).map((image, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${vehicle.title} - ${index + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex gap-2 mb-2">
                    <Badge variant="secondary">{categoryLabels[vehicle.category]}</Badge>
                    <Badge>{listingTypeLabels[vehicle.listing_type]}</Badge>
                    {!vehicle.is_available && <Badge variant="destructive">利用不可</Badge>}
                  </div>
                  <h1 className="text-3xl font-bold mb-2">{vehicle.title}</h1>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{vehicle.location}</span>
                    </div>
                    {reviews && reviews.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>
                          {averageRating.toFixed(1)} ({reviews.length}件)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-3">説明</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{vehicle.description}</p>
              </div>
            </div>

            {/* Specifications */}
            {vehicle.specifications && Object.keys(vehicle.specifications).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>詳細情報</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  {vehicle.manufacturer && (
                    <div>
                      <div className="text-sm text-muted-foreground">メーカー</div>
                      <div className="font-medium">{vehicle.manufacturer}</div>
                    </div>
                  )}
                  {vehicle.model && (
                    <div>
                      <div className="text-sm text-muted-foreground">モデル</div>
                      <div className="font-medium">{vehicle.model}</div>
                    </div>
                  )}
                  {vehicle.year && (
                    <div>
                      <div className="text-sm text-muted-foreground">年式</div>
                      <div className="font-medium">{vehicle.year}年</div>
                    </div>
                  )}
                  {vehicle.capacity && (
                    <div>
                      <div className="text-sm text-muted-foreground">定員</div>
                      <div className="font-medium">{vehicle.capacity}名</div>
                    </div>
                  )}
                  {Object.entries(vehicle.specifications).map(([key, value]) => (
                    <div key={key}>
                      <div className="text-sm text-muted-foreground">{key}</div>
                      <div className="font-medium">{String(value)}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Owner Info */}
            <Card>
              <CardHeader>
                <CardTitle>オーナー情報</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={vehicle.profiles?.avatar_url || undefined} />
                    <AvatarFallback>{vehicle.profiles?.display_name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{vehicle.profiles?.display_name}</div>
                    {vehicle.profiles?.company_name && (
                      <div className="text-sm text-muted-foreground">{vehicle.profiles.company_name}</div>
                    )}
                    {vehicle.profiles?.is_business && (
                      <Badge variant="outline" className="mt-1">
                        法人
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            {reviews && reviews.length > 0 && <VehicleReviews reviews={reviews} averageRating={averageRating} />}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <Card>
                <CardHeader>
                  <div className="flex items-baseline justify-between">
                    <CardTitle className="text-2xl font-bold">{priceDisplay}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isOwner ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <p className="mb-4">これはあなたの掲載です</p>
                      <Button asChild className="w-full">
                        <Link href={`/dashboard/vehicles/${vehicle.id}/edit`}>編集する</Link>
                      </Button>
                    </div>
                  ) : vehicle.is_available ? (
                    <>
                      {vehicle.listing_type !== "sale" && (
                        <>
                          <BookingForm vehicleId={vehicle.id} vehicleType={vehicle.listing_type} />
                          <Separator />
                        </>
                      )}

                      {(vehicle.listing_type === "sale" || vehicle.sale_price) && (
                        <PurchaseRequestButton
                          vehicleId={vehicle.id}
                          salePrice={vehicle.sale_price}
                          listingType={vehicle.listing_type}
                        />
                      )}
                    </>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">現在利用できません</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
