"use client";

import React, { useState } from "react";
import { useAcademy } from "@/lib/store";
import { Navbar } from "@/components/layout/Navbar";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { StudentSidebar } from "@/components/layout/StudentSidebar";
import { DemoLoginModal } from "@/components/common/DemoLoginModal";

// Admin Views
import { OverviewDashboard } from "@/components/admin/OverviewDashboard";
import { AdmissionsView } from "@/components/admin/AdmissionsView";
import { StudentsView } from "@/components/admin/StudentsView";
import { FeesView } from "@/components/admin/FeesView";
import { BatchesView } from "@/components/admin/BatchesView";
import { CoursesView } from "@/components/admin/CoursesView";
import { ReportsView } from "@/components/admin/ReportsView";
import { SettingsView } from "@/components/admin/SettingsView";

// Student Views
import { StudentOverview } from "@/components/student/StudentOverview";
import { StudentCourseView } from "@/components/student/StudentCourseView";
import { StudentFeesView } from "@/components/student/StudentFeesView";
import { StudentProfileView } from "@/components/student/StudentProfileView";

import { X } from "lucide-react";

export default function HomePage() {
  const {
    role,
    activeAdminTab,
    setActiveAdminTab,
    activeStudentTab,
    isHydrated,
  } = useAcademy();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDemoLoginOpen, setIsDemoLoginOpen] = useState(false);

  // Quick navigation handlers for Overview shortcuts
  const handleOpenNewAdmission = () => {
    setActiveAdminTab("admissions");
  };

  const handleOpenRecordPayment = () => {
    setActiveAdminTab("fees");
  };

  const handleOpenNewBatch = () => {
    setActiveAdminTab("batches");
  };

  const handleOpenNewCourse = () => {
    setActiveAdminTab("courses");
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 rounded-xl bg-charcoal-950 flex items-center justify-center border border-[#DFD5C6] shadow-md animate-pulse">
          <span className="font-serif text-champagne-400 font-bold text-sm tracking-widest">
            GM
          </span>
        </div>
        <div className="text-center">
          <p className="font-serif text-charcoal-800 text-sm tracking-wide font-medium">
            THE GAME OF MAKEUP
          </p>
          <p className="text-[10px] text-charcoal-400 uppercase tracking-widest mt-0.5">
            Academy Management Suite
          </p>
        </div>
        <div className="pt-2 text-[10px] tracking-wide text-champagne-700/80 font-medium">
          Designed &amp; Developed by Harshit Verma
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* Top Navigation */}
      <Navbar
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onOpenQuickAdmission={handleOpenNewAdmission}
        onOpenDemoLogin={() => setIsDemoLoginOpen(true)}
      />

      {/* Main Body Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          {role === "admin" ? <AdminSidebar /> : <StudentSidebar />}
        </div>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#FCFAF7] border-r border-[#EAE4DC] z-10 shadow-luxury-lg">
              <div className="p-4 border-b border-[#F0EAE1] flex items-center justify-between">
                <span className="font-serif font-semibold text-charcoal-900 text-sm">
                  {role === "admin" ? "Academy Admin Console" : "Student Portal"}
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {role === "admin" ? (
                  <AdminSidebar onItemClick={() => setIsMobileMenuOpen(false)} />
                ) : (
                  <StudentSidebar onItemClick={() => setIsMobileMenuOpen(false)} />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {role === "admin" ? (
              <>
                {activeAdminTab === "overview" && (
                  <OverviewDashboard
                    onOpenNewAdmission={handleOpenNewAdmission}
                    onOpenRecordPayment={handleOpenRecordPayment}
                    onOpenNewBatch={handleOpenNewBatch}
                    onOpenNewCourse={handleOpenNewCourse}
                  />
                )}
                {activeAdminTab === "admissions" && <AdmissionsView />}
                {activeAdminTab === "students" && <StudentsView />}
                {activeAdminTab === "fees" && <FeesView />}
                {activeAdminTab === "batches" && <BatchesView />}
                {activeAdminTab === "courses" && <CoursesView />}
                {activeAdminTab === "reports" && <ReportsView />}
                {activeAdminTab === "settings" && <SettingsView />}
              </>
            ) : (
              <>
                {activeStudentTab === "overview" && <StudentOverview />}
                {activeStudentTab === "course" && <StudentCourseView />}
                {activeStudentTab === "fees" && <StudentFeesView />}
                {activeStudentTab === "profile" && <StudentProfileView />}

                {/* Student Portal Footer with subtle developer attribution */}
                <footer className="mt-12 pt-6 border-t border-[#EAE4DC] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-charcoal-500">
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="font-serif font-medium text-charcoal-800">
                      THE GAME OF MAKEUP
                    </span>
                    <span>•</span>
                    <span>Student Experience Portal</span>
                  </div>
                  <div className="text-[11px] tracking-wide text-champagne-700/90 font-medium">
                    Designed &amp; Developed by Harshit Verma
                  </div>
                </footer>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Demo Login & Role Access Modal */}
      <DemoLoginModal
        isOpen={isDemoLoginOpen}
        onClose={() => setIsDemoLoginOpen(false)}
      />
    </div>
  );
}
