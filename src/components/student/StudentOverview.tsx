"use client";

import React from "react";
import { useAcademy } from "@/lib/store";
import { formatINR, formatDate } from "@/lib/utils";
import {
  Sparkles,
  BookOpen,
  CalendarDays,
  Clock,
  MapPin,
  CreditCard,
  Receipt,
  CheckCircle2,
  AlertCircle,
  User,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export function StudentOverview() {
  const {
    students,
    selectedStudentId,
    batches,
    courses,
    payments,
    setActiveStudentTab,
    openReceiptModal,
  } = useAcademy();

  const student = students.find((s) => s.id === selectedStudentId) || students[0];
  const course = courses.find((c) => c.id === student?.courseId);
  const batch = batches.find((b) => b.id === student?.batchId);

  const studentPayments = payments.filter((p) => p.studentId === student?.id);
  const latestPayment = studentPayments[0];

  const outstanding = Math.max(0, (student?.totalFee || 0) - (student?.paidAmount || 0));
  const feePct = Math.round(((student?.paidAmount || 0) / (student?.totalFee || 1)) * 100);

  if (!student) {
    return (
      <div className="p-8 text-center text-charcoal-400">
        Student record not found. Please switch student profile from the top bar.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Editorial Welcome Banner */}
      <div className="bg-[#FAF6EE] rounded-3xl border border-[#E7DECD] p-6 md:p-8 relative overflow-hidden shadow-luxury">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#E2D6C3] text-champagne-900 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-champagne-600" />
            <span>Artist Candidate Portal • {student.id}</span>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl font-medium text-charcoal-900 tracking-tight">
            Welcome back, {student.fullName.split(" ")[0]}
          </h1>
          <p className="text-sm text-charcoal-600 mt-2 leading-relaxed">
            You are enrolled in the{" "}
            <strong className="text-charcoal-900 font-semibold">{student.courseName}</strong> at
            our flagship Bandra West campus.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveStudentTab("course")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-charcoal-900 text-ivory-50 text-xs font-semibold hover:bg-charcoal-800 transition shadow-sm"
            >
              <span>View Curriculum & Schedule</span>
              <ArrowRight className="w-3.5 h-3.5 text-champagne-400" />
            </button>

            {latestPayment && (
              <button
                onClick={() => openReceiptModal(latestPayment)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#D5C7B2] text-charcoal-800 text-xs font-semibold hover:bg-[#F2ECE0] transition shadow-sm"
              >
                <Receipt className="w-3.5 h-3.5 text-champagne-600" />
                <span>Download Latest Receipt</span>
              </button>
            )}
          </div>
        </div>

        {/* Decorative monogram watermark */}
        <div className="absolute -right-8 -bottom-10 opacity-[0.06] pointer-events-none select-none font-serif text-[180px] font-bold text-charcoal-950">
          GM
        </div>
      </div>

      {/* 3 Overview Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cohort & Schedule Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE4DC] shadow-luxury flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE1]">
              <span className="text-[10px] uppercase font-semibold text-charcoal-400 tracking-wider">
                Assigned Cohort
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                {batch?.status || "In Progress"}
              </span>
            </div>

            <h3 className="font-serif text-lg font-semibold text-charcoal-900 mt-3">
              {student.batchName}
            </h3>

            <div className="mt-4 space-y-2.5 text-xs text-charcoal-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-champagne-600 shrink-0" />
                <span>
                  Trainer: <strong>{batch?.trainer || "Senior Faculty"}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-charcoal-400 shrink-0" />
                <span>{batch?.schedule || "Mon to Thu • 10:00 AM - 02:00 PM"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-charcoal-400 shrink-0" />
                <span>{batch?.locationRoom || "Studio Suite 1 — Bridal Wing"}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#F2ECE1] flex items-center justify-between text-xs text-charcoal-500">
            <span>Intake Starts</span>
            <span className="font-medium text-charcoal-800">
              {formatDate(batch?.startDate || student.admissionDate)}
            </span>
          </div>
        </div>

        {/* Tuition & Fee Balance Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE4DC] shadow-luxury flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE1]">
              <span className="text-[10px] uppercase font-semibold text-charcoal-400 tracking-wider">
                Fee Status
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                  student.feeStatus === "Paid"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : student.feeStatus === "Partial"
                    ? "bg-amber-50 text-amber-800 border-amber-200"
                    : "bg-rose-50 text-rose-800 border-rose-200"
                }`}
              >
                {student.feeStatus}
              </span>
            </div>

            <div className="mt-3">
              <div className="font-serif text-2xl font-bold text-charcoal-900">
                {formatINR(student.paidAmount)}
              </div>
              <span className="text-xs text-charcoal-500">
                Paid of {formatINR(student.totalFee)} Total Tuition
              </span>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-[11px] text-charcoal-600 mb-1 font-medium">
                <span>Payment Progress</span>
                <span className="font-mono">{feePct}%</span>
              </div>
              <div className="w-full h-2 bg-[#F0EAE1] rounded-full overflow-hidden">
                <div
                  className="h-full bg-champagne-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(feePct, 100)}%` }}
                />
              </div>
            </div>

            {outstanding > 0 ? (
              <p className="text-xs text-amber-900 font-medium mt-3 bg-amber-50/80 p-2 rounded-lg border border-amber-200">
                Balance due: {formatINR(outstanding)}
              </p>
            ) : (
              <p className="text-xs text-emerald-800 font-medium mt-3 bg-emerald-50/80 p-2 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Account in good standing. All dues cleared.</span>
              </p>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-[#F2ECE1]">
            <button
              onClick={() => setActiveStudentTab("fees")}
              className="text-xs font-semibold text-champagne-700 hover:text-champagne-900 flex items-center gap-1 transition"
            >
              <span>View Statement & Receipts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Academic Standing & Attendance */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE4DC] shadow-luxury flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE1]">
              <span className="text-[10px] uppercase font-semibold text-charcoal-400 tracking-wider">
                Student Standing
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 font-semibold border border-blue-200">
                {student.enrollmentStatus}
              </span>
            </div>

            <h3 className="font-serif text-lg font-semibold text-charcoal-900 mt-3">
              Attendance: {student.attendanceRate || 95}%
            </h3>

            <p className="text-xs text-charcoal-600 mt-2 leading-relaxed">
              Minimum 85% practical studio attendance is required for graduation and diploma conferral.
            </p>

            <div className="mt-4 p-3 bg-[#FCFAF7] rounded-xl border border-[#EAE4DC] text-xs space-y-1">
              <span className="text-[10px] uppercase font-semibold text-charcoal-400 block">
                Vanity Kit Status
              </span>
              <p className="text-emerald-800 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pro Artistry Vanity Kit Issued</span>
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#F2ECE1] flex items-center justify-between text-xs text-charcoal-500">
            <span>Admission Date</span>
            <span className="font-medium text-charcoal-800">
              {formatDate(student.admissionDate)}
            </span>
          </div>
        </div>
      </div>

      {/* Course Curriculum Preview */}
      {course && (
        <div className="bg-white p-6 rounded-2xl border border-[#EAE4DC] shadow-luxury">
          <div className="flex items-center justify-between pb-4 border-b border-[#F2ECE1]">
            <div>
              <h3 className="font-serif text-lg font-medium text-charcoal-900">
                Curriculum Modules En Route
              </h3>
              <p className="text-xs text-charcoal-500">
                Topics and hands-on laboratory practicals scheduled for this term
              </p>
            </div>
            <button
              onClick={() => setActiveStudentTab("course")}
              className="text-xs font-semibold text-champagne-700 hover:text-champagne-900 flex items-center gap-1"
            >
              <span>Explore Syllabus</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 text-xs">
            {course.syllabusModules.map((mod, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-[#EBE4DC] bg-[#FCFAF7] hover:bg-white transition flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-charcoal-900 text-champagne-300 font-mono text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-charcoal-800 font-medium leading-snug">{mod}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
