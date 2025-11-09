"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "lucide-react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface PurchaseRequestCardProps {
  request: any
  isSeller: boolean
}

const statusLabels = {
  requested: "申請中",
  accepted: "承認済み",
  declined: "却下",
  completed: "完了",
}

const statusVariants = {
  requested: "default" as const,
  accepted: "default" as const,
  declined: "destructive" as const,
  completed: "secondary" as const,
}

export function PurchaseRequestCard({ request, isSeller }: PurchaseRequestCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [responseMessage, setResponseMessage] = useState("")
  const [showResponse, setShowResponse] = useState(false)

  const handleAccept = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("purchase_requests")
        .update({
          status: "accepted",
          response_message: responseMessage || null,
        })
        .eq("id", request.id)

      if (error) throw error

      toast({
        title: "承認しました",
        description: "購入申請を承認しました",
      })

      router.refresh()
      setShowResponse(false)
    } catch (error) {
      console.error("[v0] Accept error:", error)
      toast({
        title: "エラー",
        description: "承認に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDecline = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("purchase_requests")
        .update({
          status: "declined",
          response_message: responseMessage || null,
        })
        .eq("id", request.id)

      if (error) throw error

      toast({
        title: "却下しました",
        description: "購入申請を却下しました",
      })

      router.refresh()
      setShowResponse(false)
    } catch (error) {
      console.error("[v0] Decline error:", error)
      toast({
        title: "エラー",
        description: "却下に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const vehicle = request.vehicles
  const profile = isSeller ? request.profiles : vehicle?.profiles

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
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback>{profile?.display_name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <span>{profile?.display_name || "匿名ユーザー"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(request.created_at), "PPP", { locale: ja })}</span>
                </div>
              </div>
            </div>
          </div>
          <Badge variant={statusVariants[request.status as keyof typeof statusVariants]}>
            {statusLabels[request.status as keyof typeof statusLabels]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <div className="text-sm text-muted-foreground mb-1">希望購入価格</div>
          <div className="text-2xl font-bold">¥{request.offer_price.toLocaleString()}</div>
        </div>

        {request.message && (
          <div>
            <div className="text-sm text-muted-foreground mb-1">メッセージ</div>
            <p className="text-sm">{request.message}</p>
          </div>
        )}

        {request.response_message && (
          <div>
            <div className="text-sm text-muted-foreground mb-1">返信</div>
            <p className="text-sm">{request.response_message}</p>
          </div>
        )}

        {showResponse && isSeller && request.status === "requested" && (
          <div className="space-y-2 pt-4 border-t">
            <Label htmlFor="response">返信メッセージ（任意）</Label>
            <Textarea
              id="response"
              placeholder="買い手へのメッセージを入力してください"
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              rows={3}
            />
          </div>
        )}
      </CardContent>

      {isSeller && request.status === "requested" && (
        <CardFooter className="flex gap-3">
          {!showResponse ? (
            <>
              <Button variant="outline" onClick={() => setShowResponse(true)} className="flex-1">
                返信する
              </Button>
              <Button onClick={handleAccept} disabled={isLoading} className="flex-1">
                {isLoading ? "処理中..." : "承認"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setShowResponse(false)} disabled={isLoading} className="flex-1">
                キャンセル
              </Button>
              <Button variant="destructive" onClick={handleDecline} disabled={isLoading} className="flex-1">
                {isLoading ? "処理中..." : "却下"}
              </Button>
              <Button onClick={handleAccept} disabled={isLoading} className="flex-1">
                {isLoading ? "処理中..." : "承認"}
              </Button>
            </>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
