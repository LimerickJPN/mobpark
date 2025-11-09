"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin } from "lucide-react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface BookingCardProps {
  booking: any
  isOwner: boolean
}

const statusLabels = {
  pending: "承認待ち",
  confirmed: "確定",
  completed: "完了",
  cancelled: "キャンセル",
}

const statusVariants = {
  pending: "default" as const,
  confirmed: "default" as const,
  completed: "secondary" as const,
  cancelled: "destructive" as const,
}

export function BookingCard({ booking, isOwner }: BookingCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("bookings").update({ status: "confirmed" }).eq("id", booking.id)

      if (error) throw error

      toast({
        title: "予約を承認しました",
        description: "予約が確定されました",
      })

      router.refresh()
    } catch (error) {
      console.error("[v0] Confirm error:", error)
      toast({
        title: "エラー",
        description: "承認に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", booking.id)

      if (error) throw error

      toast({
        title: "予約をキャンセルしました",
        description: "予約がキャンセルされました",
      })

      router.refresh()
    } catch (error) {
      console.error("[v0] Cancel error:", error)
      toast({
        title: "エラー",
        description: "キャンセルに失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("bookings").update({ status: "completed" }).eq("id", booking.id)

      if (error) throw error

      toast({
        title: "完了しました",
        description: "予約が完了としてマークされました",
      })

      router.refresh()
    } catch (error) {
      console.error("[v0] Complete error:", error)
      toast({
        title: "エラー",
        description: "完了処理に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const vehicle = booking.vehicles
  const profile = isOwner ? booking.profiles : vehicle?.profiles

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            {vehicle && (
              <Link
                href={`/vehicles/${vehicle.id}`}
                className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0"
              >
                <Image
                  src={vehicle.images?.[0] || "/placeholder.svg?height=100&width=100&query=vehicle"}
                  alt={vehicle.title}
                  fill
                  className="object-cover"
                />
              </Link>
            )}
            <div className="flex-1">
              <CardTitle className="mb-2">
                {vehicle ? (
                  <Link href={`/vehicles/${vehicle.id}`} className="hover:underline">
                    {vehicle.title}
                  </Link>
                ) : (
                  "乗り物情報なし"
                )}
              </CardTitle>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback>{profile?.display_name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <span>{profile?.display_name || "匿名ユーザー"}</span>
                </div>
                {vehicle?.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{vehicle.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Badge variant={statusVariants[booking.status as keyof typeof statusVariants]}>
            {statusLabels[booking.status as keyof typeof statusLabels]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">開始日</div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">{format(new Date(booking.start_date), "PPP", { locale: ja })}</span>
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">終了日</div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">{format(new Date(booking.end_date), "PPP", { locale: ja })}</span>
            </div>
          </div>
        </div>

        {booking.notes && (
          <div>
            <div className="text-sm text-muted-foreground mb-1">備考</div>
            <p className="text-sm">{booking.notes}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-3">
        {isOwner && booking.status === "pending" && (
          <>
            <Button variant="outline" onClick={handleCancel} disabled={isLoading} className="flex-1 bg-transparent">
              拒否
            </Button>
            <Button onClick={handleConfirm} disabled={isLoading} className="flex-1">
              {isLoading ? "処理中..." : "承認"}
            </Button>
          </>
        )}

        {isOwner && booking.status === "confirmed" && (
          <Button onClick={handleComplete} disabled={isLoading} className="w-full">
            {isLoading ? "処理中..." : "完了"}
          </Button>
        )}

        {!isOwner && booking.status === "pending" && (
          <Button variant="outline" onClick={handleCancel} disabled={isLoading} className="w-full bg-transparent">
            {isLoading ? "処理中..." : "キャンセル"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
