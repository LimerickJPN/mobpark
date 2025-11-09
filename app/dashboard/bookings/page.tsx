import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/server"
import { BookingCard } from "@/components/bookings/booking-card"

export default async function BookingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/bookings")
  }

  // Get bookings as renter
  const { data: renterBookings } = await supabase
    .from("bookings")
    .select(`
      *,
      vehicles (
        id,
        title,
        images,
        category,
        location,
        profiles (
          display_name,
          avatar_url
        )
      )
    `)
    .eq("renter_id", user.id)
    .order("created_at", { ascending: false })

  // Get bookings as owner
  const { data: ownerBookings } = await supabase
    .from("bookings")
    .select(`
      *,
      vehicles!inner (
        id,
        title,
        images,
        category,
        location,
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
        <h1 className="text-3xl font-bold mb-2">予約管理</h1>
        <p className="text-muted-foreground">予約の送信と受信を管理</p>
      </div>

      <Tabs defaultValue="my-bookings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="my-bookings">予約した ({renterBookings?.length || 0})</TabsTrigger>
          <TabsTrigger value="received-bookings">受け取った予約 ({ownerBookings?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="my-bookings" className="space-y-4">
          {!renterBookings || renterBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">予約はまだありません</p>
                <Button asChild>
                  <Link href="/vehicles">乗り物を探す</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            renterBookings.map((booking) => <BookingCard key={booking.id} booking={booking} isOwner={false} />)
          )}
        </TabsContent>

        <TabsContent value="received-bookings" className="space-y-4">
          {!ownerBookings || ownerBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">受け取った予約はありません</p>
              </CardContent>
            </Card>
          ) : (
            ownerBookings.map((booking) => <BookingCard key={booking.id} booking={booking} isOwner={true} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
