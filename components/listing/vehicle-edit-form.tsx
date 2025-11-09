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
import type { Vehicle, VehicleCategory, ListingType } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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

export function VehicleEditForm({ vehicle }: { vehicle: Vehicle }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [formData, setFormData] = useState({
    category: vehicle.category,
    listing_type: vehicle.listing_type,
    title: vehicle.title,
    description: vehicle.description,
    manufacturer: vehicle.manufacturer || "",
    model: vehicle.model || "",
    year: vehicle.year?.toString() || "",
    price_per_day: vehicle.price_per_day?.toString() || "",
    price_per_hour: vehicle.price_per_hour?.toString() || "",
    sale_price: vehicle.sale_price?.toString() || "",
    location: vehicle.location,
    capacity: vehicle.capacity?.toString() || "",
    is_available: vehicle.is_available,
    is_published: vehicle.is_published,
  })

  const initialSpecs = vehicle.specifications
    ? Object.entries(vehicle.specifications).map(([key, value]) => ({ key, value: String(value) }))
    : [{ key: "", value: "" }]

  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>(initialSpecs)

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

    if (!formData.title || !formData.description || !formData.location) {
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
      const specsObject: Record<string, string> = {}
      specifications.forEach((spec) => {
        if (spec.key && spec.value) {
          specsObject[spec.key] = spec.value
        }
      })

      const updateData = {
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
        is_available: formData.is_available,
        is_published: formData.is_published,
      }

      const { error } = await supabase.from("vehicles").update(updateData).eq("id", vehicle.id)

      if (error) throw error

      toast({
        title: "更新しました",
        description: "掲載情報が正常に更新されました",
      })

      router.push(`/vehicles/${vehicle.id}`)
      router.refresh()
    } catch (error) {
      console.error("[v0] Update error:", error)
      toast({
        title: "エラー",
        description: "更新に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("vehicles").delete().eq("id", vehicle.id)

      if (error) throw error

      toast({
        title: "削除しました",
        description: "掲載が正常に削除されました",
      })

      router.push("/dashboard/vehicles")
      router.refresh()
    } catch (error) {
      console.error("[v0] Delete error:", error)
      toast({
        title: "エラー",
        description: "削除に失敗しました",
        variant: "destructive",
      })
      setIsDeleting(false)
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
          {/* Same fields as VehicleListingForm */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">カテゴリー *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger id="category">
                  <SelectValue />
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
                  <SelectValue />
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
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">説明 *</Label>
            <Textarea
              id="description"
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
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional cards similar to VehicleListingForm - omitted for brevity */}

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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type="button" variant="destructive">
              削除
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
              <AlertDialogDescription>この操作は取り消せません。掲載を完全に削除します。</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "削除中..." : "削除"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="flex-1" />

        <Button type="button" variant="outline" onClick={() => router.back()}>
          キャンセル
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "更新中..." : "更新"}
        </Button>
      </div>
    </form>
  )
}
