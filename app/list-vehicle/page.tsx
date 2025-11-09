import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Anchor } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { VehicleListingForm } from "@/components/listing/vehicle-listing-form"

export default async function ListVehiclePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/list-vehicle")
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
            <Anchor className="h-6 w-6" />
            <span>VehicleShare</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/vehicles" className="text-sm font-medium hover:text-primary transition-colors">
              乗り物を探す
            </Link>
            <Link href="/list-vehicle" className="text-sm font-medium text-primary">
              乗り物を掲載
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              サービスについて
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">ダッシュボード</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">乗り物を掲載</h1>
          <p className="text-muted-foreground">あなたの乗り物をレンタル、シェア、または売却しましょう</p>
        </div>

        <VehicleListingForm />
      </div>
    </div>
  )
}
