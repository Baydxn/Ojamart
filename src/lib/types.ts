export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // minor currency unit (kobo)
  category_id: string;
  stock_quantity: number;
  images: string[];
  sizes: string[];
  colors: string[];
  is_active: boolean;
  is_featured: boolean;
  is_flash_deal: boolean;
  flash_deal_price: number | null;
  created_at: string;
  updated_at: string;
  category?: Category;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type CartItemInput = {
  productId: string;
  size: string;
  color: string;
  quantity: number;
};

export type CartItem = {
  id: string;
  productId: string;
  size: string;
  color: string;
  quantity: number;
  product?: Product;
};

export type Address = {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
};

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "unpaid" | "paid" | "refunded" | "partially_refunded";

export type Order = {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentIntentId: string | null;
  shippingAddress: any;
  createdAt: string;
  updatedAt: string;
  orderItems?: OrderItem[];
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
};

export type UserProfile = {
  id: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
  createdAt: string;
};

export type ShippingMethod = {
  id: string;
  name: string;
  description: string | null;
  fee: number; // minor currency unit
  minDays: number;
  maxDays: number;
};

// ============================================
// ADMIN TYPES
// ============================================

export type AdminUser = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
};

export type DraftOrder = {
  id: string;
  order_number: string;
  customer_id: string | null;
  customer_email: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  status: string;
  subtotal: number;
  shipping_fee: number;
  tax: number;
  total: number;
  payment_status: string;
  shipping_address: any;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  draft_order_items?: DraftOrderItem[];
};

export type DraftOrderItem = {
  id: string;
  draft_order_id: string;
  product_id: string | null;
  product_name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  created_at: string;
};

export type Discount = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  type: string;
  value: number;
  min_purchase: number;
  usage_limit: number | null;
  usage_count: number;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  applies_to: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image_url: string | null;
  author_id: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Market = {
  id: string;
  name: string;
  code: string;
  currency: string;
  is_active: boolean;
  tax_rate: number;
  shipping_fee: number;
  created_at: string;
  updated_at: string;
};

export type MarketCatalog = {
  id: string;
  market_id: string;
  product_id: string;
  price_override: number | null;
  is_available: boolean;
  created_at: string;
};

export type FileItem = {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  url: string | null;
  uploaded_by: string | null;
  created_at: string;
};

export type Menu = {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type MenuItem = {
  id: string;
  menu_id: string;
  parent_id: string | null;
  title: string;
  url: string | null;
  handle: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CustomerSegment = {
  id: string;
  name: string;
  description: string | null;
  filters: any;
  customer_count: number;
  created_at: string;
  updated_at: string;
};

export type Company = {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  tax_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CompanyMember = {
  id: string;
  company_id: string;
  user_id: string;
  role: string;
  created_at: string;
};

export type GiftCard = {
  id: string;
  code: string;
  balance: number;
  original_balance: number;
  is_active: boolean;
  expires_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type PurchaseOrder = {
  id: string;
  po_number: string;
  supplier_name: string;
  status: string;
  total: number;
  expected_date: string | null;
  received_date: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  purchase_order_items?: PurchaseOrderItem[];
};

export type PurchaseOrderItem = {
  id: string;
  purchase_order_id: string;
  product_id: string | null;
  product_name: string;
  sku: string | null;
  quantity_ordered: number;
  quantity_received: number;
  unit_cost: number;
  created_at: string;
};

export type Transfer = {
  id: string;
  transfer_number: string;
  from_location: string;
  to_location: string;
  status: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  transfer_items?: TransferItem[];
};

export type TransferItem = {
  id: string;
  transfer_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  created_at: string;
};

export type InventoryLog = {
  id: string;
  product_id: string;
  change_type: string;
  change_quantity: number;
  previous_quantity: number;
  new_quantity: number;
  reference_type: string | null;
  reference_id: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
};

export type Metaobject = {
  id: string;
  type: string;
  key: string;
  value: any;
  created_at: string;
  updated_at: string;
};

export type StoreSetting = {
  id: string;
  store_name: string;
  store_email: string | null;
  store_phone: string | null;
  store_address: string | null;
  store_description: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  currency: string;
  country: string;
  tax_enabled: boolean;
  tax_rate: number;
  low_stock_threshold: number;
  updated_at: string;
};

export type AnalyticsEvent = {
  id: string;
  event_name: string;
  event_data: any;
  user_id: string | null;
  created_at: string;
};
