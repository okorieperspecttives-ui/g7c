"use client";

import { Trash2 } from "lucide-react";
import { deleteProduct } from "./actions";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface DeleteProductButtonProps {
  id: string;
  name: string;
  isMobile?: boolean;
}

export default function DeleteProductButton({ id, name, isMobile = false }: DeleteProductButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteProduct(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Product deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isMobile) {
    return (
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive transition-colors active:bg-destructive/20 disabled:opacity-50"
      >
        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </button>
    );
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors disabled:opacity-50"
    >
      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </button>
  );
}
