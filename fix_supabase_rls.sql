-- ====================================================================
-- Ojamart Fix: Infinite Recursion in Supabase RLS Policies
-- Run this in your Supabase Dashboard -> SQL Editor -> Run
-- ====================================================================

-- 1. Create a SECURITY DEFINER function to check admin role
-- This bypasses RLS when reading public.profiles, breaking any recursion loop.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Grant execute to authenticated and anon users
grant execute on function public.is_admin() to authenticated, anon;

-- 2. Fix the profile table policies
drop policy if exists "Admins can manage all profiles" on public.profiles;
create policy "Admins can manage all profiles" on public.profiles
  for all using (public.is_admin());

-- 3. Fix all other admin policies to use public.is_admin()
drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories" on public.categories
  for all using (public.is_admin());

drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products" on public.products
  for all using (public.is_admin());

drop policy if exists "Admins can manage orders" on public.orders;
create policy "Admins can manage orders" on public.orders
  for all using (public.is_admin());

drop policy if exists "Admins can manage order items" on public.order_items;
create policy "Admins can manage order items" on public.order_items
  for all using (public.is_admin());

drop policy if exists "Admins can manage addresses" on public.addresses;
create policy "Admins can manage addresses" on public.addresses
  for all using (public.is_admin());

drop policy if exists "Admins can manage draft orders" on public.draft_orders;
create policy "Admins can manage draft orders" on public.draft_orders
  for all using (public.is_admin());

drop policy if exists "Admins can manage draft order items" on public.draft_order_items;
create policy "Admins can manage draft order items" on public.draft_order_items
  for all using (public.is_admin());

drop policy if exists "Admins can manage discounts" on public.discounts;
create policy "Admins can manage discounts" on public.discounts
  for all using (public.is_admin());

drop policy if exists "Admins can manage blog posts" on public.blog_posts;
create policy "Admins can manage blog posts" on public.blog_posts
  for all using (public.is_admin());

drop policy if exists "Admins can manage markets" on public.markets;
create policy "Admins can manage markets" on public.markets
  for all using (public.is_admin());

drop policy if exists "Admins can manage market catalogs" on public.market_catalogs;
create policy "Admins can manage market catalogs" on public.market_catalogs
  for all using (public.is_admin());

drop policy if exists "Admins can manage files" on public.files;
create policy "Admins can manage files" on public.files
  for all using (public.is_admin());

drop policy if exists "Admins can manage menus" on public.menus;
create policy "Admins can manage menus" on public.menus
  for all using (public.is_admin());

drop policy if exists "Admins can manage menu items" on public.menu_items;
create policy "Admins can manage menu items" on public.menu_items
  for all using (public.is_admin());

drop policy if exists "Admins can manage customer segments" on public.customer_segments;
create policy "Admins can manage customer segments" on public.customer_segments
  for all using (public.is_admin());

drop policy if exists "Admins can manage companies" on public.companies;
create policy "Admins can manage companies" on public.companies
  for all using (public.is_admin());

drop policy if exists "Admins can manage company members" on public.company_members;
create policy "Admins can manage company members" on public.company_members
  for all using (public.is_admin());

drop policy if exists "Admins can manage gift cards" on public.gift_cards;
create policy "Admins can manage gift cards" on public.gift_cards
  for all using (public.is_admin());

drop policy if exists "Admins can manage purchase orders" on public.purchase_orders;
create policy "Admins can manage purchase orders" on public.purchase_orders
  for all using (public.is_admin());

drop policy if exists "Admins can manage purchase order items" on public.purchase_order_items;
create policy "Admins can manage purchase order items" on public.purchase_order_items
  for all using (public.is_admin());

drop policy if exists "Admins can manage transfers" on public.transfers;
create policy "Admins can manage transfers" on public.transfers
  for all using (public.is_admin());

drop policy if exists "Admins can manage transfer items" on public.transfer_items;
create policy "Admins can manage transfer items" on public.transfer_items
  for all using (public.is_admin());

drop policy if exists "Admins can manage inventory logs" on public.inventory_logs;
create policy "Admins can manage inventory logs" on public.inventory_logs
  for all using (public.is_admin());

drop policy if exists "Admins can manage metaobjects" on public.metaobjects;
create policy "Admins can manage metaobjects" on public.metaobjects
  for all using (public.is_admin());

drop policy if exists "Admins can manage store settings" on public.store_settings;
create policy "Admins can manage store settings" on public.store_settings
  for all using (public.is_admin());

drop policy if exists "Admins can manage analytics events" on public.analytics_events;
create policy "Admins can manage analytics events" on public.analytics_events
  for all using (public.is_admin());
