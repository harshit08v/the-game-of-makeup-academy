"use client";

import React from "react";
import { useAcademy } from "@/lib/store";
import {
  LayoutDashboard,
  BookOpen,
  Receipt,
  User,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

interface StudentSidebarProps {
  onItemClick?: () => void;
}

export function StudentSidebar({ onItemClick }: StudentSidebarProps) {
  const {
    activeStudentTab,
    setActiveStudentTab,
    students,
    selectedStudentId,
  } = useAcademy();

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const navItems = [
    {
      id: "overview",
      label: "My Overview",
      icon: LayoutDashboard,
    },
    {
      id: "course",
      label: "My Course",
      icon: BookOpen,
    },
    {
      id: "fees",
      label: "My Fees",
      icon: Receipt,
      badge: currentStudent?.feeStatus,
    },
    {
      id: "profile",
      label: "My Profile",
      icon: User,
    },
  ];

  return (
    <aside className="w-64 bg-[#FCFAF7] border-r border-[#EAE4DC] flex flex-col h-[calc(100vh-61px)] shrink-0 select-none">
      {/* Student Badge Card */}
      <div className="p-4 border-b border-[#F0EAE0]">
        <div className="bg-white rounded-xl p-3 border border-[#E7DFD4] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-champagne-600 text-white flex items-center justify-center font-serif font-bold text-sm shadow-sm">
              {currentStudent?.fullName.charAt(0) || "S"}
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-semibold text-charcoal-900 truncate">
                {currentStudent?.fullName}
              </h4>
              <p className="text-[10px] font-mono text-charcoal-500 truncate">
                {currentStudent?.id}
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#F5EFE6] space-y-1 text-[11px]">
            <div className="text-charcoal-600 font-medium truncate">
              {currentStudent?.courseName}
            </div>
            <div className="text-[10px] text-charcoal-500 truncate">
              {currentStudent?.batchName}
            </div>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider uppercase text-charcoal-400">
          Student Portal
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeStudentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveStudentTab(item.id);
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
                    item.badge === "Paid"
                      ? "bg-emerald-100 text-emerald-800"
                      : item.badge === "Partial"
                      ? "bg-amber-100 text-amber-900"
                      : "bg-rose-100 text-rose-900"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Student notice */}
      <div className="p-4 border-t border-[#F0EAE0] text-[11px] text-charcoal-500 bg-[#F9F5EE]">
        <div className="flex items-center gap-1.5 text-champagne-800 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Student View</span>
        </div>
        <p className="text-[10px] text-charcoal-400 mt-1 leading-relaxed">
          You are viewing personalized records for this enrolled student.
        </p>
      </div>
    </aside>
  );
}
