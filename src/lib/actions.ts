"use server";

import { createServerClient } from "@/lib/supabase-server";
import Stripe from "stripe";
import { revalidatePath } from "next/cache";
import type { Address } from "@/lib/types";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.acacia" as unknown as Stripe.LatestApiVersion,
});

export async function createCheckoutSessionAction({
  items,
  shippingFee,
}: {
  items: { productId: string; productName: string; price: number; quantity: number }[];
  shippingFee: number;
}) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const line_items = items.map((i) => ({
    price_data: {
      currency: "ngn",
      product_data: { name: i.productName },
      unit_amount: i.price,
    },
    quantity: i.quantity,
  }));
  if (shippingFee > 0) {
    line_items.push({
      price_data: {
        currency: "ngn",
        product_data: { name: "Shipping" },
        unit_amount: shippingFee,
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    metadata: { userId: user.id },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
  });

  return { sessionId: session.id, url: session.url };
}

export async function verifyPaymentAction(sessionId: string) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") {
    return { ok: false, reason: "Payment not completed" };
  }

  // Create order from cart
  const { data: cartItems } = await supabase
    .from("cart_items")
    .select("*, products(name, price, sizes, colors)")
    .eq("user_id", user.id);

  if (!cartItems || cartItems.length === 0) {
    return { ok: false, reason: "Cart is empty" };
  }

  const subtotal = cartItems.reduce((sum, i) => sum + (i.products?.price || 0) * i.quantity, 0);
  const shippingFee = 0; // shipping already captured as a line item in Stripe; keep order shipping 0 here or pass in
  const total = subtotal + shippingFee;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      order_number: "OJM-" + Date.now().toString(36).toUpperCase(),
      status: "paid",
      subtotal,
      shipping_fee: shippingFee,
      tax: 0,
      total,
      payment_status: "paid",
      payment_intent_id: session.payment_intent as string | null,
      shipping_address: null,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  await supabase.from("order_items").insert(
    cartItems.map((i) => ({
      order_id: order.id,
      product_id: i.product_id,
      product_name: i.products?.name || "Product",
      price: i.products?.price || 0,
      size: i.size,
      color: i.color,
      quantity: i.quantity,
    }))
  );

  await supabase.from("cart_items").delete().eq("user_id", user.id);
  revalidatePath("/orders");
  revalidatePath("/account");

  return { ok: true, orderId: order.id, orderNumber: order.order_number };
}

export async function addAddressAction(address: Omit<Address, "id" | "userId" | "createdAt">) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  if (address.isDefault) {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert({ user_id: user.id, ...address })
    .select()
    .single();
  if (error) throw error;
  revalidatePath("/account");
  revalidatePath("/checkout");
  return data;
}

export async function toggleWishlistAction(productId: string) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: existing } = await supabase
    .from("wishlist")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  if (existing) {
    await supabase.from("wishlist").delete().eq("id", existing.id);
    return { added: false };
  } else {
    await supabase.from("wishlist").insert({ user_id: user.id, product_id: productId });
    return { added: true };
  }
}

export async function signOutAction() {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}

