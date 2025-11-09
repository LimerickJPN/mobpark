import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface Review {
  id: string
  rating: number
  comment: string | null
  created_at: string
  profiles: {
    display_name: string
    avatar_url: string | null
  } | null
}

export function VehicleReviews({
  reviews,
  averageRating,
}: {
  reviews: Review[]
  averageRating: number
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>レビュー</CardTitle>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground">({reviews.length}件)</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.profiles?.avatar_url || undefined} />
                  <AvatarFallback>{review.profiles?.display_name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{review.profiles?.display_name || "匿名ユーザー"}</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(review.created_at), "PPP", { locale: ja })}
                  </div>
                </div>
              </div>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn("h-4 w-4", i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300")}
                  />
                ))}
              </div>
            </div>
            {review.comment && <p className="text-muted-foreground ml-13">{review.comment}</p>}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
