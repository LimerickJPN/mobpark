import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Anchor } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { ProfileEditForm } from "@/components/profile/profile-edit-form"

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/profile")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
            <Anchor className="h-6 w-6" />
            <span>VehicleShare</span>
          </Link>

          <Button variant="ghost" asChild>
            <Link href="/dashboard">ダッシュボード</Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">プロフィール編集</h1>
          <p className="text-muted-foreground">アカウント情報を更新します</p>
        </div>

        <ProfileEditForm profile={profile} userEmail={user.email || ""} />
      </div>
    </div>
  )
}
