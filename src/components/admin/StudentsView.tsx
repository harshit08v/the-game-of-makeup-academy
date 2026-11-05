"use client";

import React, { useState, useMemo } from "react";
import { useAcademy } from "@/lib/store";
import { Student, FeeStatus, EnrollmentStatus } from "@/types";
import { formatINR, formatDate, exportToCSV } from "@/lib/utils";
import {
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Download,
  CreditCard,
  UserCheck,
  Calendar,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Receipt,
  X,
  Sparkles,
  ArrowRightLeft,
} from "lucide-react";

export function StudentsView() {
  const {
    students,
    courses,
    batches,
    payments,
    updateStudent,
    deleteStudent,
    reallocateStudentBatch,
    openReceiptModal,
    showToast,
  } = useAcademy();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [feeStatusFilter, setFeeStatusFilter] = useState("ALL");
  const [enrollmentFilter, setEnrollmentFilter] = useState("ALL");

  // Modals & Drawers
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<"overview" | "fees" | "batch">("overview");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [reallocatingStudent, setReallocatingStudent] = useState<Student | null>(null);
  const [newBatchIdForRealloc, setNewBatchIdForRealloc] = useState("");

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((stu) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        stu.fullName.toLowerCase().includes(query) ||
        stu.id.toLowerCase().includes(query) ||
        stu.email.toLowerCase().includes(query) ||
        stu.phone.includes(query) ||
        stu.city.toLowerCase().includes(query);

      const matchesCourse = courseFilter === "ALL" || stu.courseId === courseFilter;
      const matchesFee = feeStatusFilter === "ALL" || stu.feeStatus === feeStatusFilter;
      const matchesEnrollment =
        enrollmentFilter === "ALL" || stu.enrollmentStatus === enrollmentFilter;

      return matchesSearch && matchesCourse && matchesFee && matchesEnrollment;
    });
  }, [students, searchQuery, courseFilter, feeStatusFilter, enrollmentFilter]);

  // Handle Edit Submit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    updateStudent(editingStudent);
    // Also update selected student if open
    if (selectedStudent && selectedStudent.id === editingStudent.id) {
      setSelectedStudent(editingStudent);
    }
    setEditingStudent(null);
  };

  // Handle Batch Reallocation
  const handleConfirmReallocation = () => {
    if (!reallocatingStudent || !newBatchIdForRealloc) return;
    const success = reallocateStudentBatch(reallocatingStudent.id, newBatchIdForRealloc);
    if (success) {
      // Refresh current selected student
      const updated = students.find((s) => s.id === reallocatingStudent.id);
      if (updated) setSelectedStudent(updated);
      setReallocatingStudent(null);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Student ID",
      "Full Name",
      "Phone",
      "Email",
      "City",
      "Course",
      "Batch",
      "Admission Date",
      "Total Fee",
      "Paid Amount",
      "Outstanding Balance",
      "Fee Status",
      "Enrollment Status",
    ];
    const rows = filteredStudents.map((s) => [
      s.id,
      s.fullName,
      s.phone,
      s.email,
      s.city,
      s.courseName,
      s.batchName,
      s.admissionDate,
      s.totalFee,
      s.paidAmount,
      Math.max(0, s.totalFee - s.paidAmount),
      s.feeStatus,
      s.enrollmentStatus,
    ]);
    exportToCSV("Academy_Student_Directory", headers, rows);
    showToast("CSV Exported", "Student directory roster downloaded.", "info");
  };

  // Student specific payments
  const studentPayments = useMemo(() => {
    if (!selectedStudent) return [];
    return payments.filter((p) => p.studentId === selectedStudent.id);
  }, [selectedStudent, payments]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE4DC] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-champagne-700 bg-champagne-50 px-2 py-0.5 rounded-full border border-champagne-200">
              Academic Directory
            </span>
            <span className="text-xs text-charcoal-400">• Total: {students.length} Artists</span>
          </div>
          <h1 className="font-serif text-2xl font-medium text-charcoal-900 mt-1">
            Student Management & Profiles
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Manage enrolled artistry candidates, audit fee statements, and oversee batch transfers.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-white border border-[#DCD3C7] text-charcoal-700 hover:bg-[#FAF6F0] transition shadow-sm self-start md:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-charcoal-500" />
          <span>Export Directory (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#EAE4DC] shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
          <input
            type="text"
            placeholder="Search by student name, ID, phone or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#DACFBF] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-champagne-600 transition placeholder:text-charcoal-400"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto text-xs text-charcoal-600">
          {/* Fee Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium">Fee:</span>
            <select
              value={feeStatusFilter}
              onChange={(e) => setFeeStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[#DACFBF] bg-[#FAF8F5] text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-champagne-600"
            >
              <option value="ALL">All Fees</option>
              <option value="Paid">Fully Paid</option>
              <option value="Partial">Partial Dues</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          {/* Enrollment Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium">Status:</span>
            <select
              value={enrollmentFilter}
              onChange={(e) => setEnrollmentFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[#DACFBF] bg-[#FAF8F5] text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-champagne-600"
            >
              <option value="ALL">All Enrollment</option>
              <option value="Active">Active</option>
              <option value="Completed">Graduated / Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          {/* Course */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium">Course:</span>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[#DACFBF] bg-[#FAF8F5] text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-champagne-600 max-w-[180px]"
            >
              <option value="ALL">All Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-[#EAE4DC] shadow-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#EAE4DC] text-[10px] uppercase font-semibold text-charcoal-500 tracking-wider">
                <th className="py-3 px-4">Student ID & Name</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Course & Batch</th>
                <th className="py-3 px-4 text-right">Fee Status</th>
                <th className="py-3 px-4 text-center">Enrollment</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE1]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-charcoal-400">
                    <p className="text-sm font-medium">No students match your criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => {
                  const outstanding = Math.max(0, stu.totalFee - stu.paidAmount);
                  return (
                    <tr key={stu.id} className="hover:bg-[#FCFAF7] transition group">
                      {/* ID and Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-charcoal-900 text-champagne-300 flex items-center justify-center font-serif font-bold text-xs shrink-0">
                            {stu.fullName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-semibold text-charcoal-900 hover:text-champagne-700 cursor-pointer block"
                              onClick={() => {
                                setSelectedStudent(stu);
                                setActiveProfileTab("overview");
                              }}
                            >
                              {stu.fullName}
                            </span>
                            <span className="font-mono text-[10px] text-charcoal-400">
                              {stu.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 px-4 text-charcoal-600">
                        <div className="font-medium text-charcoal-800">{stu.phone}</div>
                        <div className="text-[11px] text-charcoal-400 truncate max-w-[180px]">
                          {stu.email}
                        </div>
                        <div className="text-[10px] text-charcoal-400 mt-0.5">{stu.city}</div>
                      </td>

                      {/* Course & Batch */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-charcoal-900">{stu.courseName}</div>
                        <div className="text-[11px] text-champagne-700 mt-0.5">{stu.batchName}</div>
                      </td>

                      {/* Fee Status */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-mono font-medium text-charcoal-900">
                          {formatINR(stu.paidAmount)} / {formatINR(stu.totalFee)}
                        </div>
                        <div className="mt-1">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                              stu.feeStatus === "Paid"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : stu.feeStatus === "Partial"
                                ? "bg-amber-50 text-amber-900 border border-amber-200"
                                : "bg-rose-50 text-rose-800 border border-rose-200"
                            }`}
                          >
                            {stu.feeStatus}
                            {outstanding > 0 && ` (Due ${formatINR(outstanding)})`}
                          </span>
                        </div>
                      </td>

                      {/* Enrollment Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            stu.enrollmentStatus === "Active"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : stu.enrollmentStatus === "Completed"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : "bg-charcoal-100 text-charcoal-700 border-charcoal-200"
                          }`}
                        >
                          {stu.enrollmentStatus}
                        </span>
                        {stu.attendanceRate && (
                          <div className="text-[10px] text-charcoal-400 mt-0.5 font-mono">
                            Att: {stu.attendanceRate}%
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right space-x-1">
                        <button
                          onClick={() => {
                            setSelectedStudent(stu);
                            setActiveProfileTab("overview");
                          }}
                          className="p-1.5 rounded-lg text-charcoal-500 hover:text-charcoal-900 hover:bg-[#F2ECE1] transition"
                          title="View Full Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setEditingStudent(stu)}
                          className="p-1.5 rounded-lg text-charcoal-500 hover:text-charcoal-900 hover:bg-[#F2ECE1] transition"
                          title="Edit Student Info"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setReallocatingStudent(stu);
                            setNewBatchIdForRealloc(stu.batchId);
                          }}
                          className="p-1.5 rounded-lg text-champagne-700 hover:text-champagne-900 hover:bg-[#F7F2EB] transition"
                          title="Change Batch / Transfer"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => deleteStudent(stu.id)}
                          className="p-1.5 rounded-lg text-charcoal-400 hover:text-rose-700 hover:bg-rose-50 transition"
                          title="Delete Student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL 1: STUDENT PROFILE DRAWER / MODAL --- */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-luxury-lg border border-[#EAE4DC] overflow-hidden max-h-[92vh] flex flex-col">
            {/* Top Bar */}
            <div className="px-6 py-4 border-b border-[#F0EAE1] bg-[#FAF8F5] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-charcoal-900 text-champagne-300 flex items-center justify-center font-serif font-bold text-base shadow-sm">
                  {selectedStudent.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-charcoal-900">
                    {selectedStudent.fullName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-charcoal-500">
                    <span className="font-mono">{selectedStudent.id}</span>
                    <span>•</span>
                    <span>Enrolled {formatDate(selectedStudent.admissionDate)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Tabs */}
            <div className="flex border-b border-[#F0EAE1] px-6 text-xs font-medium text-charcoal-600 bg-white">
              <button
                onClick={() => setActiveProfileTab("overview")}
                className={`py-3 px-3 border-b-2 transition ${
                  activeProfileTab === "overview"
                    ? "border-charcoal-900 text-charcoal-900 font-semibold"
                    : "border-transparent hover:text-charcoal-900"
                }`}
              >
                Overview & Contact
              </button>
              <button
                onClick={() => setActiveProfileTab("fees")}
                className={`py-3 px-3 border-b-2 transition ${
                  activeProfileTab === "fees"
                    ? "border-charcoal-900 text-charcoal-900 font-semibold"
                    : "border-transparent hover:text-charcoal-900"
                }`}
              >
                Fee Ledger & Receipts ({studentPayments.length})
              </button>
              <button
                onClick={() => setActiveProfileTab("batch")}
                className={`py-3 px-3 border-b-2 transition ${
                  activeProfileTab === "batch"
                    ? "border-charcoal-900 text-charcoal-900 font-semibold"
                    : "border-transparent hover:text-charcoal-900"
                }`}
              >
                Cohort & Curriculum
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {activeProfileTab === "overview" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE4DC]">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-charcoal-400">
                        Primary Phone
                      </span>
                      <p className="font-medium text-charcoal-800 mt-0.5">{selectedStudent.phone}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-charcoal-400">
                        Email Address
                      </span>
                      <p className="font-medium text-charcoal-800 mt-0.5">{selectedStudent.email}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-charcoal-400">
                        Home City
                      </span>
                      <p className="font-medium text-charcoal-800 mt-0.5">{selectedStudent.city}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-charcoal-400">
                        Emergency Contact
                      </span>
                      <p className="font-medium text-charcoal-800 mt-0.5">
                        {selectedStudent.emergencyContact} ({selectedStudent.emergencyRelation})
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-[#EAE4DC] bg-white">
                      <span className="text-[10px] uppercase font-semibold text-charcoal-400 block mb-1">
                        Enrollment Status
                      </span>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {selectedStudent.enrollmentStatus}
                      </span>
                      <p className="text-[11px] text-charcoal-500 mt-2">
                        Attendance Record:{" "}
                        <span className="font-semibold text-charcoal-900">
                          {selectedStudent.attendanceRate || 100}%
                        </span>
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-[#EAE4DC] bg-white">
                      <span className="text-[10px] uppercase font-semibold text-charcoal-400 block mb-1">
                        Fee Settlement
                      </span>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          selectedStudent.feeStatus === "Paid"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {selectedStudent.feeStatus}
                      </span>
                      <p className="text-[11px] text-charcoal-500 mt-2 font-mono">
                        Balance Due:{" "}
                        <span className="font-semibold text-charcoal-900">
                          {formatINR(Math.max(0, selectedStudent.totalFee - selectedStudent.paidAmount))}
                        </span>
                      </p>
                    </div>
                  </div>

                  {selectedStudent.notes && (
                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE4DC]">
                      <span className="text-[10px] uppercase font-semibold text-charcoal-400 block mb-1">
                        Academic Notes
                      </span>
                      <p className="text-charcoal-700 italic">{selectedStudent.notes}</p>
                    </div>
                  )}
                </div>
              )}

              {activeProfileTab === "fees" && (
                <div className="space-y-4">
                  {/* Fee Summary Pill */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE4DC]">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-charcoal-400">
                        Total Course Tuition
                      </span>
                      <p className="font-serif text-lg font-bold text-charcoal-900">
                        {formatINR(selectedStudent.totalFee)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-charcoal-400">
                        Paid to Date
                      </span>
                      <p className="font-serif text-lg font-bold text-emerald-800">
                        {formatINR(selectedStudent.paidAmount)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-charcoal-400">
                        Remaining Dues
                      </span>
                      <p className="font-serif text-lg font-bold text-rose-800">
                        {formatINR(Math.max(0, selectedStudent.totalFee - selectedStudent.paidAmount))}
                      </p>
                    </div>
                  </div>

                  {/* Payment History Table */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-charcoal-800 text-xs">
                      Simulated Payment Records
                    </h4>
                    {studentPayments.length === 0 ? (
                      <p className="text-charcoal-400 italic py-4 text-center">
                        No payments recorded yet for this student.
                      </p>
                    ) : (
                      <div className="divide-y divide-[#F0EAE1] border border-[#EAE4DC] rounded-xl overflow-hidden bg-white">
                        {studentPayments.map((p) => (
                          <div key={p.id} className="p-3 flex items-center justify-between">
                            <div>
                              <div className="font-medium text-charcoal-900">{formatINR(p.amount)}</div>
                              <div className="text-[10px] text-charcoal-500 font-mono mt-0.5">
                                {p.receiptNumber} • {formatDate(p.date)} via {p.method}
                              </div>
                            </div>
                            <button
                              onClick={() => openReceiptModal(p)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg bg-[#FAF5EE] text-champagne-800 hover:bg-[#F2E7D5] border border-[#E3D4C1] transition"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                              <span>View Receipt</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeProfileTab === "batch" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE4DC] space-y-2">
                    <h4 className="font-serif text-base font-semibold text-charcoal-900">
                      {selectedStudent.courseName}
                    </h4>
                    <p className="text-charcoal-600">
                      Currently Assigned Cohort:{" "}
                      <span className="font-semibold text-charcoal-900">
                        {selectedStudent.batchName}
                      </span>
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setReallocatingStudent(selectedStudent);
                        setNewBatchIdForRealloc(selectedStudent.batchId);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-charcoal-900 text-ivory-50 hover:bg-charcoal-800 transition"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5 text-champagne-400" />
                      <span>Transfer to Another Cohort</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-[#F0EAE1] bg-[#FAF8F5] flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-1.5 text-xs font-medium text-charcoal-800 bg-white border border-[#DACFBF] rounded-lg hover:bg-[#F2ECE0]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: EDIT STUDENT INFO --- */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-luxury-lg border border-[#EAE4DC] overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
              <h3 className="font-serif text-lg font-medium text-charcoal-900">
                Edit Student — {editingStudent.id}
              </h3>
              <button
                onClick={() => setEditingStudent(null)}
                className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingStudent.fullName}
                  onChange={(e) =>
                    setEditingStudent({ ...editingStudent, fullName: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.phone}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editingStudent.email}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, email: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">City</label>
                  <input
                    type="text"
                    value={editingStudent.city}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, city: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Enrollment</label>
                  <select
                    value={editingStudent.enrollmentStatus}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        enrollmentStatus: e.target.value as EnrollmentStatus,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed / Graduated</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Dropped">Dropped</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Emergency Contact</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Phone number"
                    value={editingStudent.emergencyContact}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, emergencyContact: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                  />
                  <input
                    type="text"
                    placeholder="Relation (e.g. Mother)"
                    value={editingStudent.emergencyRelation}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, emergencyRelation: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Academic Notes</label>
                <textarea
                  rows={2}
                  value={editingStudent.notes || ""}
                  onChange={(e) =>
                    setEditingStudent({ ...editingStudent, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                />
              </div>

              <div className="pt-3 border-t border-[#F0EAE1] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-3 py-1.5 rounded-lg text-charcoal-600 hover:bg-[#F2ECE0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold bg-charcoal-900 text-ivory-50 rounded-lg hover:bg-charcoal-800"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: REALLOCATE BATCH --- */}
      {reallocatingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-luxury-lg border border-[#EAE4DC] p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-champagne-700" />
                <h3 className="font-serif text-lg font-medium text-charcoal-900">
                  Transfer Cohort
                </h3>
              </div>
              <button
                onClick={() => setReallocatingStudent(null)}
                className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-charcoal-600">
              Transfer <span className="font-semibold text-charcoal-900">{reallocatingStudent.fullName}</span> to a different batch.
            </p>

            <div>
              <label className="block font-semibold text-charcoal-700 mb-1">
                Select Destination Batch
              </label>
              <select
                value={newBatchIdForRealloc}
                onChange={(e) => setNewBatchIdForRealloc(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#DACFBF] bg-white focus:outline-none focus:ring-1 focus:ring-champagne-600"
              >
                {batches.map((b) => {
                  const isCurrent = b.id === reallocatingStudent.batchId;
                  const isFull = b.enrolledCount >= b.maxCapacity && !isCurrent;
                  return (
                    <option key={b.id} value={b.id} disabled={isFull}>
                      {b.name} ({b.enrolledCount}/{b.maxCapacity} seats) {isCurrent ? "— CURRENT" : isFull ? "— FULL" : ""}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="pt-3 border-t border-[#F0EAE1] flex justify-end gap-2">
              <button
                onClick={() => setReallocatingStudent(null)}
                className="px-3 py-1.5 rounded-lg text-charcoal-600 hover:bg-[#F2ECE0]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReallocation}
                className="px-4 py-1.5 font-semibold bg-champagne-600 hover:bg-champagne-700 text-white rounded-lg transition"
              >
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
