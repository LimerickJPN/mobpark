"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Ship, Car, Plane, Bike, Construction } from "lucide-react"

const categories = [
  { id: "all", name: "すべて", icon: null },
  { id: "boat", name: "船", icon: Ship },
  { id: "car", name: "自動車", icon: Car },
  { id: "plane", name: "飛行機", icon: Plane },
  { id: "motorcycle", name: "バイク", icon: Bike },
  { id: "construction", name: "建設機械", icon: Construction },
  { id: "bicycle", name: "自転車", icon: Bike },
]

const listingTypes = [
  { id: "rent", name: "レンタル" },
  { id: "share", name: "シェア" },
  { id: "sale", name: "売買" },
]

export function VehicleFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get("category") || "all"
  const currentTypes = searchParams.get("types")?.split(",") || []

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === "all" && key === "category") {
      params.delete("category")
    } else if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/vehicles?${params.toString()}`)
  }

  const toggleType = (typeId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    let types = currentTypes.filter(Boolean)

    if (types.includes(typeId)) {
      types = types.filter((t) => t !== typeId)
    } else {
      types.push(typeId)
    }

    if (types.length > 0) {
      params.set("types", types.join(","))
    } else {
      params.delete("types")
    }

    router.push(`/vehicles?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>カテゴリー</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={currentCategory} onValueChange={(value) => updateFilters("category", value)}>
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <div key={category.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={category.id} id={category.id} />
                  <Label htmlFor={category.id} className="flex items-center gap-2 cursor-pointer flex-1">
                    {Icon && <Icon className="h-4 w-4" />}
                    {category.name}
                  </Label>
                </div>
              )
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>利用方法</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {listingTypes.map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox
                id={type.id}
                checked={currentTypes.includes(type.id)}
                onCheckedChange={() => toggleType(type.id)}
              />
              <Label htmlFor={type.id} className="cursor-pointer flex-1">
                {type.name}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
