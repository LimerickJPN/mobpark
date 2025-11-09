import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Anchor } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { VehicleEditForm } from "@/components/listing/vehicle-edit-form"

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: vehicle, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single()

  if (error || !vehicle) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
            <Anchor className="h-6 w-6" />
            <span>VehicleShare</span>
          </Link>

          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">ダッシュボード</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">掲載を編集</h1>
          <p className="text-muted-foreground">乗り物の情報を更新します</p>
        </div>

        <VehicleEditForm vehicle={vehicle} />
      </div>
    </div>
  )
}
