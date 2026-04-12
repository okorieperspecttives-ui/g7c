"use client";

import { Trash2, Loader2 } from "lucide-react";
import { deleteBrand } from "../actions";
import { toast } from "sonner";
import { useState } from "react";

export default function DeleteBrandButton({ id, name }: { id: string; name: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${name}"? All products of this brand will be unassigned.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteBrand(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Brand deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete brand");
    } finally {
      setIsDeleting(false);
    }
  };

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
