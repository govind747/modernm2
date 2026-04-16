export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  mrp: number
  discount: number
  final_mrp: number
  you_save: number
  exclusive_reward: string | null
  stock_quantity: number
  image_url: string | null
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  position: number
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  product?: Product
}

export interface Order {
  id: string
  user_id: string
  wallet_address: string | null
  total_usd: number
  total_mbone: number
  status: 'pending' | 'paid' | 'failed' | 'shipped' | 'cancelled'
  payment_tx_hash: string | null
  order_hash: string | null
  invoice_id: string | null
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price_usd: number
  price_mbone: number
  product?: Product
}

export interface CryptoPayment {
  id: string
  order_id: string
  chain: string
  token_symbol: string
  amount: number
  tx_hash: string | null
  from_wallet: string | null
  to_contract: string | null
  status: string
  created_at: string
}

export interface Setting {
  id: string
  key: string
  value: string
  updated_at: string
}

export interface Shipment {
  id: string
  orderId: string
  status: string
  tracking_number: string | null
  courier_name: string | null
  estimated_delivery?: string | null  // Add this
  shipped_at: string | null
  delivered_at: string | null
  created_at: string
  updated_at: string
}

export interface HeroImage {
  id: string;
  image_url: string;
  main_heading: string;
  subheading: string | null;
  redirect_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductSpecification {
  id: string;
  product_id: string;
  specification_name: string;
  specification_value: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductBanner {
  id: string;
  product_id: string;
  image_url: string;
  title: string | null;
  subtitle: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  type: string; // 'shipping', 'billing', 'both'
  label: string | null; // 'Home', 'Office', etc.
  address_line1: string;
  address_line2: string | null;
  landmark: string | null;
  area: string | null;
  city: string;
  state: string | null;
  country: string | null;
  zip_code: string;
  is_default: boolean | null;
  created_at: string;
  updated_at: string;
}