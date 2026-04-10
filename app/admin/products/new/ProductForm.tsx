"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProduct, updateProduct } from "../actions";
import { Brand, Category, ProductDetail } from "@/lib/types";
import { Loader2, Upload, X, Check, Save, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { getPublicUrl } from "@/lib/supabase";

interface ProductFormProps {
  brands: Brand[];
  categories: Category[];
  initialData?: ProductDetail;
}

export default function ProductForm({ brands, categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.main_image || null);
  
  // Existing gallery images
  const [existingGallery, setExistingGallery] = useState<string[]>(
    Array.isArray(initialData?.gallery_images) ? initialData.gallery_images as string[] : []
  );
  const [galleryPreviewUrls, setGalleryPreviewUrls] = useState<string[]>([]);
  
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  
  // Dynamic lists
  const [features, setFeatures] = useState<string[]>(initialData?.features as string[] || []);
  const [newFeature, setNewFeature] = useState("");
  
  const [certifications, setCertifications] = useState<string[]>(initialData?.certifications as string[] || []);
  const [newCert, setNewCert] = useState("");

  const [specs, setSpecs] = useState<{ label: string; value: string }[]>(
    initialData?.specifications || []
  );

  const [slug, setSlug] = useState(initialData?.slug || "");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (!initialData) {
      setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setGalleryImages((prev) => [...prev, ...files]);
    const urls = files.map((file) => URL.createObjectURL(file));
    setGalleryPreviewUrls((prev) => [...prev, ...urls]);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures((prev) => [...prev, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const addCert = () => {
    if (newCert.trim()) {
      setCertifications((prev) => [...prev, newCert.trim()]);
      setNewCert("");
    }
  };

  const removeCert = (index: number) => {
    setCertifications((prev) => prev.filter((_, i) => i !== index));
  };

  const addSpec = () => {
    setSpecs((prev) => [...prev, { label: "", value: "" }]);
  };

  const updateSpec = (index: number, field: "label" | "value", val: string) => {
    setSpecs((prev) => {
      const newSpecs = [...prev];
      newSpecs[index][field] = val;
      return newSpecs;
    });
  };

  const removeSpec = (index: number) => {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("is_active", isActive.toString());
    formData.set("slug", slug);
    formData.set("features", JSON.stringify(features));
    formData.set("certifications", JSON.stringify(certifications));
    formData.set("specifications", JSON.stringify(specs));
    formData.set("existing_gallery", JSON.stringify(existingGallery));
    
    // Gallery images are handled by adding them to the FormData in the loop
    galleryImages.forEach((file) => {
      formData.append("gallery_images", file);
    });

    startTransition(async () => {
      const result = initialData 
        ? await updateProduct(initialData.id, formData)
        : await createProduct(formData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(initialData ? "Product updated successfully!" : "Product created successfully!");
        router.push("/admin/products");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                Product Name
              </label>
              <input
                required
                name="name"
                defaultValue={initialData?.name}
                onChange={handleNameChange}
                placeholder="e.g., Sparta H6.6K Energy System"
                className="h-12 w-full rounded-2xl border border-border bg-background px-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                Product Slug (URL)
              </label>
              <input
                required
                name="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g., sparta-h6-6k-system"
                className="h-12 w-full rounded-2xl border border-border bg-secondary/30 px-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                Brand
              </label>
              <select
                required
                name="brand_id"
                defaultValue={initialData?.brand_id || ""}
                className="h-12 w-full rounded-2xl border border-border bg-background px-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                Category
              </label>
              <select
                required
                name="category_id"
                defaultValue={initialData?.category_id || ""}
                className="h-12 w-full rounded-2xl border border-border bg-background px-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
              Short Description
            </label>
            <input
              name="short_description"
              defaultValue={initialData?.short_description || ""}
              placeholder="A brief summary for cards and search results..."
              className="h-12 w-full rounded-2xl border border-border bg-background px-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
              Description
            </label>
            <textarea
              required
              name="description"
              defaultValue={initialData?.description || ""}
              rows={6}
              placeholder="Tell us about the product's benefits and features..."
              className="w-full rounded-3xl border border-border bg-background p-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="space-y-2 col-span-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                Base Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">₦</span>
                <input
                  required
                  type="number"
                  name="base_price"
                  defaultValue={initialData?.base_price}
                  placeholder="0"
                  className="h-11 w-full rounded-xl border border-border bg-background pl-9 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2 col-span-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                Markup Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black text-sm">₦</span>
                <input
                  required
                  type="number"
                  name="markup_price"
                  defaultValue={initialData?.markup_price}
                  placeholder="0"
                  className="h-11 w-full rounded-xl border border-border bg-background pl-9 pr-4 text-sm font-black text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2 col-span-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                Stock
              </label>
              <input
                required
                type="number"
                name="stock_quantity"
                defaultValue={initialData?.stock_quantity}
                placeholder="0"
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            <div className="space-y-2 col-span-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                Warranty
              </label>
              <input
                type="number"
                name="warranty_months"
                defaultValue={initialData?.warranty_months || ""}
                placeholder="Months"
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Dynamic Lists Section */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Features */}
            <div className="space-y-4 rounded-3xl border border-border bg-secondary/10 p-6">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                Key Features
              </label>
              <div className="flex gap-2">
                <input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  placeholder="Add a feature..."
                  className="h-11 flex-1 rounded-xl border border-border bg-background px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="h-11 w-11 flex items-center justify-center rounded-xl bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-all"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {features.map((feature, i) => (
                  <span key={i} className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                    {feature}
                    <button type="button" onClick={() => removeFeature(i)} className="hover:text-destructive transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-4 rounded-3xl border border-border bg-secondary/10 p-6">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                Certifications
              </label>
              <div className="flex gap-2">
                <input
                  value={newCert}
                  onChange={(e) => setNewCert(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCert())}
                  placeholder="e.g., SON, CE, ISO..."
                  className="h-11 flex-1 rounded-xl border border-border bg-background px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={addCert}
                  className="h-11 w-11 flex items-center justify-center rounded-xl bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-all"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert, i) => (
                  <span key={i} className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-xs font-bold text-foreground">
                    {cert}
                    <button type="button" onClick={() => removeCert(i)} className="hover:text-destructive transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Specifications Section */}
          <div className="space-y-6 rounded-3xl border border-border bg-card p-8">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                Technical Specifications
              </label>
              <button
                type="button"
                onClick={addSpec}
                className="flex items-center gap-2 text-xs font-bold text-primary hover:underline"
              >
                <Plus className="h-4 w-4" />
                Add Row
              </button>
            </div>
            <div className="space-y-3">
              {specs.map((spec, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl bg-secondary/20 sm:bg-transparent sm:p-0">
                  <div className="flex-1 space-y-1 sm:space-y-0">
                    <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground sm:hidden">Label</label>
                    <input
                      value={spec.label}
                      onChange={(e) => updateSpec(i, "label", e.target.value)}
                      placeholder="e.g., Capacity"
                      className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="flex-1 space-y-1 sm:space-y-0">
                    <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground sm:hidden">Value</label>
                    <input
                      value={spec.value}
                      onChange={(e) => updateSpec(i, "value", e.target.value)}
                      placeholder="e.g., 5kWh"
                      className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSpec(i)}
                    className="flex h-11 w-full sm:w-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all sm:bg-transparent sm:text-muted-foreground sm:hover:bg-destructive/10 sm:hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="ml-2 text-xs font-bold sm:hidden">Remove Specification</span>
                  </button>
                </div>
              ))}
              {specs.length === 0 && (
                <p className="text-center py-4 text-sm text-muted-foreground italic">No specifications added yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Media */}
        <div className="space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
              Main Featured Image
            </label>
            <div 
              className="relative aspect-square sm:aspect-video lg:aspect-square overflow-hidden rounded-3xl border-2 border-dashed border-border bg-secondary/20 transition-all hover:bg-secondary/30 group cursor-pointer"
              onClick={() => document.getElementById("featured_image")?.click()}
            >
              {previewUrl ? (
                <div className="relative h-full w-full">
                  <Image
                    src={previewUrl.startsWith("blob:") ? previewUrl : `/assets/placeholder.jpg`}
                    alt="Preview"
                    fill
                    className="object-contain p-4 sm:p-8"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity lg:group-hover:opacity-100 flex items-center justify-center">
                    <p className="text-white text-xs font-bold">Change Image</p>
                  </div>
                  {/* Mobile Change Button */}
                  <div className="absolute bottom-4 right-4 lg:hidden">
                    <div className="rounded-full bg-primary p-2 text-white shadow-lg">
                      <Upload className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
                  <Upload className="h-10 w-10 stroke-[1.5]" />
                  <p className="text-xs font-bold uppercase tracking-widest text-center px-4">Upload Main Image</p>
                </div>
              )}
              <input
                id="featured_image"
                name="featured_image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
              Gallery Images
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4">
              {/* Existing Images */}
              {existingGallery.map((path, i) => (
                <div key={`existing-${i}`} className="relative aspect-square rounded-2xl border border-border bg-muted overflow-hidden group">
                  <Image 
                    src={path.startsWith('http') || path.startsWith('/') ? path : getPublicUrl('product-images', path)} 
                    alt={`Gallery ${i}`} 
                    fill 
                    className="object-cover" 
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(i)}
                    className="absolute right-2 top-2 h-7 w-7 rounded-lg bg-destructive text-white flex items-center justify-center lg:opacity-0 transition-opacity lg:group-hover:opacity-100 shadow-md"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              {/* New Previews */}
              {galleryPreviewUrls.map((url, i) => (
                <div key={`new-${i}`} className="relative aspect-square rounded-2xl border border-primary/30 bg-primary/5 overflow-hidden group">
                  <Image src={url} alt={`New Gallery ${i}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(i)}
                    className="absolute right-2 top-2 h-7 w-7 rounded-lg bg-destructive text-white flex items-center justify-center lg:opacity-0 transition-opacity lg:group-hover:opacity-100 shadow-md"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 rounded-md bg-primary px-1.5 py-0.5 text-[8px] font-black text-white uppercase">New</div>
                </div>
              ))}
              
              <div 
                className="relative aspect-square flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-secondary/10 hover:bg-secondary/20 transition-all cursor-pointer group"
                onClick={() => document.getElementById("gallery_images")?.click()}
              >
                <Plus className="h-6 w-6 text-muted-foreground transition-transform group-hover:scale-110" />
                <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Add More</p>
                <input
                  id="gallery_images"
                  name="gallery_images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleGalleryChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-secondary/10 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-foreground">Active Status</p>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Visible to customers</p>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${isActive ? 'bg-primary' : 'bg-muted'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-foreground">Best Seller</p>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Featured section</p>
              </div>
              <button
                type="button"
                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-not-allowed rounded-full border-2 border-transparent bg-muted outline-none opacity-50"
              >
                <span className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-0" />
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-border/50 flex flex-col gap-4">
            <button
              type="submit"
              disabled={isPending}
              className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-primary px-8 text-sm font-black uppercase tracking-widest text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-primary/20"
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  {initialData ? "Update Product" : "Publish Product"}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-14 items-center justify-center rounded-2xl border border-border bg-background px-8 text-sm font-bold text-foreground transition-all hover:bg-secondary active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
