import { Database } from './database.types';

// Core exported types from Database
export type Brand = Database['public']['Tables']['brands']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Product = Database['public']['Tables']['products']['Row'] & {
  // Temporary properties for mock data/UI during transition
  isBestSeller?: boolean;
  capacity?: string;
  brand_name?: string;
  category_name?: string;
  specifications?: ProductSpecMinimal[];
};
export type ProductSpec = Database['public']['Tables']['product_specs']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];

// Enhanced types for frontend use
export type ProductWithBrandAndCategory = Product & {
  brand: Brand | null;
  category: Category | null;
};

// For product detail pages
export type ProductDetail = ProductWithBrandAndCategory & {
  product_specs: ProductSpec[];
};

// Simplified specification for generic UI components
export type ProductSpecMinimal = {
  label: string;
  value: string;
};

// User related
export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

// Enhanced type for use in components (with auth user data)
export type UserProfile = User & {
  email?: string; // from auth.users
  user_metadata?: any;
};

// Cart related
export type CartItem = Product & {
  quantity: number;
};

// Helper for checkout
export type OrderWithItems = Order & {
  items: (OrderItem & {
    product: Product | null;
  })[];
};
