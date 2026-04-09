import { createClient } from '../supabase';
import { ProductDetail } from '../types';

/**
 * Transform product data to include specifications and names.
 */
function transformProduct(data: any): ProductDetail {
  if (!data) return data;
  
  return {
    ...data,
    brand_name: data.brand?.name || null,
    category_name: data.category?.name || null,
    specifications: data.product_specs?.map((s: any) => ({
      label: s.label,
      value: s.value
    })) || []
  };
}

/**
 * Fetch all active products with brand and category information.
 */
export async function getProducts() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      brand:brands(*),
      category:categories(*),
      product_specs(*)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }

  return (data || []).map(transformProduct);
}

/**
 * Fetch a single product by its ID with full details.
 */
export async function getProductById(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      brand:brands(*),
      category:categories(*),
      product_specs(*)
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error('Error fetching product by ID:', error);
    throw new Error('Failed to fetch product details');
  }

  return transformProduct(data);
}

/**
 * Fetch a single product by its slug with full details.
 */
export async function getProductBySlug(slug: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      brand:brands(*),
      category:categories(*),
      product_specs(*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error('Error fetching product by slug:', error);
    throw new Error('Failed to fetch product details');
  }

  return transformProduct(data);
}

/**
 * Fetch featured products (e.g., best sellers).
 * Currently just fetching top 8 active products.
 */
export async function getFeaturedProducts(limit = 8) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      brand:brands(*),
      category:categories(*),
      product_specs(*)
    `)
    .eq('is_active', true)
    .limit(limit)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching featured products:', error);
    throw new Error('Failed to fetch featured products');
  }

  return (data || []).map(transformProduct);
}

/**
 * Fetch products by category name.
 */
export async function getProductsByCategory(categoryName: string) {
  const supabase = createClient();

  // First get category ID
  const { data: catData } = await supabase
    .from('categories')
    .select('id')
    .eq('name', categoryName)
    .single();

  if (!catData) return [];

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      brand:brands(*),
      category:categories(*),
      product_specs(*)
    `)
    .eq('category_id', catData.id)
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching products by category:', error);
    throw new Error('Failed to fetch products by category');
  }

  return (data || []).map(transformProduct);
}
