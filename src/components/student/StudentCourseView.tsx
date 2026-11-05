"use client";

import React from "react";
import { useAcademy } from "@/lib/store";
import { formatINR, formatDate } from "@/lib/utils";
import {
  BookOpen,
  Award,
  Package,
  Clock,
  MapPin,
  CalendarDays,
  User,
  CheckCircle,
  FileCheck,
  Sparkles,
} from "lucide-react";

export function StudentCourseView() {
  const { students, selectedStudentId, courses, batches } = useAcademy();

  const student = students.find((s) => s.id === selectedStudentId) || students[0];
  const course = courses.find((c) => c.id === student?.courseId);
  const batch = batches.find((b) => b.id === student?.batchId);

  if (!course) {
    return (
      <div className="p-8 text-center text-charcoal-400">
        No active course enrolled for this profile.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Course Header Banner */}
      <div className="bg-white rounded-3xl border border-[#EAE4DC] shadow-luxury p-6 md:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F2ECE1] pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-champagne-700 bg-champagne-50 px-2.5 py-0.5 rounded-full border border-champagne-200">
                {course.code}
              </span>
              <span className="text-xs text-charcoal-400">• {course.duration}</span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-medium text-charcoal-900 mt-2">
              {course.name}
            </h1>
            <p className="text-xs text-charcoal-600 mt-1 max-w-2xl leading-relaxed">
              {course.description}
            </p>
          </div>

          <div className="text-left md:text-right bg-[#FAF6EE] p-4 rounded-xl border border-[#E8DEC0]">
            <span className="text-[10px] uppercase font-semibold text-charcoal-500 block">
              Conferred Qualification
            </span>
            <div className="font-serif text-sm font-bold text-champagne-900 mt-0.5 flex items-center gap-1.5 md:justify-end">
              <Award className="w-4 h-4 text-champagne-600" />
              <span>{course.certification}</span>
            </div>
          </div>
        </div>

        {/* 3 Quick Cohort Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-charcoal-700 pt-1">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF8F5] border border-[#EBE4DC]">
            <CalendarDays className="w-4 h-4 text-champagne-700 shrink-0" />
            <div>
              <span className="text-[10px] uppercase text-charcoal-400 font-semibold block">
                Cohort Dates
              </span>
              <span className="font-medium">
                {formatDate(batch?.startDate)} → {formatDate(batch?.endDate)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF8F5] border border-[#EBE4DC]">
            <Clock className="w-4 h-4 text-champagne-700 shrink-0" />
            <div>
              <span className="text-[10px] uppercase text-charcoal-400 font-semibold block">
                Class Schedule
              </span>
              <span className="font-medium">{batch?.schedule}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF8F5] border border-[#EBE4DC]">
            <MapPin className="w-4 h-4 text-champagne-700 shrink-0" />
            <div>
              <span className="text-[10px] uppercase text-charcoal-400 font-semibold block">
                Studio Lab
              </span>
              <span className="font-medium">{batch?.locationRoom}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Syllabus Modules Detailed Walkthrough */}
      <div className="bg-white rounded-3xl border border-[#EAE4DC] shadow-luxury p-6 md:p-8 space-y-6">
        <div className="border-b border-[#F2ECE1] pb-4">
          <h3 className="font-serif text-xl font-medium text-charcoal-900">
            Official Course Curriculum & Practical Modules
          </h3>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Structured step-by-step master lessons delivered by industry guest artists and lead instructors.
          </p>
        </div>

        <div className="space-y-4">
          {course.syllabusModules.map((mod, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl border border-[#EBE4DC] bg-[#FCFAF7] hover:bg-white hover:border-champagne-400 transition"
            >
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-charcoal-950 text-champagne-300 flex items-center justify-center font-serif font-bold text-sm shrink-0 shadow-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="font-semibold text-charcoal-900 text-sm">{mod}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-[#E4D9CA] text-charcoal-600 font-medium self-start sm:self-auto">
                      Module {index + 1} • Laboratory & Practical
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-500 mt-1 leading-relaxed">
                    Interactive hands-on demo on live models, tool sanitation, corrective shading, and portfolio photo capture under studio lights.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kit & Faculty Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kit Allotment */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE4DC] shadow-luxury space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F2ECE1]">
            <Package className="w-4 h-4 text-champagne-700" />
            <h3 className="font-serif text-base font-semibold text-charcoal-900">
              Professional Vanity Kit & Equipment
            </h3>
          </div>

          <p className="text-xs text-charcoal-600 leading-relaxed">
            Every enrolled student receives a custom monogrammed Game of Makeup leather travel vanity trunk with salon-grade brushes, HD silicone bases, and sterile brush cleansers.
          </p>

          <div className="p-3 bg-[#FAF6EE] rounded-xl border border-[#E8DEC0] text-xs space-y-1.5 text-champagne-950">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Status: Allotted & Verified by Registrar</span>
            </div>
            <p className="text-[11px] text-charcoal-600">
              Kit items are calibrated for film, bridal, and HD digital photography.
            </p>
          </div>
        </div>

        {/* Faculty Profile */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE4DC] shadow-luxury space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F2ECE1]">
            <User className="w-4 h-4 text-champagne-700" />
            <h3 className="font-serif text-base font-semibold text-charcoal-900">
              Lead Mentor & Trainer
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-charcoal-900 text-champagne-400 flex items-center justify-center font-serif text-lg font-bold">
              {batch?.trainer.charAt(0) || "T"}
            </div>
            <div>
              <h4 className="font-semibold text-charcoal-900 text-sm">{batch?.trainer}</h4>
              <p className="text-xs text-champagne-800 font-medium">Head of Artistry & Master Mentor</p>
            </div>
          </div>

          <p className="text-xs text-charcoal-600 leading-relaxed">
            Over 14 years of commercial fashion week, Bollywood celebrity bridal styling, and masterclass instruction experience.
          </p>
        </div>
      </div>
    </div>
  );
}
