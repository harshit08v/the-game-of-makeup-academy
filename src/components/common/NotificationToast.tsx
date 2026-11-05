"use client";

import React from "react";
import { useAcademy } from "@/lib/store";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export function NotificationToast() {
  const { toast } = useAcademy();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 text-champagne-700 shrink-0 mt-0.5" />,
  };

  const bgStyles = {
    success: "bg-emerald-50/95 border-emerald-300 text-emerald-950",
    error: "bg-rose-50/95 border-rose-300 text-rose-950",
    info: "bg-[#FBF8F3]/95 border-[#E2D7C8] text-charcoal-900",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-slideUp">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border shadow-luxury-lg backdrop-blur-md transition-all ${bgStyles[toast.type]}`}
      >
        {icons[toast.type]}
        <div className="space-y-0.5">
          <h4 className="text-sm font-semibold tracking-tight">{toast.title}</h4>
          <p className="text-xs text-charcoal-600 leading-relaxed">{toast.message}</p>
        </div>
      </div>
    </div>
  );
}
