"use client";

import React, { useState } from "react";
import { useAcademy } from "@/lib/store";
import { formatINR, formatDate, exportToCSV } from "@/lib/utils";
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  Users,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export function ReportsView() {
  const { students, admissions, payments, batches, courses, showToast } = useAcademy();

  const [dateRange, setDateRange] = useState("ALL");

  // Calculations
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalBilled = students.reduce((sum, s) => sum + s.totalFee, 0);
  const totalOutstanding = Math.max(0, totalBilled - totalRevenue);

  // Course-wise Enrollment Report Data
  const courseReportData = courses.map((c) => {
    const cStudents = students.filter((s) => s.courseId === c.id);
    const cAdmissions = admissions.filter((a) => a.courseId === c.id);
    const cRevenue = cStudents.reduce((acc, s) => acc + s.paidAmount, 0);
    const cDue = cStudents.reduce(
      (acc, s) => acc + Math.max(0, s.totalFee - s.paidAmount),
      0
    );

    return {
      courseName: c.name,
      enrolledCount: cStudents.length,
      applicationsCount: cAdmissions.length,
      revenueCollected: cRevenue,
      duesPending: cDue,
    };
  });

  // Batch Occupancy Report Data
  const batchReportData = batches.map((b) => ({
    name: b.name.split("—")[0].trim(),
    fullName: b.name,
    capacity: b.maxCapacity,
    enrolled: b.enrolledCount,
    occupancyRate: Math.round((b.enrolledCount / b.maxCapacity) * 100),
    status: b.status,
  }));

  // Export Course Enrollment CSV
  const handleExportCourseCSV = () => {
    const headers = [
      "Course Title",
      "Enrolled Students",
      "Total Inquiries/Apps",
      "Revenue Realized (INR)",
      "Pending Dues (INR)",
    ];
    const rows = courseReportData.map((d) => [
      d.courseName,
      d.enrolledCount,
      d.applicationsCount,
      d.revenueCollected,
      d.duesPending,
    ]);
    exportToCSV("Course_Enrollment_Financial_Report", headers, rows);
    showToast("CSV Exported", "Course metrics report generated.", "info");
  };

  // Export Batch Occupancy CSV
  const handleExportBatchCSV = () => {
    const headers = ["Batch Name", "Max Capacity", "Enrolled Count", "Occupancy (%)", "Status"];
    const rows = batchReportData.map((b) => [
      b.fullName,
      b.capacity,
      b.enrolled,
      `${b.occupancyRate}%`,
      b.status,
    ]);
    exportToCSV("Batch_Occupancy_Report", headers, rows);
    showToast("CSV Exported", "Batch occupancy report generated.", "info");
  };

  // Export Full Master Fee Audit CSV
  const handleExportFeeAuditCSV = () => {
    const headers = [
      "Student ID",
      "Full Name",
      "Course",
      "Batch",
      "Total Tuition (INR)",
      "Paid Amount (INR)",
      "Outstanding (INR)",
      "Fee Status",
    ];
    const rows = students.map((s) => [
      s.id,
      s.fullName,
      s.courseName,
      s.batchName,
      s.totalFee,
      s.paidAmount,
      Math.max(0, s.totalFee - s.paidAmount),
      s.feeStatus,
    ]);
    exportToCSV("Master_Fee_Audit_Report", headers, rows);
    showToast("CSV Exported", "Master fee audit register generated.", "info");
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE4DC] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-champagne-700 bg-champagne-50 px-2 py-0.5 rounded-full border border-champagne-200">
              Executive Analytics
            </span>
            <span className="text-xs text-charcoal-400">• Institutional Data Audit</span>
          </div>
          <h1 className="font-serif text-2xl font-medium text-charcoal-900 mt-1">
            Academy Reports & Intelligence
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Cross-sectional analysis on enrollment trends, financial balances, and studio utilization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportFeeAuditCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-charcoal-900 text-ivory-50 hover:bg-charcoal-800 transition shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-champagne-400" />
            <span>Export Master Audit (CSV)</span>
          </button>
        </div>
      </div>

      {/* Top 3 KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#EAE4DC] shadow-luxury">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-500">
            Total Enrolled Artists
          </span>
          <div className="text-3xl font-serif font-bold text-charcoal-900 mt-2">
            {students.length}
          </div>
          <p className="text-xs text-charcoal-500 mt-1">
            Across {courses.length} active programs & {batches.length} cohorts
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EAE4DC] shadow-luxury">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-800">
            Realized Tuition Revenue
          </span>
          <div className="text-3xl font-serif font-bold text-emerald-900 mt-2">
            {formatINR(totalRevenue)}
          </div>
          <p className="text-xs text-emerald-700 mt-1 font-medium">
            From {payments.length} verified electronic transactions
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EAE4DC] shadow-luxury">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-rose-800">
            Remaining Receivable Balance
          </span>
          <div className="text-3xl font-serif font-bold text-rose-950 mt-2">
            {formatINR(totalOutstanding)}
          </div>
          <p className="text-xs text-rose-700 mt-1 font-medium">
            Projected collections for active semester
          </p>
        </div>
      </div>

      {/* Report 1: Course-wise Enrollment & Revenue */}
      <div className="bg-white p-6 rounded-2xl border border-[#EAE4DC] shadow-luxury space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F2ECE1]">
          <div>
            <h3 className="font-serif text-lg font-medium text-charcoal-900">
              1. Course-wise Enrollment & Financial Statement
            </h3>
            <p className="text-xs text-charcoal-500">
              Detailed breakdown of candidate inquiries, enrollments, and collections per course.
            </p>
          </div>
          <button
            onClick={handleExportCourseCSV}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#DACFBF] bg-[#FAF8F5] text-charcoal-800 hover:bg-[#F2ECE0] transition self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-charcoal-500" />
            <span>Export Table</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#EAE4DC] text-[10px] uppercase font-semibold text-charcoal-500 tracking-wider">
                <th className="py-3 px-4">Program Track</th>
                <th className="py-3 px-4 text-center">Enrolled Artists</th>
                <th className="py-3 px-4 text-center">Inquiry Dossiers</th>
                <th className="py-3 px-4 text-right">Tuition Realized</th>
                <th className="py-3 px-4 text-right">Outstanding Dues</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE1]">
              {courseReportData.map((d, idx) => (
                <tr key={idx} className="hover:bg-[#FCFAF7] transition">
                  <td className="py-3.5 px-4 font-semibold text-charcoal-900">
                    {d.courseName}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-charcoal-800">
                    {d.enrolledCount}
                  </td>
                  <td className="py-3.5 px-4 text-center text-charcoal-600">
                    {d.applicationsCount}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-emerald-800">
                    {formatINR(d.revenueCollected)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-amber-900">
                    {formatINR(d.duesPending)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report 2: Batch Occupancy Rates (Chart + Table) */}
      <div className="bg-white p-6 rounded-2xl border border-[#EAE4DC] shadow-luxury space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F2ECE1]">
          <div>
            <h3 className="font-serif text-lg font-medium text-charcoal-900">
              2. Cohort Capacity & Seat Occupancy Report
            </h3>
            <p className="text-xs text-charcoal-500">
              Classroom desk utilization and remaining intake headroom across studios.
            </p>
          </div>
          <button
            onClick={handleExportBatchCSV}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#DACFBF] bg-[#FAF8F5] text-charcoal-800 hover:bg-[#F2ECE0] transition self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-charcoal-500" />
            <span>Export Table</span>
          </button>
        </div>

        {/* Occupancy Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={batchReportData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2EBE1" />
              <XAxis
                dataKey="name"
                stroke="#8C827A"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#EAE4DC" }}
              />
              <YAxis
                stroke="#8C827A"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#EAE4DC" }}
                domain={[0, 20]}
              />
              <Tooltip
                formatter={(val: number) => [`${val} seats`, ""]}
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#EAE4DC",
                  borderRadius: "10px",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Bar dataKey="enrolled" name="Enrolled Seats" fill="#C5A16F" radius={[4, 4, 0, 0]} />
              <Bar dataKey="capacity" name="Max Capacity" fill="#E4D7C5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#EAE4DC] text-[10px] uppercase font-semibold text-charcoal-500 tracking-wider">
                <th className="py-2.5 px-4">Cohort Title</th>
                <th className="py-2.5 px-4 text-center">Capacity</th>
                <th className="py-2.5 px-4 text-center">Enrolled</th>
                <th className="py-2.5 px-4 text-center">Occupancy %</th>
                <th className="py-2.5 px-4 text-center">Lifecycle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE1]">
              {batchReportData.map((b, idx) => (
                <tr key={idx} className="hover:bg-[#FCFAF7] transition">
                  <td className="py-3 px-4 font-semibold text-charcoal-900">{b.fullName}</td>
                  <td className="py-3 px-4 text-center text-charcoal-600 font-mono">{b.capacity}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-charcoal-900">
                    {b.enrolled}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-semibold">
                    <span
                      className={`inline-block px-2 py-0.5 rounded ${
                        b.occupancyRate >= 80
                          ? "bg-rose-50 text-rose-800"
                          : "bg-emerald-50 text-emerald-800"
                      }`}
                    >
                      {b.occupancyRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF5EE] text-charcoal-700 font-medium">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
