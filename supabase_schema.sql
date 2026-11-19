-- Ojamart Database Schema
-- Run this in your Supabase SQL Editor to set up the required tables.

create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  role text default 'customer',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text,
  price integer not null default 0,
  category_id uuid references public.categories(id),
  stock_quantity integer default 0,
  images text[] default '{}',
  sizes text[] default '{}',
  colors text[] default '{}',
  is_active boolean default true,
  is_featured boolean default false,
  is_flash_deal boolean default false,
  flash_deal_price integer,
  sku text,
  weight text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.cart_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  product_id uuid references public.products(id) not null,
  size text not null,
  color text not null,
  quantity integer not null default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, product_id, size, color)
);

create table public.orders (
  id uuid default gen_random_uuid() primary key,
  order_number text unique not null,
  user_id uuid references auth.users not null,
  status text default 'pending',
  subtotal integer default 0,
  shipping_fee integer default 0,
  tax integer default 0,
  total integer default 0,
  payment_status text default 'unpaid',
  payment_intent_id text,
  shipping_address jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id),
  product_name text not null,
  price integer not null,
  size text not null,
  color text not null,
  quantity integer not null default 1,
  created_at timestamptz default now()
);

create table public.addresses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  full_name text not null,
  phone text not null,
  address_line text not null,
  city text not null,
  state text not null,
  postal_code text,
  country text default 'Nigeria',
  is_default boolean default false,
  created_at timestamptz default now()
);

create table public.wishlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  product_id uuid references public.products(id) not null,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_active on public.products(is_active);
create index if not exists idx_products_featured on public.products(is_featured);
create index if not exists idx_products_flash on public.products(is_flash_deal);
create index if not exists idx_cart_items_user on public.cart_items(user_id);
create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_addresses_user on public.addresses(user_id);
create index if not exists idx_wishlist_user on public.wishlist(user_id);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.addresses enable row level security;
alter table public.wishlist enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Public can view active categories" on public.categories for select using (is_active = true);
create policy "Public can view active products" on public.products for select using (is_active = true);

create policy "Users can view own cart items" on public.cart_items for select using (auth.uid() = user_id);
create policy "Users can insert own cart items" on public.cart_items for insert with check (auth.uid() = user_id);
create policy "Users can update own cart items" on public.cart_items for update using (auth.uid() = user_id);
create policy "Users can delete own cart items" on public.cart_items for delete using (auth.uid() = user_id);

create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users can insert own orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "Users can update own orders" on public.orders for update using (auth.uid() = user_id);

create policy "Users can view own order items" on public.order_items for select using (
  exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);
create policy "Users can insert own order items" on public.order_items for insert with check (
  exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);

create policy "Users can view own addresses" on public.addresses for select using (auth.uid() = user_id);
create policy "Users can insert own addresses" on public.addresses for insert with check (auth.uid() = user_id);
create policy "Users can update own addresses" on public.addresses for update using (auth.uid() = user_id);
create policy "Users can delete own addresses" on public.addresses for delete using (auth.uid() = user_id);

create policy "Users can view own wishlist" on public.wishlist for select using (auth.uid() = user_id);
create policy "Users can insert own wishlist" on public.wishlist for insert with check (auth.uid() = user_id);
create policy "Users can delete own wishlist" on public.wishlist for delete using (auth.uid() = user_id);

insert into public.categories (name, slug, description, sort_order) values
  ('Electronics', 'electronics', 'Phones, laptops, accessories and more', 1),
  ('Fashion', 'fashion', 'Clothing, shoes and accessories', 2),
  ('Home & Living', 'home-living', 'Furniture, decor and household essentials', 3),
  ('Beauty & Personal Care', 'beauty', 'Skincare, makeup and personal care', 4),
  ('Groceries', 'groceries', 'Food and everyday essentials', 5),
  ('Sports & Outdoors', 'sports-outdoors', 'Fitness gear and outdoor equipment', 6)
