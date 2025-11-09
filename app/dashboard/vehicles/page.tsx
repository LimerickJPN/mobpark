import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Eye } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import Image from "next/image"

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

export default async function MyVehiclesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/vehicles")
  }

  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">掲載中の乗り物</h1>
          <p className="text-muted-foreground">あなたが掲載している乗り物の管理</p>
        </div>
        <Button asChild>
          <Link href="/list-vehicle">
            <Plus className="mr-2 h-4 w-4" />
            新しい掲載
          </Link>
        </Button>
      </div>

      {!vehicles || vehicles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">まだ乗り物を掲載していません</p>
            <Button asChild>
              <Link href="/list-vehicle">
                <Plus className="mr-2 h-4 w-4" />
                最初の掲載を作成
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="overflow-hidden">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={vehicle.images[0] || "/placeholder.svg?height=300&width=400&query=vehicle"}
                  alt={vehicle.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="secondary">{categoryLabels[vehicle.category]}</Badge>
                  <Badge>{listingTypeLabels[vehicle.listing_type]}</Badge>
                </div>
                {!vehicle.is_available && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="destructive">利用不可</Badge>
                  </div>
                )}
                {!vehicle.is_published && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="outline">非公開</Badge>
                  </div>
                )}
              </div>

              <CardHeader>
                <CardTitle className="line-clamp-2">{vehicle.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{vehicle.description}</p>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                  <Link href={`/vehicles/${vehicle.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    表示
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                  <Link href={`/dashboard/vehicles/${vehicle.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    編集
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
