"use client";

import React, { useState } from "react";
import { useAcademy } from "@/lib/store";
import {
  Sparkles,
  Shield,
  UserCheck,
  RotateCcw,
  Menu,
  GraduationCap,
  ExternalLink,
  ChevronDown,
  Plus,
  LogIn,
} from "lucide-react";

interface NavbarProps {
  onMobileMenuToggle: () => void;
  onOpenQuickAdmission?: () => void;
  onOpenDemoLogin?: () => void;
}

export function Navbar({ onMobileMenuToggle, onOpenQuickAdmission, onOpenDemoLogin }: NavbarProps) {
  const {
    role,
    setRole,
    students,
    selectedStudentId,
    setSelectedStudentId,
    resetToDefaults,
    setActiveAdminTab,
  } = useAcademy();

  const [showStudentMenu, setShowStudentMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EAE4DC] px-4 lg:px-8 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="p-2 -ml-2 rounded-lg text-charcoal-600 hover:text-charcoal-900 hover:bg-[#FAF6F0] md:hidden transition"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-charcoal-950 flex items-center justify-center border border-[#DFD5C6] shadow-sm">
              <span className="font-serif text-champagne-400 font-bold text-sm tracking-wider">
                GM
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif tracking-tight text-base lg:text-lg font-medium text-charcoal-900">
                  THE GAME OF MAKEUP
                </span>
                <span className="hidden sm:inline-block text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#FAF5EE] text-champagne-800 border border-[#E9DDCF]">
                  Academy Suite
                </span>
              </div>
              <p className="text-[10px] text-charcoal-500 tracking-wider uppercase font-medium hidden sm:block">
                Professional Beauty & Artistry Education
              </p>
            </div>
          </div>
        </div>

        {/* Center: Prominent Demo Disclaimer Banner */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-amber-50/90 border border-amber-200/80 rounded-full text-amber-900 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span>DEMO ENVIRONMENT — SAMPLE DATA ONLY</span>
        </div>

        {/* Right: Role Switcher & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Role Toggle Bar */}
          <div className="flex items-center bg-[#F7F3EC] p-1 rounded-xl border border-[#E8DEC0]">
            <button
              onClick={() => setRole("admin")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                role === "admin"
                  ? "bg-charcoal-900 text-ivory-50 shadow-sm"
                  : "text-charcoal-600 hover:text-charcoal-900 hover:bg-white/60"
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-champagne-400" />
              <span>Admin</span>
            </button>

            <button
              onClick={() => setRole("student")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                role === "student"
                  ? "bg-charcoal-900 text-ivory-50 shadow-sm"
                  : "text-charcoal-600 hover:text-charcoal-900 hover:bg-white/60"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-champagne-400" />
              <span>Student</span>
            </button>
          </div>

          {/* Demo Login / Portal Switcher Gateway Trigger */}
          {onOpenDemoLogin && (
            <button
              onClick={onOpenDemoLogin}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#DACFBF] bg-[#FAF8F5] hover:bg-[#F2ECE0] text-xs font-medium text-charcoal-700 hover:text-charcoal-900 transition shadow-sm"
              title="Open Demo Login Screen"
            >
              <LogIn className="w-3.5 h-3.5 text-champagne-600" />
              <span className="hidden sm:inline">Demo Gateway</span>
            </button>
          )}

          {/* Student Persona Dropdown (shown when role is Student) */}
          {role === "student" && (
            <div className="relative">
              <button
                onClick={() => setShowStudentMenu(!showStudentMenu)}
                className="flex items-center gap-2 px-2.5 py-1.5 bg-[#FAF6F0] hover:bg-[#F2ECE0] border border-[#E4D8C7] rounded-lg text-xs text-charcoal-800 font-medium transition shadow-sm"
                title="Switch demo student view"
              >
                <div className="w-5 h-5 rounded-full bg-champagne-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentStudent.fullName.charAt(0)}
                </div>
                <span className="hidden md:inline max-w-[110px] truncate">
                  {currentStudent.fullName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-charcoal-500" />
              </button>

              {showStudentMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-luxury-lg border border-[#E7DFD2] py-2 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 border-b border-[#F0EBE3] text-[10px] uppercase font-semibold text-charcoal-400">
                    Switch Demo Student Persona
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-[#F6F2EB]">
                    {students.slice(0, 8).map((stu) => (
                      <button
                        key={stu.id}
                        onClick={() => {
                          setSelectedStudentId(stu.id);
                          setShowStudentMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#FAF6F0] transition ${
                          stu.id === selectedStudentId ? "bg-champagne-50 font-semibold" : ""
                        }`}
                      >
                        <div>
                          <div className="text-charcoal-900">{stu.fullName}</div>
                          <div className="text-[10px] text-charcoal-500">{stu.courseName}</div>
                        </div>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                            stu.feeStatus === "Paid"
                              ? "bg-emerald-50 text-emerald-800"
                              : stu.feeStatus === "Partial"
                              ? "bg-amber-50 text-amber-800"
                              : "bg-rose-50 text-rose-800"
                          }`}
                        >
                          {stu.feeStatus}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Action Button for Admin: New Admission */}
          {role === "admin" && (
            <button
              onClick={() => {
                if (onOpenQuickAdmission) {
                  onOpenQuickAdmission();
                } else {
                  setActiveAdminTab("admissions");
                }
              }}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-champagne-600 hover:bg-champagne-700 text-white transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Admission</span>
            </button>
          )}

          {/* Reset Demo Data Pill Button */}
          <div className="relative">
            <button
              onClick={() => setShowResetConfirm(!showResetConfirm)}
              className="p-1.5 rounded-lg text-charcoal-500 hover:text-charcoal-900 hover:bg-[#FAF6F0] border border-transparent hover:border-[#E8DEC0] transition"
              title="Reset sample demo data"
              aria-label="Reset demo data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {showResetConfirm && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-luxury-lg border border-[#E7DFD2] p-4 z-50 text-xs animate-fadeIn">
                <p className="font-semibold text-charcoal-900">Reset Demo Data?</p>
                <p className="text-charcoal-600 mt-1 leading-relaxed">
                  This will restore all default mock students, courses, batches and admissions.
                </p>
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-2.5 py-1 text-charcoal-600 hover:bg-[#F2ECE0] rounded-md transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      resetToDefaults();
                      setShowResetConfirm(false);
                    }}
                    className="px-3 py-1 bg-charcoal-900 text-ivory-50 rounded-md font-medium hover:bg-charcoal-800 transition"
                  >
                    Reset Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
