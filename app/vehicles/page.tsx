import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Anchor } from "lucide-react"
import { VehicleFilters } from "@/components/vehicles/vehicle-filters"
import { VehicleList } from "@/components/vehicles/vehicle-list"
import { VehicleListSkeleton } from "@/components/vehicles/vehicle-list-skeleton"

export default function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
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
            <Link href="/vehicles" className="text-sm font-medium text-primary">
              乗り物を探す
            </Link>
            <Link href="/list-vehicle" className="text-sm font-medium hover:text-primary transition-colors">
              乗り物を掲載
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              サービスについて
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">ログイン</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">新規登録</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">乗り物を探す</h1>
          <p className="text-muted-foreground">お好みの条件で乗り物を検索できます</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <Suspense
              fallback={
                <div className="space-y-6 animate-pulse">
                  <div className="h-64 bg-muted rounded-lg" />
                  <div className="h-48 bg-muted rounded-lg" />
                </div>
              }
            >
              <VehicleFilters />
            </Suspense>
          </aside>

          {/* Vehicle List */}
          <div className="lg:col-span-3">
            <Suspense fallback={<VehicleListSkeleton />}>
              <VehicleList searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
