import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Car, Plane, Bike, Construction, Ship } from "lucide-react"
import type { VehicleCategory } from "@/lib/types"

const categories: { id: VehicleCategory; name: string; icon: any; description: string }[] = [
  {
    id: "boat",
    name: "船",
    icon: Ship,
    description: "ヨット、クルーザー、ボートなど",
  },
  {
    id: "car",
    name: "自動車",
    icon: Car,
    description: "高級車、SUV、スポーツカーなど",
  },
  {
    id: "plane",
    name: "飛行機",
    icon: Plane,
    description: "プライベートジェット、セスナなど",
  },
  {
    id: "motorcycle",
    name: "バイク",
    icon: Bike,
    description: "スポーツバイク、ツーリングバイクなど",
  },
  {
    id: "construction",
    name: "建設機械",
    icon: Construction,
    description: "重機、クレーン、ショベルカーなど",
  },
  {
    id: "bicycle",
    name: "自転車",
    icon: Bike,
    description: "ロードバイク、マウンテンバイクなど",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              M
            </div>
            <span className="text-primary">MobPark</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/vehicles" className="text-sm font-medium hover:text-primary transition-colors">
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

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
              乗りたい乗り物を、
              <br />
              乗りたい時に
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-balance">
              船、自動車、飛行機、バイク、建設機械、自転車のレンタル・シェア・売買プラットフォーム
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild>
                <Link href="/vehicles">乗り物を探す</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/list-vehicle">乗り物を掲載する</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">カテゴリーから探す</h2>
            <p className="text-muted-foreground text-lg">様々な種類の乗り物をレンタル、シェア、購入できます</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Link key={category.id} href={`/vehicles?category=${category.id}`}>
                  <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                    <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-xl mb-2">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">プラットフォームの特徴</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-lg">簡単予約</h3>
              <p className="text-sm text-muted-foreground">乗りたい乗り物を見つけて、オンラインで簡単に予約できます</p>
            </div>

            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-lg">収入源に</h3>
              <p className="text-sm text-muted-foreground">使わない乗り物をシェアして、副収入を得られます</p>
            </div>

            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-lg">試乗後に購入</h3>
              <p className="text-sm text-muted-foreground">レンタルして気に入ったら、そのまま購入申請できます</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 bg-primary text-primary-foreground rounded-2xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">今すぐ始めましょう</h2>
            <p className="text-lg text-primary-foreground/90">法人・個人問わず、どなたでもご利用いただけます</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/sign-up">無料で登録</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link href="/vehicles">乗り物を見る</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 font-bold">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                M
              </div>
              <span className="text-primary">MobPark</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:text-foreground transition-colors">
                利用規約
              </Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                プライバシーポリシー
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                お問い合わせ
              </Link>
            </div>
          </div>
          <div className="text-center mt-6 text-sm text-muted-foreground">© 2025 MobPark. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
