import { createServerClient } from "@/lib/supabase-server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function GrowthPage() {
  const supabase = await createServerClient();
  const { data: events } = await supabase
    .from("analytics_events")
    .select("event_name, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-oj-black mb-6">Growth</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-oj-black">Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Visitors</span><span className="font-bold text-oj-black">--</span></div>
              <div className="flex justify-between"><span>Added to Cart</span><span className="font-bold text-oj-black">--</span></div>
              <div className="flex justify-between"><span>Checkout Started</span><span className="font-bold text-oj-black">--</span></div>
              <div className="flex justify-between"><span>Completed Purchase</span><span className="font-bold text-oj-black">--</span></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-oj-black">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>--</span><span className="font-bold text-oj-black">--</span></div>
              <div className="flex justify-between"><span>--</span><span className="font-bold text-oj-black">--</span></div>
              <div className="flex justify-between"><span>--</span><span className="font-bold text-oj-black">--</span></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-oj-black">Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {(events || []).map((e) => (
                <li key={e.id} className="flex justify-between py-1 border-b border-oj-border/50 last:border-0">
                  <span className="text-oj-gray-800">{e.event_name}</span>
                  <span className="text-xs text-oj-gray-500">{new Date(e.created_at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}