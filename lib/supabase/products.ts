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
 * Fetch all products with brand and category information.
 * @param onlyActive If true, only returns active products (default: true)
 */
export async function getProducts(onlyActive = true) {
  const supabase = createClient();
  
  let query = supabase
    .from('products')
    .select(`
      *,
      brand:brands(*),
      category:categories(*),
      product_specs(*)
    `);

  if (onlyActive) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }

  return (data || []).map(transformProduct);
}

/**
 * Fetch all active brands.
 */
export async function getBrands() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error('Error fetching brands:', error);
    throw new Error('Failed to fetch brands');
  }

  return data;
}

/**
 * Fetch all active categories.
 */
export async function getCategories() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }

  return data;
}


/**
 * Fetch a single product by its ID with full details.
 */
export async function getProductById(id: string, onlyActive = false) {
  const supabase = createClient();

  let query = supabase
    .from('products')
    .select(`
      *,
      brand:brands(*),
      category:categories(*),
      product_specs(*)
    `)
    .eq('id', id);

  if (onlyActive) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query.single();

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
export async function getProductBySlug(slug: string, onlyActive = false) {
  const supabase = createClient();

  let query = supabase
    .from('products')
    .select(`
      *,
      brand:brands(*),
      category:categories(*),
      product_specs(*)
    `)
    .eq('slug', slug);

  if (onlyActive) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query.single();

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
    .eq('category_id', (catData as any).id)
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching products by category:', error);
    throw new Error('Failed to fetch products by category');
  }

  return (data || []).map(transformProduct);
}
