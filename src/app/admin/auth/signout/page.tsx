"use client";

import { signOut } from "@/actions/admin/auth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function SignOutPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-oj-gray-50">
      <div className="w-full max-w-sm p-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-oj-black">Sign Out</h2>
          <p className="text-sm text-oj-gray-800 mt-1">Are you sure you want to sign out?</p>
          <div className="mt-6 flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/admin")}
              className="px-4 py-2 text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                await signOut();
              }}
              className="bg-oj-red text-white font-semibold py-2 px-6 hover:bg-red-800 transition-colors"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}