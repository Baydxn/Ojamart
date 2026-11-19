"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: "sm" | "md";
}

export function WishlistButton({ productId, className, size = "md" }: WishlistButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const { toggle, has } = useWishlist();
  const isWishlisted = has(productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    await toggle(productId);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const sizeClasses = size === "sm"
    ? "w-8 h-8 p-1.5"
    : "w-10 h-10 p-2";

  return (
    <button
      onClick={handleClick}
      className={cn(
        "relative rounded-full bg-white/90 backdrop-blur-md border border-oj-border text-oj-black-soft transition-all hover:bg-oj-red hover:text-white active:scale-95 focus:outline-none focus:ring-2 focus:ring-oj-red",
        isAnimating ? "scale-110" : "",
        isWishlisted ? "bg-oj-red text-white border-oj-red" : "",
        className,
      )}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(
          "w-5 h-5 transition-all duration-200",
          isAnimating ? "animate-ping" : "",
          isWishlisted ? "fill-red-600 scale-110" : "",
        )}
      />
      {isWishlisted && (
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-oj-red border-2 border-white"></span>
      )}
    </button>
  );
}
