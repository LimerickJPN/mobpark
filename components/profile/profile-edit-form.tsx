"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { Profile } from "@/lib/types"
import { LogOut } from "lucide-react"

export function ProfileEditForm({
  profile,
  userEmail,
}: {
  profile: Profile | null
  userEmail: string
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const [formData, setFormData] = useState({
    display_name: profile?.display_name || "",
    company_name: profile?.company_name || "",
    is_business: profile?.is_business || false,
    phone: profile?.phone || "",
    bio: profile?.bio || "",
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.display_name.trim()) {
      toast({
        title: "エラー",
        description: "表示名を入力してください",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: formData.display_name,
          company_name: formData.company_name || null,
          is_business: formData.is_business,
          phone: formData.phone || null,
          bio: formData.bio || null,
        })
        .eq("id", profile?.id)

      if (error) throw error

      toast({
        title: "更新しました",
        description: "プロフィールが正常に更新されました",
      })

      router.refresh()
    } catch (error) {
      console.error("[v0] Profile update error:", error)
      toast({
        title: "エラー",
        description: "更新に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("[v0] Sign out error:", error)
      toast({
        title: "エラー",
        description: "ログアウトに失敗しました",
        variant: "destructive",
      })
      setIsSigningOut(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>アカウント情報</CardTitle>
          <CardDescription>登録されているメールアドレス</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">メールアドレス</div>
          <div className="font-medium">{userEmail}</div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
            <CardDescription>プロフィールの基本情報を入力してください</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display-name">表示名 *</Label>
              <Input
                id="display-name"
                value={formData.display_name}
                onChange={(e) => handleInputChange("display_name", e.target.value)}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-business"
                checked={formData.is_business}
                onCheckedChange={(checked) => handleInputChange("is_business", checked as boolean)}
              />
              <Label htmlFor="is-business" className="cursor-pointer">
                法人アカウント
              </Label>
            </div>

            {formData.is_business && (
              <div className="space-y-2">
                <Label htmlFor="company-name">会社名</Label>
                <Input
                  id="company-name"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange("company_name", e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="phone">電話番号</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">自己紹介</Label>
              <Textarea
                id="bio"
                placeholder="あなた自身や事業について説明してください"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            キャンセル
          </Button>
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? "更新中..." : "更新"}
          </Button>
        </div>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>アカウント管理</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleSignOut} disabled={isSigningOut}>
            <LogOut className="mr-2 h-4 w-4" />
            {isSigningOut ? "ログアウト中..." : "ログアウト"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
