"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signUp } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", password: "" });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const parsed = schema.safeParse(formData);
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    try {
      await signUp(formData);
      toast({ title: "Account created", description: "Welcome to Ojamart! Please sign in." });
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
      toast({ title: "Registration failed", description: err.message || "Please try again", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-sm bg-oj-red flex items-center justify-center text-white font-bold text-xl">
              O
            </div>
            <span className="font-bold text-xl tracking-tight text-oj-black">Ojamart</span>
          </Link>
          <h2 className="text-2xl font-bold text-oj-black mb-2">Create an account</h2>
          <p className="text-oj-gray-800">Join Ojamart today</p>
        </div>
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 text-red-800 text-sm flex items-center gap-2">
            <span className="w-4 h-4">⚠</span>
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-oj-black">Full Name</label>
            <Input
              type="text"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              leftIcon={<User className="w-4 h-4 text-oj-gray-600" />}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-oj-black">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              leftIcon={<Mail className="w-4 h-4 text-oj-gray-600" />}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-oj-black">Phone Number</label>
            <Input
              type="tel"
              placeholder="08012345678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              leftIcon={<Phone className="w-4 h-4 text-oj-gray-600" />}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-oj-black">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              leftIcon={<Lock className="w-4 h-4 text-oj-gray-600" />}
            />
          </div>
          <Button type="submit" loading={loading} className="w-full py-3 text-lg font-semibold">
            Create Account
          </Button>
        </form>
        <p className="mt-8 text-center text-sm text-oj-gray-800">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-oj-red hover:text-red-800">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
