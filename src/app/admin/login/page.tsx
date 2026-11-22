"use client";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string) || "";
    const password = (formData.get("password") as string) || "";

    try {
      await signIn(email, password);
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
              <label className="block text-sm font-medium text-oj-black">Password</label>
              <Input type="password" name="password" placeholder="••••••••" required className="mt-1" />
            </div>
            <Button type="submit" disabled={loading} className="w-full py-3 flex items-center justify-center gap-2">
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center pt-4 border-t border-oj-border">
            <Link href="/" className="text-sm text-oj-gray-800 hover:text-oj-black">
              Return to storefront
            </Link>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
