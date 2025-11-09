"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { VehicleCategory, ListingType } from "@/lib/types"

const categories: { value: VehicleCategory; label: string }[] = [
  { value: "boat", label: "船" },
  { value: "car", label: "自動車" },
  { value: "plane", label: "飛行機" },
  { value: "motorcycle", label: "バイク" },
  { value: "construction", label: "建設機械" },
  { value: "bicycle", label: "自転車" },
]

const listingTypes: { value: ListingType; label: string }[] = [
  { value: "rent", label: "レンタル" },
  { value: "share", label: "シェア" },
  { value: "sale", label: "売買" },
]

export function VehicleListingForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    category: "" as VehicleCategory,
    listing_type: "" as ListingType,
    title: "",
    description: "",
    manufacturer: "",
    model: "",
    year: "",
    price_per_day: "",
    price_per_hour: "",
    sale_price: "",
    location: "",
    capacity: "",
    is_available: true,
    is_published: true,
  })

  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }])
  }

  const updateSpecification = (index: number, field: "key" | "value", value: string) => {
    const newSpecs = [...specifications]
    newSpecs[index][field] = value
    setSpecifications(newSpecs)
  }

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.category ||
      !formData.listing_type ||
      !formData.title ||
      !formData.description ||
      !formData.location
    ) {
      toast({
        title: "エラー",
        description: "必須項目を入力してください",
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
          description: "掲載するにはログインしてください",
          variant: "destructive",
        })
        router.push("/auth/login")
        return
      }

      // Build specifications object
      const specsObject: Record<string, string> = {}
      specifications.forEach((spec) => {
        if (spec.key && spec.value) {
          specsObject[spec.key] = spec.value
        }
      })

      // Prepare vehicle data
      const vehicleData = {
        owner_id: user.id,
        category: formData.category,
        listing_type: formData.listing_type,
        title: formData.title,
        description: formData.description,
        manufacturer: formData.manufacturer || null,
        model: formData.model || null,
        year: formData.year ? Number.parseInt(formData.year) : null,
        price_per_day: formData.price_per_day ? Number.parseFloat(formData.price_per_day) : null,
        price_per_hour: formData.price_per_hour ? Number.parseFloat(formData.price_per_hour) : null,
        sale_price: formData.sale_price ? Number.parseFloat(formData.sale_price) : null,
        location: formData.location,
        capacity: formData.capacity ? Number.parseInt(formData.capacity) : null,
        specifications: specsObject,
        images: [], // Would handle image upload in a real implementation
        is_available: formData.is_available,
        is_published: formData.is_published,
      }

      const { data, error } = await supabase.from("vehicles").insert(vehicleData).select().single()

      if (error) throw error

      toast({
        title: "掲載を作成しました",
        description: "乗り物が正常に掲載されました",
      })

      router.push(`/vehicles/${data.id}`)
    } catch (error) {
      console.error("[v0] Listing creation error:", error)
      toast({
        title: "エラー",
        description: "掲載の作成に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
          <CardDescription>乗り物の基本的な情報を入力してください</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">カテゴリー *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="listing_type">利用方法 *</Label>
              <Select value={formData.listing_type} onValueChange={(value) => handleInputChange("listing_type", value)}>
                <SelectTrigger id="listing_type">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {listingTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">タイトル *</Label>
            <Input
              id="title"
              placeholder="例: 高級ヨット50フィート"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">説明 *</Label>
            <Textarea
              id="description"
              placeholder="乗り物の詳細な説明を入力してください"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">所在地 *</Label>
            <Input
              id="location"
              placeholder="例: 東京都港区"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>詳細情報</CardTitle>
          <CardDescription>乗り物の詳細スペックを入力してください（任意）</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manufacturer">メーカー</Label>
              <Input
                id="manufacturer"
                placeholder="例: Toyota"
                value={formData.manufacturer}
                onChange={(e) => handleInputChange("manufacturer", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">モデル</Label>
              <Input
                id="model"
                placeholder="例: Camry"
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">年式</Label>
              <Input
                id="year"
                type="number"
                placeholder="例: 2023"
                value={formData.year}
                onChange={(e) => handleInputChange("year", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">定員</Label>
              <Input
                id="capacity"
                type="number"
                placeholder="例: 5"
                value={formData.capacity}
                onChange={(e) => handleInputChange("capacity", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>その他のスペック</Label>
            {specifications.map((spec, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="項目名（例: エンジン）"
                  value={spec.key}
                  onChange={(e) => updateSpecification(index, "key", e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="値（例: V6）"
                  value={spec.value}
                  onChange={(e) => updateSpecification(index, "value", e.target.value)}
                  className="flex-1"
                />
                {specifications.length > 1 && (
                  <Button type="button" variant="outline" size="icon" onClick={() => removeSpecification(index)}>
                    ×
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addSpecification} className="w-full bg-transparent">
              スペックを追加
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>料金設定</CardTitle>
          <CardDescription>利用方法に応じた料金を設定してください</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(formData.listing_type === "rent" || formData.listing_type === "share") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_per_day">1日あたりの料金（円）</Label>
                <Input
                  id="price_per_day"
                  type="number"
                  placeholder="例: 50000"
                  value={formData.price_per_day}
                  onChange={(e) => handleInputChange("price_per_day", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_per_hour">1時間あたりの料金（円）</Label>
                <Input
                  id="price_per_hour"
                  type="number"
                  placeholder="例: 5000"
                  value={formData.price_per_hour}
                  onChange={(e) => handleInputChange("price_per_hour", e.target.value)}
                />
              </div>
            </div>
          )}

          {(formData.listing_type === "sale" ||
            formData.listing_type === "rent" ||
            formData.listing_type === "share") && (
            <div className="space-y-2">
              <Label htmlFor="sale_price">販売価格（円）</Label>
              <Input
                id="sale_price"
                type="number"
                placeholder="例: 5000000"
                value={formData.sale_price}
                onChange={(e) => handleInputChange("sale_price", e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                レンタル・シェアの場合は、レンタル後の購入希望価格として設定できます
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>公開設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_available"
              checked={formData.is_available}
              onCheckedChange={(checked) => handleInputChange("is_available", checked as boolean)}
            />
            <Label htmlFor="is_available" className="cursor-pointer">
              現在利用可能
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) => handleInputChange("is_published", checked as boolean)}
            />
            <Label htmlFor="is_published" className="cursor-pointer">
              公開する
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
          キャンセル
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "作成中..." : "掲載を作成"}
        </Button>
      </div>
    </form>
  )
}
