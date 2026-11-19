import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RolloutsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-oj-black mb-6">Rollouts</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-oj-black">Feature Rollouts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-oj-gray-800">
            <p>No active rollouts. Manage feature flags and gradual releases here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}