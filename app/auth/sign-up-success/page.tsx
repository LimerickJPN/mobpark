import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Anchor } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b p-4">
        <div className="container mx-auto">
          <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
            <Anchor className="h-6 w-6" />
            <span>VehicleShare</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">登録ありがとうございます</CardTitle>
              <CardDescription>メールを確認してください</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                ご登録いただいたメールアドレスに確認メールを送信しました。
                メール内のリンクをクリックしてアカウントを有効化してください。
              </p>
              <Button asChild className="w-full">
                <Link href="/">ホームに戻る</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
