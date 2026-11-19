import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  await supabase.auth.getUser();

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const isLoginPage = request.nextUrl.pathname.startsWith("/admin/login");
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      if (!isLoginPage) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } else {
      // Check if user is admin
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }

      if (isLoginPage) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/account/:path*", "/checkout/:path*", "/orders/:path*", "/admin/:path*"],
};
