import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/server"
import { PurchaseRequestCard } from "@/components/purchases/purchase-request-card"

export default async function PurchasesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/purchases")
  }

  // Get purchase requests as buyer
  const { data: buyerRequests } = await supabase
    .from("purchase_requests")
    .select(`
      *,
      vehicles (
        id,
        title,
        images,
        category,
        listing_type,
        profiles (
          display_name,
          avatar_url
        )
      )
    `)
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false })

  // Get purchase requests as seller (owner of vehicles)
  const { data: sellerRequests } = await supabase
    .from("purchase_requests")
    .select(`
      *,
      vehicles!inner (
        id,
        title,
        images,
        category,
        listing_type,
        owner_id
      ),
      profiles (
        display_name,
        avatar_url
      )
    `)
    .eq("vehicles.owner_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">購入申請</h1>
        <p className="text-muted-foreground">購入申請の送信と受信を管理</p>
      </div>

      <Tabs defaultValue="sent" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sent">送信した申請 ({buyerRequests?.length || 0})</TabsTrigger>
          <TabsTrigger value="received">受信した申請 ({sellerRequests?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="sent" className="space-y-4">
          {!buyerRequests || buyerRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">購入申請はまだありません</p>
                <Button asChild>
                  <Link href="/vehicles">乗り物を探す</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            buyerRequests.map((request) => <PurchaseRequestCard key={request.id} request={request} isSeller={false} />)
          )}
        </TabsContent>

        <TabsContent value="received" className="space-y-4">
          {!sellerRequests || sellerRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">受信した購入申請はありません</p>
              </CardContent>
            </Card>
          ) : (
            sellerRequests.map((request) => <PurchaseRequestCard key={request.id} request={request} isSeller={true} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