on conflict (slug) do nothing;

-- ============================================
-- ADMIN PANEL TABLES
-- ============================================

create table public.draft_orders (
  id uuid default gen_random_uuid() primary key,
  order_number text unique not null,
  customer_id uuid references auth.users,
  customer_email text,
  customer_name text,
  customer_phone text,
  status text default 'draft',
  subtotal integer default 0,
  shipping_fee integer default 0,
  tax integer default 0,
  total integer default 0,
  payment_status text default 'unpaid',
  shipping_address jsonb,
  notes text,
  created_by uuid references auth.users,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.draft_order_items (
  id uuid default gen_random_uuid() primary key,
  draft_order_id uuid references public.draft_orders(id) on delete cascade not null,
  product_id uuid references public.products(id),
  product_name text not null,
  price integer not null,
  size text not null,
  color text not null,
  quantity integer not null default 1,
  created_at timestamptz default now()
);

create table public.discounts (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  name text not null,
  description text,
  type text not null default 'percentage',
  value integer not null,
  min_purchase integer default 0,
  usage_limit integer,
  usage_count integer default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean default true,
  applies_to text default 'all',
  created_by uuid references auth.users,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.blog_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  featured_image_url text,
  author_id uuid references auth.users,
  status text default 'draft',
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.markets (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  code text unique not null,
  currency text not null default 'NGN',
  is_active boolean default true,
  tax_rate integer default 0,
  shipping_fee integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.market_catalogs (
  id uuid default gen_random_uuid() primary key,
  market_id uuid references public.markets(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  price_override integer,
  is_available boolean default true,
  created_at timestamptz default now(),
  unique(market_id, product_id)
);

create table public.files (
  id uuid default gen_random_uuid() primary key,
  file_name text not null,
  file_path text not null,
  file_size integer,
  mime_type text,
  url text,
  uploaded_by uuid references auth.users,
  created_at timestamptz default now()
);

create table public.menus (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.menu_items (
  id uuid default gen_random_uuid() primary key,
  menu_id uuid references public.menus(id) on delete cascade not null,
  parent_id uuid references public.menu_items(id) on delete cascade null,
  title text not null,
  url text,
  handle text,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.customer_segments (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  filters jsonb default '{}',
  customer_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.companies (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  email text,
  phone text,
  address text,
  tax_id text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.company_members (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references public.companies(id) on delete cascade not null,
  user_id uuid references auth.users not null,
  role text default 'member',
  created_at timestamptz default now(),
  unique(company_id, user_id)
);

create table public.gift_cards (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  balance integer not null,
  original_balance integer not null,
  is_active boolean default true,
  expires_at timestamptz,
  created_by uuid references auth.users,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.purchase_orders (
  id uuid default gen_random_uuid() primary key,
  po_number text unique not null,
  supplier_name text not null,
  status text default 'draft',
  total integer default 0,
  expected_date timestamptz,
  received_date timestamptz,
  notes text,
  created_by uuid references auth.users,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.purchase_order_items (
  id uuid default gen_random_uuid() primary key,
  purchase_order_id uuid references public.purchase_orders(id) on delete cascade not null,
  product_id uuid references public.products(id),
  product_name text not null,
  sku text,
  quantity_ordered integer not null,
  quantity_received integer default 0,
  unit_cost integer not null,
  created_at timestamptz default now()
);

create table public.transfers (
  id uuid default gen_random_uuid() primary key,
  transfer_number text unique not null,
  from_location text not null,
  to_location text not null,
  status text default 'draft',
  created_by uuid references auth.users,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.transfer_items (
  id uuid default gen_random_uuid() primary key,
  transfer_id uuid references public.transfers(id) on delete cascade not null,
  product_id uuid references public.products(id),
  product_name text not null,
  quantity integer not null,
  created_at timestamptz default now()
);

create table public.inventory_logs (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) not null,
  change_type text not null,
  change_quantity integer not null,
  previous_quantity integer not null,
  new_quantity integer not null,
  reference_type text,
  reference_id uuid,
  notes text,
  created_by uuid references auth.users,
  created_at timestamptz default now()
);

create table public.metaobjects (
  id uuid default gen_random_uuid() primary key,
  type text not null,
  key text unique not null,
  value jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.store_settings (
  id uuid default gen_random_uuid() primary key,
  store_name text default 'Ojamart',
  store_email text,
  store_phone text,
  store_address text,
  store_description text,
  logo_url text,
  favicon_url text,
  currency text default 'NGN',
  country text default 'Nigeria',
  tax_enabled boolean default false,
  tax_rate integer default 0,
  low_stock_threshold integer default 10,
  updated_at timestamptz default now()
);

create table public.analytics_events (
  id uuid default gen_random_uuid() primary key,
  event_name text not null,
  event_data jsonb default '{}',
  user_id uuid references auth.users,
  created_at timestamptz default now()
);

-- ============================================
-- INDEXES
-- ============================================

create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_active on public.products(is_active);
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_addresses_user on public.addresses(user_id);
create index if not exists idx_wishlist_user on public.wishlist(user_id);

create index if not exists idx_draft_orders_status on public.draft_orders(status);
create index if not exists idx_draft_orders_customer on public.draft_orders(customer_id);

create index if not exists idx_discounts_code on public.discounts(code);
create index if not exists idx_discounts_active on public.discounts(is_active);

create index if not exists idx_blog_posts_slug on public.blog_posts(slug);
create index if not exists idx_blog_posts_status on public.blog_posts(status);

create index if not exists idx_markets_code on public.markets(code);

create index if not exists idx_menu_items_menu on public.menu_items(menu_id);

create index if not exists idx_inventory_logs_product on public.inventory_logs(product_id);
create index if not exists idx_inventory_logs_created on public.inventory_logs(created_at);

create index if not exists idx_analytics_events_name on public.analytics_events(event_name);
create index if not exists idx_analytics_events_created on public.analytics_events(created_at);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.addresses enable row level security;
alter table public.wishlist enable row level security;

alter table public.draft_orders enable row level security;
alter table public.draft_order_items enable row level security;
alter table public.discounts enable row level security;
alter table public.blog_posts enable row level security;
alter table public.markets enable row level security;
alter table public.market_catalogs enable row level security;
alter table public.files enable row level security;
alter table public.menus enable row level security;
alter table public.menu_items enable row level security;
alter table public.customer_segments enable row level security;
alter table public.companies enable row level security;
alter table public.company_members enable row level security;
alter table public.gift_cards enable row level security;
alter table public.purchase_orders enable row level security;
alter table public.purchase_order_items enable row level security;
alter table public.transfers enable row level security;
alter table public.transfer_items enable row level security;
alter table public.inventory_logs enable row level security;
alter table public.metaobjects enable row level security;
alter table public.store_settings enable row level security;
alter table public.analytics_events enable row level security;

-- ============================================
-- RLS POLICIES: Core tables
-- ============================================

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Public can view active categories" on public.categories for select using (is_active = true);
create policy "Public can view active products" on public.products for select using (is_active = true);

create policy "Users can view own cart items" on public.cart_items for select using (auth.uid() = user_id);
create policy "Users can insert own cart items" on public.cart_items for insert with check (auth.uid() = user_id);
create policy "Users can update own cart items" on public.cart_items for update using (auth.uid() = user_id);
create policy "Users can delete own cart items" on public.cart_items for delete using (auth.uid() = user_id);

create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users can insert own orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "Users can update own orders" on public.orders for update using (auth.uid() = user_id);

create policy "Users can view own order items" on public.order_items for select using (
  exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);
create policy "Users can insert own order items" on public.order_items for insert with check (
  exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);

create policy "Users can view own addresses" on public.addresses for select using (auth.uid() = user_id);
create policy "Users can insert own addresses" on public.addresses for insert with check (auth.uid() = user_id);
create policy "Users can update own addresses" on public.addresses for update using (auth.uid() = user_id);
create policy "Users can delete own addresses" on public.addresses for delete using (auth.uid() = user_id);

create policy "Users can view own wishlist" on public.wishlist for select using (auth.uid() = user_id);
create policy "Users can insert own wishlist" on public.wishlist for insert with check (auth.uid() = user_id);
create policy "Users can delete own wishlist" on public.wishlist for delete using (auth.uid() = user_id);


-- ============================================
-- RLS POLICIES: Admin tables (part 1)
-- ============================================

create policy "Admins can manage all profiles" on public.profiles for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "Admins can manage categories" on public.categories for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can manage products" on public.products for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can manage orders" on public.orders for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can manage order items" on public.order_items for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can manage addresses" on public.addresses for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "Admins can manage draft orders" on public.draft_orders for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can manage draft order items" on public.draft_order_items for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Customers can view own draft orders" on public.draft_orders for select using (auth.uid() = customer_id);

create policy "Admins can manage discounts" on public.discounts for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Public can view active discounts" on public.discounts for select using (is_active = true);


create policy "Admins can manage blog posts" on public.blog_posts for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Public can view published blog posts" on public.blog_posts for select using (status = 'published');

create policy "Admins can manage markets" on public.markets for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Public can view active markets" on public.markets for select using (is_active = true);

create policy "Admins can manage market catalogs" on public.market_catalogs for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Public can view market catalogs" on public.market_catalogs for select using (is_available = true);

create policy "Admins can manage files" on public.files for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Public can view files" on public.files for select using (true);

create policy "Admins can manage menus" on public.menus for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can manage menu items" on public.menu_items for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Public can view active menus" on public.menus for select using (is_active = true);
create policy "Public can view active menu items" on public.menu_items for select using (is_active = true);

create policy "Admins can manage customer segments" on public.customer_segments for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "Admins can manage companies" on public.companies for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Company members can view own company" on public.companies for select using (
  exists (select 1 from public.company_members where company_id = id and user_id = auth.uid())
);

create policy "Admins can manage company members" on public.company_members for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "Admins can manage gift cards" on public.gift_cards for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Public can view active gift cards" on public.gift_cards for select using (is_active = true);

create policy "Admins can manage purchase orders" on public.purchase_orders for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can manage purchase order items" on public.purchase_order_items for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "Admins can manage transfers" on public.transfers for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can manage transfer items" on public.transfer_items for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "Admins can manage inventory logs" on public.inventory_logs for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Public can view inventory logs" on public.inventory_logs for select using (true);

create policy "Admins can manage metaobjects" on public.metaobjects for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Public can view metaobjects" on public.metaobjects for select using (true);

create policy "Admins can manage store settings" on public.store_settings for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Public can view store settings" on public.store_settings for select using (true);

create policy "Admins can manage analytics events" on public.analytics_events for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Users can insert own analytics events" on public.analytics_events for insert with check (auth.uid() = user_id);

-- ============================================
-- SEED DATA
-- ============================================

insert into public.store_settings (store_name, store_email, store_phone, store_address, store_description, currency, country, low_stock_threshold) values
  ('Ojamart', 'support@ojamart.com', '+234 1 234 5678', '123 Adeola Odeku Street, Victoria Island, Lagos, Nigeria', 'Premium marketplace for quality products with fast delivery.', 'NGN', 'Nigeria', 10)
on conflict (id) do nothing;

insert into public.markets (name, code, currency, tax_rate, shipping_fee) values
  ('Nigeria', 'NG', 'NGN', 750, 2500),
  ('Ghana', 'GH', 'GHS', 0, 5000),
  ('Kenya', 'KE', 'KES', 0, 5000),
  ('South Africa', 'ZA', 'ZAR', 0, 8000)
on conflict (code) do nothing;
