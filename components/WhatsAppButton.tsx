"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const pathname = usePathname();
  
  // Hide on checkout page
  if (pathname === "/checkout") return null;

  const phoneNumber = "2340000000000"; // Placeholder Nigerian number
  const message = "Hello, I’m interested in your alternative energy products. Please assist me.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1, y: -5 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-[100] flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-[#25D366]/40 transition-shadow hover:shadow-[#25D366]/60 md:bottom-12 md:right-12"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-8 w-8 fill-current" />
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75"></span>
        <span className="relative inline-flex h-4 w-4 rounded-full bg-[#25D366]"></span>
      </span>
    </motion.a>
  );
};

export default WhatsAppButton;
