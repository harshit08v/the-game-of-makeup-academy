"use client";

import React, { useState } from "react";
import { useAcademy } from "@/lib/store";
import { Role } from "@/types";
import {
  Shield,
  UserCheck,
  X,
  Sparkles,
  Lock,
  ArrowRight,
  GraduationCap,
  Info,
} from "lucide-react";

interface DemoLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoLoginModal({ isOpen, onClose }: DemoLoginModalProps) {
  const { setRole, students, selectedStudentId, setSelectedStudentId, showToast } =
    useAcademy();

  const [selectedRole, setSelectedRole] = useState<Role>("admin");
  const [chosenStudentId, setChosenStudentId] = useState(selectedStudentId);

  if (!isOpen) return null;

  const handleLogin = (role: Role) => {
    if (role === "student") {
      setSelectedStudentId(chosenStudentId);
    }
    setRole(role);
    onClose();
    showToast(
      "Demo Access Granted",
      role === "admin"
        ? "Authenticated into Academy Administrator Suite."
        : `Authenticated into Student Portal for ${students.find((s) => s.id === chosenStudentId)?.fullName || "Student"}.`,
      "success"
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/65 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-luxury-lg border border-[#EAE4DC] overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0EAE1] bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-charcoal-950 flex items-center justify-center border border-[#DFD5C6] shadow-sm">
              <span className="font-serif text-champagne-400 font-bold text-xs tracking-wider">
                GM
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-sm font-semibold text-charcoal-900">
                  THE GAME OF MAKEUP
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                  Demo Access
                </span>
              </div>
              <p className="text-[10px] text-charcoal-500 uppercase tracking-wider font-medium">
                Academy Authentication Gateway
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-800 hover:bg-[#F2ECE2] transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6 bg-white">
          <div className="text-center max-w-md mx-auto space-y-1">
            <h2 className="font-serif text-2xl font-medium text-charcoal-900">
              Select Demo Access Role
            </h2>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Experience the platform as an institutional academy administrator or preview the personalized student portal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Option 1: Admin */}
            <div
              onClick={() => handleLogin("admin")}
              className="p-5 rounded-2xl border border-[#EAE4DC] bg-[#FCFAF7] hover:bg-white hover:border-champagne-400 hover:shadow-luxury transition cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-charcoal-900 text-champagne-400 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold text-charcoal-900">
                    Academy Administrator
                  </h3>
                  <p className="text-[11px] text-charcoal-500 mt-1 leading-relaxed">
                    Full executive suite: admissions processing, student registry, fees ledger, cohorts, and reports.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-xs font-semibold text-charcoal-800 group-hover:text-champagne-700 transition">
                <span>Enter Admin Suite</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Option 2: Student */}
            <div className="p-5 rounded-2xl border border-[#EAE4DC] bg-[#FCFAF7] hover:bg-white hover:border-champagne-400 hover:shadow-luxury transition flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-champagne-600 text-white flex items-center justify-center shadow-sm">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold text-charcoal-900">
                    Enrolled Student
                  </h3>
                  <p className="text-[11px] text-charcoal-500 mt-1 leading-relaxed">
                    Personalized candidate view: curriculum syllabus, class schedule, and printable fee receipts.
                  </p>
                </div>

                {/* Persona Selector inside student card */}
                <div className="pt-2">
                  <label className="block text-[10px] font-semibold text-charcoal-600 uppercase tracking-wider mb-1">
                    Student Persona:
                  </label>
                  <select
                    value={chosenStudentId}
                    onChange={(e) => setChosenStudentId(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#DACFBF] bg-white text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-champagne-600"
                  >
                    {students.slice(0, 6).map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({s.feeStatus})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => handleLogin("student")}
                className="w-full pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-xs font-semibold text-charcoal-800 hover:text-champagne-700 transition group"
              >
                <span>Enter Student Portal</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Simulation Fine Print */}
          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EBE4DC] text-[11px] text-charcoal-500 flex items-center gap-2">
            <Info className="w-4 h-4 text-champagne-700 shrink-0" />
            <span>
              This client-facing demo does not require credentials or external authentication servers.
            </span>
          </div>
        </div>

        {/* Modal Footer with Developer Credit */}
        <div className="px-6 py-3.5 bg-[#FAF8F5] border-t border-[#F0EAE1] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-charcoal-500">
          <span className="text-[10px] text-charcoal-400">
            THE GAME OF MAKEUP • ACADEMY SUITE v1.2
          </span>
          <div className="text-[11px] tracking-wide text-champagne-700/90 font-medium">
            Designed & Developed by Harshit Verma
          </div>
        </div>
      </div>
    </div>
  );
}
