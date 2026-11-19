import { createServerClient } from "@/lib/supabase-server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastProvider } from "@/components/ui/toast";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    store_name: "",
    store_email: "",
    store_phone: "",
    store_address: "",
    currency: "NGN",
    country: "Nigeria",
  });

  return (
    <ToastProvider>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-oj-black mb-6">Store Settings</h1>
        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-oj-black">General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                  const supabase = await createServerClient();
                  await supabase.from("store_settings").upsert(formData);
                  toast({ title: "Saved", description: "Store settings updated successfully." });
                } catch (err: any) {
                  toast({ title: "Error", description: err.message, variant: "destructive" });
                } finally {
                  setLoading(false);
                }
              }} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-oj-black">Store Name</label>
                    <Input value={formData.store_name} onChange={(e) => setFormData({ ...formData, store_name: e.target.value })} placeholder="Ojamart" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-oj-black">Store Email</label>
                    <Input type="email" value={formData.store_email} onChange={(e) => setFormData({ ...formData, store_email: e.target.value })} placeholder="support@ojamart.com" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-oj-black">Phone</label>
                    <Input value={formData.store_phone} onChange={(e) => setFormData({ ...formData, store_phone: e.target.value })} placeholder="+234 1 234 5678" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-oj-black">Country</label>
                    <Input value={formData.store_country || formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} placeholder="Nigeria" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-oj-black">Address</label>
                  <Input value={formData.store_address} onChange={(e) => setFormData({ ...formData, store_address: e.target.value })} placeholder="123 Street, City" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-oj-black">Currency</label>
                    <Input value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} placeholder="NGN" />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-oj-red text-white font-semibold py-3 hover:bg-red-800 transition-colors disabled:opacity-70" disabled={loading}>
                  {loading ? "Saving..." : "Save Settings"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToastProvider>
  );
}