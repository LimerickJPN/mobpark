import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Car, Plane, Bike, BikeIcon, Construction, Ship, Check, Shield, Wrench } from "lucide-react"
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
    icon: BikeIcon,
    description: "ロードバイク、マウンテンバイクなど",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-primary">
            MobPark
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              MobParkとは
            </Link>
            <Link href="/vehicles" className="text-sm font-medium hover:text-primary transition-colors">
              乗り物を探す
            </Link>
            <Link href="/list-vehicle" className="text-sm font-medium hover:text-primary transition-colors">
              乗り物を掲載
            </Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
              料金プラン
            </Link>
            <Link href="/articles" className="text-sm font-medium hover:text-primary transition-colors">
              お役立ち記事
            </Link>
            <Link href="/news" className="text-sm font-medium hover:text-primary transition-colors">
              お知らせ
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
              <Button size="lg" style={{ backgroundColor: "#0E56C9" }} className="hover:opacity-90" asChild>
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

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">料金体系</h2>
            <p className="text-muted-foreground text-lg">シンプルで分かりやすい料金プラン</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl">アカウント登録</h3>
                <div className="text-4xl font-bold text-primary">0円</div>
                <p className="text-sm text-muted-foreground">無料で始められます</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl">乗り物掲載費用</h3>
                <div className="text-4xl font-bold text-primary">0円</div>
                <p className="text-sm text-muted-foreground">掲載も無料です</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl">売買手数料</h3>
                <div className="text-4xl font-bold text-primary">2.49%~</div>
                <p className="text-sm text-muted-foreground">業界最安水準の手数料</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">お客様の声</h2>
            <p className="text-muted-foreground text-lg">実際にご利用いただいたお客様からの声</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    T
                  </div>
                  <div>
                    <p className="font-semibold">宮城県 Tさん</p>
                    <p className="text-sm text-muted-foreground">法人利用</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  建設機械のレンタルで利用しました。必要な時だけ借りられるので、固定費を大幅に削減できました。プラットフォームも使いやすく、手続きも簡単でした。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    K
                  </div>
                  <div>
                    <p className="font-semibold">東京都 Kさん</p>
                    <p className="text-sm text-muted-foreground">個人利用</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  使っていない車をシェアに出したところ、月に数万円の副収入になりました。審査もしっかりしているので、安心して貸し出せています。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    R
                  </div>
                  <div>
                    <p className="font-semibold">長崎県 Rさん</p>
                    <p className="text-sm text-muted-foreground">個人利用</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  ボートを購入する前に、まずレンタルで試してみました。気に入ったのでそのまま購入申請できたのが便利でした。サポートも親切で助かりました。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">安心のサポート</h2>
            <p className="text-muted-foreground text-lg">充実したサポート体制で安心してご利用いただけます</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardContent className="p-8 space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto">
                  <Check className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-xl text-center">サポート満足度91.2%</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  乗り物のレンタル、購入、貸出、売却においてワンストップでしっかりサポート。MobParkは各業界のプロにコンサルティングを委託しているため安心してご利用いただけます。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto">
                  <Wrench className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-xl text-center">整備もお任せ！</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  MobParkでは売買やシェアのみならず整備のサポートも可能。提携する整備工場ネットワークを通じて、全国どこでも高品質な整備サービスをご提供します。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-xl text-center">厳正審査を実施</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  売買やシェアの際には、事前に本人確認や車両状態の厳正な審査を実施。安全性と信頼性を最優先し、トラブルのない取引環境を提供しています。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
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
      <section className="py-16 md:py-24 bg-muted/30">
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
      <footer className="border-t py-12 mt-auto bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo and Description */}
            <div className="space-y-4">
              <div className="font-bold text-lg text-primary">MobPark</div>
              <p className="text-sm text-muted-foreground">
                船、自動車、飛行機、バイク、建設機械、自転車のレンタル・シェア・売買プラットフォーム
              </p>
            </div>

            {/* Service Links */}
            <div>
              <h3 className="font-semibold mb-4">サービス</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    MobParkとは
                  </Link>
                </li>
                <li>
                  <Link href="/vehicles" className="text-muted-foreground hover:text-foreground transition-colors">
                    乗り物を探す
                  </Link>
                </li>
                <li>
                  <Link href="/list-vehicle" className="text-muted-foreground hover:text-foreground transition-colors">
                    乗り物を掲載
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                    料金プラン
                  </Link>
                </li>
                <li>
                  <Link href="/articles" className="text-muted-foreground hover:text-foreground transition-colors">
                    お役立ち記事
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="text-muted-foreground hover:text-foreground transition-colors">
                    お知らせ
                  </Link>
                </li>
                <li>
                  <Link href="/ads" className="text-muted-foreground hover:text-foreground transition-colors">
                    広告掲載のお申込み
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Info */}
            <div>
              <h3 className="font-semibold mb-4">会社情報</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://limerick.co.jp/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    運営会社
                  </a>
                </li>
                <li>
                  <Link href="/careers" className="text-muted-foreground hover:text-foreground transition-colors">
                    採用情報
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                    お問い合わせ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold mb-4">法的情報</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                    利用規約
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                    プライバシーポリシー
                  </Link>
                </li>
                <li>
                  <Link
                    href="/commercial-transaction"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    特定商取引法に基づく表示
                  </Link>
                </li>
                <li>
                  <Link
                    href="/payment-services"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    資金決済法に基づく表示
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t pt-8">
            <p className="text-center text-sm text-muted-foreground">Copyright Limerick Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
