declare module "@supabase/ssr" {
  export type CookieOptions = {
    domain?: string;
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    sameSite?: boolean | "lax" | "strict" | "none";
    secure?: boolean;
  };
  export type CookieMethods = {
    get: (name: string) => string | null | undefined;
    set: (name: string, value: string, options: CookieOptions) => void;
    remove: (name: string, options: CookieOptions) => void;
  };
  export function createBrowserClient<Database = any, SchemaName extends string & keyof Database = "public" extends keyof Database ? "public" : string & keyof Database>(
    supabaseUrl: string,
    supabaseKey: string,
    options?: any
  ): any;
  export function createServerClient<Database = any, SchemaName extends string & keyof Database = "public" extends keyof Database ? "public" : string & keyof Database>(
    supabaseUrl: string,
    supabaseKey: string,
    options: {
      cookies: CookieMethods;
    } & any
  ): any;
}
