import Link from "next/link";
import { signIn } from "@/actions/admin/auth";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastProvider } from "@/components/ui/toast";
import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: FormDataEvent) => {
    e.preventDefault();
    setLoading(true);
    const email = e.currentTarget.elements.get("email") as HTMLInputElement;
    const password = e.currentTarget.elements.get("password") as HTMLInputElement;

    try {
      await signIn(email.value, password.value);
      toast({ title: "Welcome back", description: "Signed in successfully." });
      window.location.href = "/admin";
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message || "Invalid credentials", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToastProvider>
      <div className="flex min-h-screen items-center justify-center bg-oj-gray-50">
        <div className="w-full max-w-md space-y-6 p-8 bg-white border border-oj-border rounded-2xl shadow-lg">
          <div className="text-center">
            <div className="w-12 h-12 rounded-sm bg-oj-red flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
              O
            </div>
            <h2 className="text-2xl font-bold text-oj-black">Ojamart Admin</h2>
            <p className="text-sm text-oj-gray-800 mt-2">Sign in to your administration panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-oj-black">Email</label>
              <Input type="email" name="email" placeholder="admin@ojamart.com" required className="mt-1" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-oj-black">Password</label>
                <a href="#" className="text-xs text-oj-red hover:text-red-800">Forgot password?</a>
              </div>
              <Input type="password" name="password" placeholder="••••••••" required className="mt-1" />
            </div>
            <Button type="submit" className="w-full bg-oj-red text-white font-semibold py-3 hover:bg-red-800 transition-colors disabled:opacity-70" disabled={loading}>
              {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> <span>Signing in...</span></span> : <span>Sign in <ArrowRight className="w-4 h-4 ml-1" /></span>}
            </Button>
          </form>

          <div className="text-center text-sm text-oj-gray-800 mt-6">
            <Link href="/" className="text-oj-red font-medium hover:underline">← Back to store</Link>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}