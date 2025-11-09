"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function PurchaseRequestButton({
  vehicleId,
  salePrice,
  listingType,
}: {
  vehicleId: string
  salePrice: number | null
  listingType: string
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [offerPrice, setOfferPrice] = useState(salePrice?.toString() || "")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!offerPrice || Number.parseFloat(offerPrice) <= 0) {
      toast({
        title: "エラー",
        description: "有効な金額を入力してください",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        toast({
          title: "ログインが必要です",
          description: "購入申請するにはログインしてください",
          variant: "destructive",
        })
        router.push("/auth/login")
        return
      }

      const { error } = await supabase.from("purchase_requests").insert({
        vehicle_id: vehicleId,
        buyer_id: user.id,
        offer_price: Number.parseFloat(offerPrice),
        message: message || null,
        status: "requested",
      })

      if (error) throw error

      toast({
        title: "購入申請を送信しました",
        description: "オーナーの返答をお待ちください",
      })

      setIsOpen(false)
      router.push("/dashboard/purchases")
    } catch (error) {
      console.error("[v0] Purchase request error:", error)
      toast({
        title: "エラー",
        description: "購入申請の送信に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={listingType === "sale" ? "default" : "outline"} className="w-full">
          {listingType === "sale" ? "購入申請" : "レンタル後に購入申請"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>購入申請</DialogTitle>
          <DialogDescription>オーナーに購入希望を伝えます</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="offer-price">希望購入価格</Label>
            <Input
              id="offer-price"
              type="number"
              placeholder="金額を入力"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              required
            />
            {salePrice && <p className="text-sm text-muted-foreground">提示価格: ¥{salePrice.toLocaleString()}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">メッセージ（任意）</Label>
            <Textarea
              id="message"
              placeholder="購入希望の理由や質問などをご記入ください"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              キャンセル
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "送信中..." : "送信"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
