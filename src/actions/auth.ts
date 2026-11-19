"use server";

import { createServerClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function signIn(email: string, password: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  revalidatePath("/", "layout");
}

export async function signUp(data: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}) {
  const supabase = await createServerClient();
  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
        phone: data.phone,
      },
    },
  });
  if (error) throw error;
  revalidatePath("/", "layout");
}

export async function signOut() {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}
