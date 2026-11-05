"use client";

import React, { useState, useMemo } from "react";
import { useAcademy } from "@/lib/store";
import { Admission, AdmissionStatus, PaymentMethod } from "@/types";
import { formatINR, formatDate, exportToCSV } from "@/lib/utils";
import {
  Search,
  Filter,
  Plus,
  FileCheck2,
  XCircle,
  Eye,
  Edit2,
  Trash2,
  UserCheck,
  Download,
  AlertCircle,
  CheckCircle2,
  X,
  Sparkles,
} from "lucide-react";

export function AdmissionsView() {
  const {
    admissions,
    courses,
    batches,
    addAdmission,
    updateAdmission,
    deleteAdmission,
    approveAdmission,
    rejectAdmission,
    convertToStudent,
    showToast,
  } = useAcademy();

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [courseFilter, setCourseFilter] = useState<string>("ALL");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingAdmission, setViewingAdmission] = useState<Admission | null>(null);
  const [editingAdmission, setEditingAdmission] = useState<Admission | null>(null);
  const [convertingAdmission, setConvertingAdmission] = useState<Admission | null>(null);

  // Form State for New Admission
  const [formData, setFormData] = useState({
    studentName: "",
    phone: "",
    email: "",
    courseId: courses[0]?.id || "",
    preferredBatchId: batches[0]?.id || "",
    admissionDate: new Date().toISOString().split("T")[0],
    totalCourseFee: courses[0]?.fee || 75000,
    amountPaid: 25000,
    paymentMethod: "UPI" as PaymentMethod,
    notes: "",
    status: "New" as AdmissionStatus,
  });

  // Convert Modal State
  const [convertBatchId, setConvertBatchId] = useState("");
  const [convertPaidAmount, setConvertPaidAmount] = useState(0);
  const [convertMethod, setConvertMethod] = useState<PaymentMethod>("UPI");

  // Synchronize fee when course changes in new admission form
  const handleCourseChange = (courseId: string) => {
    const selectedCourse = courses.find((c) => c.id === courseId);
    const availableBatches = batches.filter((b) => b.courseId === courseId);
    setFormData((prev) => ({
      ...prev,
      courseId,
      totalCourseFee: selectedCourse ? selectedCourse.fee : prev.totalCourseFee,
      preferredBatchId: availableBatches[0]?.id || "",
    }));
  };

  // Filtered Admissions List
  const filteredAdmissions = useMemo(() => {
    return admissions.filter((adm) => {
      const matchesSearch =
        adm.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        adm.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        adm.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        adm.phone.includes(searchQuery);

      const matchesStatus = statusFilter === "ALL" || adm.status === statusFilter;
      const matchesCourse = courseFilter === "ALL" || adm.courseId === courseFilter;

      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [admissions, searchQuery, statusFilter, courseFilter]);

  // Handle Form Submit for New Admission
  const handleSubmitNewAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName.trim() || !formData.phone.trim() || !formData.email.trim()) {
      showToast("Validation Error", "Please fill in student name, phone and email.", "error");
      return;
    }

    if (formData.amountPaid > formData.totalCourseFee) {
      showToast("Fee Error", "Amount paid cannot exceed total course fee.", "error");
      return;
    }

    const selectedCourse = courses.find((c) => c.id === formData.courseId);
    const selectedBatch = batches.find((b) => b.id === formData.preferredBatchId);

    addAdmission({
      studentName: formData.studentName,
      phone: formData.phone,
      email: formData.email,
      courseId: formData.courseId,
      courseName: selectedCourse?.name || "Professional Makeup Course",
      preferredBatchId: formData.preferredBatchId,
      preferredBatchName: selectedBatch?.name || "",
      admissionDate: formData.admissionDate,
      totalCourseFee: Number(formData.totalCourseFee),
      amountPaid: Number(formData.amountPaid),
      paymentMethod: formData.paymentMethod,
      notes: formData.notes,
      status: formData.status,
    });

    setIsAddModalOpen(false);
    // Reset form
    setFormData({
      studentName: "",
      phone: "",
      email: "",
      courseId: courses[0]?.id || "",
      preferredBatchId: batches[0]?.id || "",
      admissionDate: new Date().toISOString().split("T")[0],
      totalCourseFee: courses[0]?.fee || 75000,
      amountPaid: 25000,
      paymentMethod: "UPI",
      notes: "",
      status: "New",
    });
  };

  // Handle Edit Submit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmission) return;
    updateAdmission(editingAdmission);
    setEditingAdmission(null);
  };

  // Handle Convert to Student
  const handleConfirmConvert = () => {
    if (!convertingAdmission) return;
    const success = convertToStudent(
      convertingAdmission.id,
      convertBatchId,
      Number(convertPaidAmount),
      convertMethod
    );
    if (success) {
      setConvertingAdmission(null);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Application No",
      "Student Name",
      "Phone",
      "Email",
      "Course",
      "Preferred Batch",
      "Admission Date",
      "Total Fee",
      "Amount Paid",
      "Payment Mode",
      "Status",
    ];
    const rows = filteredAdmissions.map((a) => [
      a.applicationNumber,
      a.studentName,
      a.phone,
      a.email,
      a.courseName,
      a.preferredBatchName || "N/A",
      a.admissionDate,
      a.totalCourseFee,
      a.amountPaid,
      a.paymentMethod,
      a.status,
    ]);
    exportToCSV("Admissions_Register", headers, rows);
    showToast("CSV Exported", "Admissions register downloaded.", "info");
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE4DC] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-champagne-700 bg-champagne-50 px-2 py-0.5 rounded-full border border-champagne-200">
              Registrar Portal
            </span>
            <span className="text-xs text-charcoal-400">• Intake Cycle 2025</span>
          </div>
          <h1 className="font-serif text-2xl font-medium text-charcoal-900 mt-1">
            Admissions & Inquiries Management
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Process applicant dossiers, manage seat reservations, and officially enroll candidates into cohorts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-white border border-[#DCD3C7] text-charcoal-700 hover:bg-[#FAF6F0] transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-charcoal-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-charcoal-900 text-ivory-50 hover:bg-charcoal-800 transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-champagne-400" />
            <span>New Admission Application</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#EAE4DC] shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
          <input
            type="text"
            placeholder="Search by name, phone, email or app #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#DACFBF] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-champagne-600 transition placeholder:text-charcoal-400"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-charcoal-600">
            <span className="text-[11px] font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-[#DACFBF] bg-[#FAF8F5] text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-champagne-600"
            >
              <option value="ALL">All Statuses ({admissions.length})</option>
              <option value="New">New Applications</option>
              <option value="Approved">Approved</option>
              <option value="Enrolled">Enrolled Students</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Course Filter */}
          <div className="flex items-center gap-1.5 text-xs text-charcoal-600">
            <span className="text-[11px] font-medium">Course:</span>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-[#DACFBF] bg-[#FAF8F5] text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-champagne-600 max-w-[200px]"
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

      {/* Admissions Table */}
      <div className="bg-white rounded-xl border border-[#EAE4DC] shadow-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#EAE4DC] text-[10px] uppercase font-semibold text-charcoal-500 tracking-wider">
                <th className="py-3 px-4">Application</th>
                <th className="py-3 px-4">Student Details</th>
                <th className="py-3 px-4">Course & Batch</th>
                <th className="py-3 px-4 text-right">Fee & Deposit</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE1]">
              {filteredAdmissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-charcoal-400">
                    <p className="text-sm font-medium">No admissions found matching current criteria.</p>
                    <p className="text-xs text-charcoal-400 mt-1">Try clearing filters or search query.</p>
                  </td>
                </tr>
              ) : (
                filteredAdmissions.map((adm) => {
                  return (
                    <tr key={adm.id} className="hover:bg-[#FCFAF7] transition group">
                      {/* App Number & Date */}
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-semibold text-charcoal-900">{adm.applicationNumber}</span>
                        <div className="text-[10px] text-charcoal-400 mt-0.5">
                          {formatDate(adm.admissionDate || adm.createdDate)}
                        </div>
                      </td>

                      {/* Student Details */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-charcoal-900">{adm.studentName}</div>
                        <div className="text-[11px] text-charcoal-500 mt-0.5">
                          {adm.phone} • {adm.email}
                        </div>
                      </td>

                      {/* Course */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-charcoal-800">{adm.courseName}</div>
                        <div className="text-[11px] text-champagne-700 mt-0.5">
                          {adm.preferredBatchName || "Batch unassigned"}
                        </div>
                      </td>

                      {/* Fee Details */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-mono font-medium text-charcoal-900">
                          {formatINR(adm.amountPaid)} / {formatINR(adm.totalCourseFee)}
                        </div>
                        <div className="text-[10px] text-charcoal-500 mt-0.5">
                          via {adm.paymentMethod}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            adm.status === "Enrolled"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : adm.status === "Approved"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : adm.status === "New"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-rose-50 text-rose-800 border-rose-200"
                          }`}
                        >
                          {adm.status}
                        </span>
                        {adm.studentId && (
                          <div className="font-mono text-[9px] text-charcoal-400 mt-0.5">
                            {adm.studentId}
                          </div>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right space-x-1">
                        {/* Quick View Button */}
                        <button
                          onClick={() => setViewingAdmission(adm)}
                          className="p-1.5 rounded-lg text-charcoal-500 hover:text-charcoal-900 hover:bg-[#F2ECE1] transition"
                          title="View Application Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Quick Edit */}
                        <button
                          onClick={() => setEditingAdmission(adm)}
                          className="p-1.5 rounded-lg text-charcoal-500 hover:text-charcoal-900 hover:bg-[#F2ECE1] transition"
                          title="Edit Application"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* If New: Approve or Reject */}
                        {adm.status === "New" && (
                          <>
                            <button
                              onClick={() => approveAdmission(adm.id)}
                              className="px-2 py-1 text-[10px] font-medium rounded bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition"
                              title="Approve Candidate"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectAdmission(adm.id)}
                              className="px-2 py-1 text-[10px] font-medium rounded bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200 transition"
                              title="Reject Candidate"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {/* If Approved: Convert to Enrolled Student */}
                        {adm.status === "Approved" && (
                          <button
                            onClick={() => {
                              setConvertingAdmission(adm);
                              setConvertBatchId(adm.preferredBatchId || batches[0]?.id || "");
                              setConvertPaidAmount(adm.amountPaid || 0);
                              setConvertMethod(adm.paymentMethod || "UPI");
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded bg-champagne-600 text-white hover:bg-champagne-700 shadow-sm transition"
                            title="Enroll into Official Student Directory"
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>Enroll</span>
                          </button>
                        )}

                        {/* Delete Application */}
                        {adm.status !== "Enrolled" && (
                          <button
                            onClick={() => deleteAdmission(adm.id)}
                            className="p-1.5 rounded-lg text-charcoal-400 hover:text-rose-700 hover:bg-rose-50 transition"
                            title="Delete Admission"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL 1: ADD NEW ADMISSION APPLICATION --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-luxury-lg border border-[#EAE4DC] overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0EAE1] bg-[#FAF8F5]">
              <div>
                <h3 className="font-serif text-lg font-medium text-charcoal-900">
                  New Admission Application
                </h3>
                <p className="text-xs text-charcoal-500">
                  Enter student dossier and initial enrollment deposit
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-800 hover:bg-[#F2ECE2]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewAdmission} className="p-6 space-y-4 overflow-y-auto">
              {/* Student Name */}
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Full Name of Student *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Natasha Roy"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#DACFBF] focus:outline-none focus:ring-1 focus:ring-champagne-600"
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Phone Number (+91) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98201 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#DACFBF] focus:outline-none focus:ring-1 focus:ring-champagne-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#DACFBF] focus:outline-none focus:ring-1 focus:ring-champagne-600"
                  />
                </div>
              </div>

              {/* Course Selection */}
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Selected Course *
                </label>
                <select
                  value={formData.courseId}
                  onChange={(e) => handleCourseChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#DACFBF] focus:outline-none focus:ring-1 focus:ring-champagne-600"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {formatINR(c.fee)} ({c.duration})
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred Batch */}
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Preferred Cohort / Batch
                </label>
                <select
                  value={formData.preferredBatchId}
                  onChange={(e) => setFormData({ ...formData, preferredBatchId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#DACFBF] focus:outline-none focus:ring-1 focus:ring-champagne-600"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.enrolledCount}/{b.maxCapacity} Seats • Starts {formatDate(b.startDate)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Fee and Amount Paid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Total Course Fee (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.totalCourseFee}
                    onChange={(e) =>
                      setFormData({ ...formData, totalCourseFee: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#DACFBF] focus:outline-none focus:ring-1 focus:ring-champagne-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Initial Deposit / Paid (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={formData.totalCourseFee}
                    value={formData.amountPaid}
                    onChange={(e) =>
                      setFormData({ ...formData, amountPaid: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#DACFBF] focus:outline-none focus:ring-1 focus:ring-champagne-600"
                  />
                </div>
              </div>

              {/* Payment Method & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Deposit Mode
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#DACFBF] focus:outline-none focus:ring-1 focus:ring-champagne-600"
                  >
                    <option value="UPI">UPI / QR Transfer</option>
                    <option value="Bank Transfer">NEFT / RTGS Bank Transfer</option>
                    <option value="Credit/Debit Card">Credit / Debit Card</option>
                    <option value="Cash">Cash at Campus Counter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Initial Application Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as AdmissionStatus })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#DACFBF] focus:outline-none focus:ring-1 focus:ring-champagne-600"
                  >
                    <option value="New">New (Awaiting Review)</option>
                    <option value="Approved">Approved</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Counselor Notes / Special Requirements
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Has previous experience in bridal hairstyling; wants vanity kit delivered."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#DACFBF] focus:outline-none focus:ring-1 focus:ring-champagne-600"
                />
              </div>

              <div className="pt-4 border-t border-[#F0EAE1] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-charcoal-600 hover:bg-[#F2ECE0] rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-charcoal-900 text-ivory-50 rounded-lg hover:bg-charcoal-800 transition shadow-sm"
                >
                  Create Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: VIEW ADMISSION DOSSIER --- */}
      {viewingAdmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-luxury-lg border border-[#EAE4DC] overflow-hidden p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-[#F0EAE1] pb-4">
              <div>
                <span className="font-mono text-xs text-champagne-700 font-semibold">
                  {viewingAdmission.applicationNumber}
                </span>
                <h3 className="font-serif text-xl font-medium text-charcoal-900 mt-0.5">
                  {viewingAdmission.studentName}
                </h3>
                <p className="text-xs text-charcoal-500">
                  Applied on {formatDate(viewingAdmission.admissionDate || viewingAdmission.createdDate)}
                </p>
              </div>
              <button
                onClick={() => setViewingAdmission(null)}
                className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-800 hover:bg-[#F2ECE2]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-semibold text-charcoal-400">Phone</span>
                <p className="font-medium text-charcoal-800 mt-0.5">{viewingAdmission.phone}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-charcoal-400">Email</span>
                <p className="font-medium text-charcoal-800 mt-0.5">{viewingAdmission.email}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-charcoal-400">Course</span>
                <p className="font-medium text-charcoal-800 mt-0.5">{viewingAdmission.courseName}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-charcoal-400">Batch</span>
                <p className="font-medium text-charcoal-800 mt-0.5">
                  {viewingAdmission.preferredBatchName || "Not assigned"}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-charcoal-400">
                  Total Course Fee
                </span>
                <p className="font-mono font-medium text-charcoal-800 mt-0.5">
                  {formatINR(viewingAdmission.totalCourseFee)}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-charcoal-400">
                  Deposit Paid
                </span>
                <p className="font-mono font-semibold text-emerald-800 mt-0.5">
                  {formatINR(viewingAdmission.amountPaid)} ({viewingAdmission.paymentMethod})
                </p>
              </div>
            </div>

            {viewingAdmission.notes && (
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EBE4DC] text-xs">
                <span className="text-[10px] uppercase font-semibold text-charcoal-400 block mb-1">
                  Counselor Notes
                </span>
                <p className="text-charcoal-700 italic">{viewingAdmission.notes}</p>
              </div>
            )}

            <div className="pt-3 border-t border-[#F0EAE1] flex justify-end gap-2">
              <button
                onClick={() => setViewingAdmission(null)}
                className="px-4 py-2 text-xs font-semibold bg-charcoal-900 text-ivory-50 rounded-lg hover:bg-charcoal-800 transition"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: EDIT ADMISSION APPLICATION --- */}
      {editingAdmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-luxury-lg border border-[#EAE4DC] overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
              <h3 className="font-serif text-lg font-medium text-charcoal-900">
                Edit Application — {editingAdmission.applicationNumber}
              </h3>
              <button
                onClick={() => setEditingAdmission(null)}
                className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={editingAdmission.studentName}
                  onChange={(e) =>
                    setEditingAdmission({ ...editingAdmission, studentName: e.target.value })
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
                    value={editingAdmission.phone}
                    onChange={(e) =>
                      setEditingAdmission({ ...editingAdmission, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editingAdmission.email}
                    onChange={(e) =>
                      setEditingAdmission({ ...editingAdmission, email: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Status</label>
                <select
                  value={editingAdmission.status}
                  onChange={(e) =>
                    setEditingAdmission({
                      ...editingAdmission,
                      status: e.target.value as AdmissionStatus,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                >
                  <option value="New">New</option>
                  <option value="Approved">Approved</option>
                  <option value="Enrolled">Enrolled</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={editingAdmission.notes || ""}
                  onChange={(e) =>
                    setEditingAdmission({ ...editingAdmission, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                />
              </div>

              <div className="pt-3 border-t border-[#F0EAE1] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingAdmission(null)}
                  className="px-3.5 py-1.5 rounded-lg text-charcoal-600 hover:bg-[#F2ECE0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold bg-charcoal-900 text-ivory-50 rounded-lg hover:bg-charcoal-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 4: CONVERT APPROVED ADMISSION TO OFFICIAL STUDENT --- */}
      {convertingAdmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-luxury-lg border border-[#EAE4DC] overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-serif text-lg font-medium text-charcoal-900">
                    Official Student Enrollment
                  </h3>
                </div>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  Convert candidate {convertingAdmission.studentName} into active student directory
                </p>
              </div>
              <button
                onClick={() => setConvertingAdmission(null)}
                className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE4DC] space-y-1">
                <p className="font-semibold text-charcoal-900">{convertingAdmission.studentName}</p>
                <p className="text-charcoal-600">
                  Enrolling in: <span className="font-medium">{convertingAdmission.courseName}</span>
                </p>
                <p className="text-charcoal-600 font-mono">
                  Total Course Fee: {formatINR(convertingAdmission.totalCourseFee)}
                </p>
              </div>

              {/* Batch Allocation */}
              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">
                  Assign To Cohort / Batch *
                </label>
                <select
                  value={convertBatchId}
                  onChange={(e) => setConvertBatchId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#DACFBF] bg-white focus:outline-none focus:ring-1 focus:ring-champagne-600"
                >
                  {batches.map((b) => {
                    const isFull = b.enrolledCount >= b.maxCapacity;
                    return (
                      <option key={b.id} value={b.id} disabled={isFull}>
                        {b.name} — {b.enrolledCount}/{b.maxCapacity} Seats {isFull ? "(FULL)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Deposit to Record */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">
                    Recorded Payment Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={convertingAdmission.totalCourseFee}
                    value={convertPaidAmount}
                    onChange={(e) => setConvertPaidAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">
                    Payment Instrument
                  </label>
                  <select
                    value={convertMethod}
                    onChange={(e) => setConvertMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit/Debit Card">Credit/Debit Card</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                <span className="font-semibold block mb-0.5">What happens on enrollment:</span>
                • Student ID (e.g. GOM-2025-xxx) is automatically generated.
                <br />
                • Student is added to the batch roster (capacity is decremented).
                <br />
                • Bursar payment receipt is generated for recorded deposit.
              </div>
            </div>

            <div className="pt-3 border-t border-[#F0EAE1] flex justify-end gap-2.5">
              <button
                onClick={() => setConvertingAdmission(null)}
                className="px-3.5 py-2 text-xs text-charcoal-600 hover:bg-[#F2ECE0] rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmConvert}
                className="px-4 py-2 text-xs font-semibold bg-champagne-600 hover:bg-champagne-700 text-white rounded-lg transition shadow-sm"
              >
                Confirm & Enroll Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
