"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, Trash2, ExternalLink, Clock, Package, CreditCard, RotateCcw, ShieldCheck, X, Trash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getMyNotifications, markAsRead, markAllAsRead, NotificationType, deleteNotification } from "@/lib/actions/notifications";
import { formatDistanceToNow } from "date-fns";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";

const iconButtonClassName =
  "relative inline-flex h-10 w-10 items-center cursor-pointer justify-center rounded-full border border-transparent text-[color:var(--foreground)] transition-colors duration-200 hover:border-[color:var(--border)] hover:text-[color:var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]";

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "order":
      return <Package className="h-4 w-4" />;
    case "reservation":
      return <Clock className="h-4 w-4" />;
    case "payment":
      return <CreditCard className="h-4 w-4" />;
    case "refund":
      return <RotateCcw className="h-4 w-4" />;
    case "system":
      return <ShieldCheck className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case "order":
      return "bg-blue-500/10 text-blue-500";
    case "reservation":
      return "bg-amber-500/10 text-amber-500";
    case "payment":
      return "bg-emerald-500/10 text-emerald-500";
    case "refund":
      return "bg-purple-500/10 text-purple-500";
    case "system":
      return "bg-primary/10 text-primary";
    default:
      return "bg-secondary text-muted-foreground";
  }
};

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      console.log("[DEBUG] NotificationBell: Fetching notifications...");
      const { notifications, unreadCount } = await getMyNotifications();
      console.log(`[DEBUG] NotificationBell: Fetched ${notifications?.length || 0} notifications, unread: ${unreadCount}`);
      setNotifications(notifications || []);
      setUnreadCount(unreadCount || 0);
    } catch (error) {
      console.error("[DEBUG] NotificationBell: Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Set up real-time subscription
    const supabase = createClient();
    console.log("[DEBUG] NotificationBell: Setting up real-time subscription...");
    
    const channel = supabase
      .channel("notifications_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          console.log("[DEBUG] NotificationBell: Real-time change detected:", payload.eventType);
          fetchNotifications();
        }
      )
      .subscribe((status) => {
        console.log("[DEBUG] NotificationBell: Subscription status:", status);
      });

    return () => {
      console.log("[DEBUG] NotificationBell: Cleaning up subscription");
      supabase.removeChannel(channel);
    };
  }, []);

  // Re-fetch when dropdown opens to ensure latest data
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    fetchNotifications();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    fetchNotifications();
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const result = await deleteNotification(id);
    if (result.success) {
      toast.success("Notification deleted");
      if (selectedNotification?.id === id) {
        setSelectedNotification(null);
      }
      fetchNotifications();
    }
  };

  const handleNotificationClick = async (notification: any) => {
    setSelectedNotification(notification);
    if (!notification.is_read) {
      await markAsRead(notification.id);
      fetchNotifications();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={iconButtonClassName}
      >
        <Bell className="h-5 w-5" strokeWidth={2} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white animate-in zoom-in duration-300 shadow-sm ring-1 ring-background">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-4 top-24 z-[100] mx-auto sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:pt-2 sm:origin-top-right sm:w-[380px]"
          >
            <div className="w-full overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-muted/30">
                <div>
                  <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <p className="text-[10px] font-bold text-primary mt-0.5">
                      {unreadCount} new messages
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllAsRead}
                      className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <Check className="h-3 w-3" />
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                    title="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-border/50">
                    {notifications.map((n) => (
                      <div 
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`group relative flex gap-4 p-5 transition-colors cursor-pointer hover:bg-secondary/50 ${!n.is_read ? "bg-primary/[0.02]" : ""}`}
                      >
                        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${getNotificationColor(n.type)}`}>
                          {getNotificationIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className={`text-sm font-bold truncate pr-4 ${!n.is_read ? "text-foreground" : "text-muted-foreground"}`}>
                              {n.title}
                            </h4>
                            <span className="text-[9px] font-medium text-muted-foreground whitespace-nowrap mt-0.5">
                              {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                            {n.message}
                          </p>
                        </div>
                        
                        <button
                          onClick={(e) => handleDelete(e, n.id)}
                          className="absolute right-2 bottom-2 p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>

                        {!n.is_read && (
                          <div className="absolute top-5 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary mx-auto mb-4">
                      <Bell className="h-6 w-6 text-muted-foreground opacity-20" />
                    </div>
                    <p className="text-sm font-bold text-muted-foreground">No notifications yet</p>
                  </div>
                )}
              </div>
              
              <div className="p-3 border-t border-border/50 bg-muted/30 flex flex-col gap-2">
                {notifications.length > 0 && (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
                  >
                    View All in Dashboard
                  </Link>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="sm:hidden flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 hover:bg-primary hover:text-white transition-all"
                >
                  Close Drawer
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification View Modal */}
      <AnimatePresence>
        {selectedNotification && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNotification(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${getNotificationColor(selectedNotification.type)}`}>
                    {getNotificationIcon(selectedNotification.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-foreground">{selectedNotification.title}</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {selectedNotification.type} Notification
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-8">
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {selectedNotification.message}
                </p>
                
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">
                    Received {formatDistanceToNow(new Date(selectedNotification.created_at), { addSuffix: true })}
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        handleDelete(e, selectedNotification.id);
                        setSelectedNotification(null);
                      }}
                      className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                    {selectedNotification.link && (
                      <Link
                        href={selectedNotification.link}
                        onClick={() => setSelectedNotification(null)}
                        className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2 text-xs font-black uppercase tracking-widest text-primary-foreground hover:scale-105 transition-all"
                      >
                        Action
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
