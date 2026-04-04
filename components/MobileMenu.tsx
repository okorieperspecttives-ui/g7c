"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, ChevronRight, Info, Phone, MessageSquare } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
}

const MobileMenu = ({ isOpen, onClose, links }: MobileMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[70] w-[min(90%,400px)] bg-[color:var(--background)] p-6 shadow-2xl lg:hidden"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-bold text-[color:var(--foreground)]">Menu</span>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-[color:var(--muted-foreground)] hover:bg-[color:var(--secondary)] transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto">
                <div className="flex flex-col gap-2">
                  {links.map((link, i) => (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className="flex items-center justify-between rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5 transition-all hover:border-[color:var(--primary)] group"
                      >
                        <span className="text-lg font-bold text-[color:var(--foreground)]">{link.label}</span>
                        <ChevronRight className="h-5 w-5 text-[color:var(--muted-foreground)] transition-transform group-hover:translate-x-1 group-hover:text-[color:var(--primary)]" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-[color:var(--border)]">
                  <h4 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
                    Support & Help
                  </h4>
                  <div className="flex flex-col gap-4">
                    <Link href="/support" onClick={onClose} className="flex items-center gap-4 text-[color:var(--foreground)] hover:text-[color:var(--primary)] transition-colors">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--primary)]/10 text-[color:var(--primary)]">
                        <Info className="h-5 w-5" />
                      </div>
                      <span className="font-bold">Help Center</span>
                    </Link>
                    <Link href="/contact" onClick={onClose} className="flex items-center gap-4 text-[color:var(--foreground)] hover:text-[color:var(--primary)] transition-colors">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--primary)]/10 text-[color:var(--primary)]">
                        <Phone className="h-5 w-5" />
                      </div>
                      <span className="font-bold">Contact Sales</span>
                    </Link>
                  </div>
                </div>
              </nav>

              <div className="mt-auto pt-8">
                <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] py-4 text-white font-bold transition-transform hover:scale-[1.02] active:scale-95">
                  <MessageSquare className="h-5 w-5" />
                  WhatsApp Expert
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
