"use client";

import React, { useState } from "react";
import { useAcademy } from "@/lib/store";
import { formatINR, formatDate } from "@/lib/utils";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Save,
  CheckCircle2,
  Users,
  Shield,
  Sparkles,
} from "lucide-react";

export function StudentProfileView() {
  const { students, selectedStudentId, setSelectedStudentId, updateStudent, showToast } =
    useAcademy();

  const student = students.find((s) => s.id === selectedStudentId) || students[0];

  const [formData, setFormData] = useState({
    fullName: student?.fullName || "",
    phone: student?.phone || "",
    email: student?.email || "",
    city: student?.city || "",
    emergencyContact: student?.emergencyContact || "",
    emergencyRelation: student?.emergencyRelation || "",
  });

  // When student changes, sync form data
  React.useEffect(() => {
    if (student) {
      setFormData({
        fullName: student.fullName,
        phone: student.phone,
        email: student.email,
        city: student.city,
        emergencyContact: student.emergencyContact,
        emergencyRelation: student.emergencyRelation,
      });
    }
  }, [student]);

  if (!student) {
    return (
      <div className="p-8 text-center text-charcoal-400">
        Student profile not found.
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudent({
      ...student,
      ...formData,
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 max-w-4xl">
      {/* Header */}
      <div className="border-b border-[#EAE4DC] pb-5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-champagne-700 bg-champagne-50 px-2 py-0.5 rounded-full border border-champagne-200">
            Artist Credentials
          </span>
          <span className="text-xs text-charcoal-400">• Institutional Dossier</span>
        </div>
        <h1 className="font-serif text-2xl font-medium text-charcoal-900 mt-1">
          My Student Profile & Registration
        </h1>
        <p className="text-xs text-charcoal-500 mt-0.5">
          Review academic enrollment credentials, update personal contact details, and emergency contacts.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-[#EAE4DC] shadow-luxury p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-charcoal-950 text-champagne-300 flex items-center justify-center font-serif text-2xl font-bold shadow-md shrink-0">
            {student.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl font-semibold text-charcoal-900">
                {student.fullName}
              </h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                {student.enrollmentStatus}
              </span>
            </div>
            <p className="font-mono text-xs text-charcoal-500 mt-0.5">
              Registration ID: <strong className="text-charcoal-800">{student.id}</strong>
            </p>
            <p className="text-xs text-champagne-800 font-medium mt-1">
              {student.courseName} • {student.batchName}
            </p>
          </div>
        </div>

        <div className="text-left md:text-right bg-[#FAF8F5] p-4 rounded-2xl border border-[#EBE4DC] text-xs">
          <span className="text-[10px] uppercase font-semibold text-charcoal-400 block">
            Admission Enrolled
          </span>
          <p className="font-medium text-charcoal-800 mt-0.5">
            {formatDate(student.admissionDate)}
          </p>
          <span className="text-[10px] uppercase font-semibold text-charcoal-400 block mt-2">
            Campus Studio
          </span>
          <p className="font-medium text-charcoal-800 mt-0.5">Bandra West Luxury Center</p>
        </div>
      </div>

      {/* Edit Contact Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-[#EAE4DC] shadow-luxury p-6 md:p-8 space-y-6">
        <div className="border-b border-[#F2ECE1] pb-4">
          <h3 className="font-serif text-lg font-medium text-charcoal-900">
            Personal & Emergency Contact Information
          </h3>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Keep your communications and emergency notification contacts up to date.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-charcoal-700 mb-1">Full Legal Name</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
            />
          </div>

          <div>
            <label className="block font-semibold text-charcoal-700 mb-1">
              Residential City / State
            </label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
            />
          </div>

          <div>
            <label className="block font-semibold text-charcoal-700 mb-1">Primary Mobile (+91)</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
            />
          </div>

          <div>
            <label className="block font-semibold text-charcoal-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
            />
          </div>

          <div>
            <label className="block font-semibold text-charcoal-700 mb-1">
              Emergency Contact Phone
            </label>
            <input
              type="tel"
              required
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
            />
          </div>

          <div>
            <label className="block font-semibold text-charcoal-700 mb-1">
              Emergency Relationship
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mother (Sunita Roy)"
              value={formData.emergencyRelation}
              onChange={(e) => setFormData({ ...formData, emergencyRelation: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-[#F2ECE1]">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-charcoal-900 text-ivory-50 text-xs font-semibold hover:bg-charcoal-800 transition shadow-sm"
          >
            <Save className="w-4 h-4 text-champagne-400" />
            <span>Save Profile Updates</span>
          </button>
        </div>
      </form>

      {/* Switch Demo Student Persona Helper */}
      <div className="bg-[#FAF6EE] rounded-3xl border border-[#E7DECD] p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E7DFD4]">
          <Users className="w-5 h-5 text-champagne-700" />
          <div>
            <h3 className="font-serif text-base font-semibold text-charcoal-900">
              Demo Persona Switcher
            </h3>
            <p className="text-xs text-charcoal-600">
              Preview this Student Portal from the viewpoint of different students with different fee statuses.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {students.slice(0, 6).map((s) => {
            const isSelected = s.id === student.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedStudentId(s.id)}
                className={`p-3 rounded-xl border text-left transition ${
                  isSelected
                    ? "bg-charcoal-900 text-ivory-50 border-charcoal-900 shadow-sm"
                    : "bg-white text-charcoal-800 border-[#E5DACB] hover:bg-[#FAF5EE]"
                }`}
              >
                <div className="font-semibold">{s.fullName}</div>
                <div className={`text-[10px] mt-0.5 truncate ${isSelected ? "text-champagne-300" : "text-charcoal-500"}`}>
                  {s.courseName}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                    isSelected ? "bg-charcoal-800 text-ivory-100" : "bg-[#F5EFE6] text-charcoal-700"
                  }`}>
                    {s.feeStatus} ({formatINR(s.paidAmount)})
                  </span>
                  {isSelected && <span className="text-[10px] text-champagne-400 font-semibold">Current</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
