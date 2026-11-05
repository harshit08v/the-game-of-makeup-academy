"use client";

import React from "react";
import { useAcademy } from "@/lib/store";
import {
  LayoutDashboard,
  FileText,
  Users,
  CreditCard,
  CalendarDays,
  BookOpen,
  BarChart3,
  Settings,
  GraduationCap,
  Sparkles,
} from "lucide-react";

interface AdminSidebarProps {
  onItemClick?: () => void;
}

export function AdminSidebar({ onItemClick }: AdminSidebarProps) {
  const {
    activeAdminTab,
    setActiveAdminTab,
    admissions,
    students,
    batches,
  } = useAcademy();

  const pendingAdmissionsCount = admissions.filter(
    (a) => a.status === "New" || a.status === "Approved"
  ).length;

  const navItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "admissions",
      label: "Admissions",
      icon: FileText,
      badge: pendingAdmissionsCount > 0 ? `${pendingAdmissionsCount} Pending` : null,
      badgeColor: "bg-amber-100 text-amber-900 border border-amber-300",
    },
    {
      id: "students",
      label: "Students",
      icon: Users,
      badge: `${students.length}`,
      badgeColor: "bg-[#F3EDE2] text-charcoal-700",
    },
    {
      id: "fees",
      label: "Fees & Payments",
      icon: CreditCard,
      badge: null,
    },
    {
      id: "batches",
      label: "Batches",
      icon: CalendarDays,
      badge: `${batches.length}`,
      badgeColor: "bg-[#F3EDE2] text-charcoal-700",
    },
    {
      id: "courses",
      label: "Courses",
      icon: BookOpen,
      badge: null,
    },
    {
      id: "reports",
      label: "Reports",
      icon: BarChart3,
      badge: null,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-[#FCFAF7] border-r border-[#EAE4DC] flex flex-col h-[calc(100vh-61px)] shrink-0 select-none">
      {/* Academy Subheader Info */}
      <div className="p-4 border-b border-[#F0EAE0]">
        <div className="bg-white rounded-xl p-3 border border-[#E7DFD4] shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-800">
            <GraduationCap className="w-4 h-4 text-champagne-600" />
            <span>Academic Portal</span>
          </div>
          <p className="text-[11px] text-charcoal-500 mt-1">
            Bandra West Studio Campus
          </p>
          <div className="mt-2 pt-2 border-t border-[#F5EFE6] flex items-center justify-between text-[10px] text-charcoal-500">
            <span>Session 2025</span>
            <span className="inline-flex items-center gap-1 text-emerald-800 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Live Operations
            </span>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider uppercase text-charcoal-400">
          Main Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeAdminTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveAdminTab(item.id);
                if (onItemClick) onItemClick();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? "bg-charcoal-900 text-ivory-50 shadow-sm"
                  : "text-charcoal-700 hover:text-charcoal-950 hover:bg-[#F2ECE1]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-champagne-400" : "text-charcoal-400 group-hover:text-charcoal-700"
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    isActive ? "bg-charcoal-800 text-champagne-300" : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Info */}
      <div className="p-4 border-t border-[#F0EAE0] text-[11px] text-charcoal-500 bg-[#F9F5EE]">
        <div className="flex items-center justify-between">
          <span>THE GAME OF MAKEUP</span>
          <span className="text-[10px] font-mono text-charcoal-400">v1.2</span>
        </div>
        <div className="text-[10px] text-charcoal-400 mt-0.5">
          Designed for Luxury Beauty Academies
        </div>
        <div className="mt-2.5 pt-2 border-t border-[#EAE1D3] text-[10px] tracking-wide text-champagne-700/90 font-medium">
          Designed &amp; Developed by Harshit Verma
        </div>
      </div>
    </aside>
  );
}
