"use client";

import React from "react";
import { useAcademy } from "@/lib/store";
import { formatINR, formatDate } from "@/lib/utils";
import {
  Users,
  FileCheck2,
  Clock,
  TrendingUp,
  AlertCircle,
  CalendarCheck,
  ArrowUpRight,
  PlusCircle,
  Receipt,
  UserPlus,
  BookOpen,
  ArrowRight,
  Sparkles,
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
} from "recharts";

interface OverviewDashboardProps {
  onOpenNewAdmission: () => void;
  onOpenRecordPayment: () => void;
  onOpenNewBatch: () => void;
  onOpenNewCourse: () => void;
}

export function OverviewDashboard({
  onOpenNewAdmission,
  onOpenRecordPayment,
  onOpenNewBatch,
  onOpenNewCourse,
}: OverviewDashboardProps) {
  const {
    students,
    admissions,
    payments,
    batches,
    courses,
    setActiveAdminTab,
    openReceiptModal,
  } = useAcademy();

  // Calculated Metrics directly from live state
  const totalStudents = students.length;
  const activeAdmissions = admissions.filter(
    (a) => a.status === "Approved" || a.status === "Enrolled"
  ).length;
  const pendingAdmissions = admissions.filter((a) => a.status === "New").length;

  const totalFeesCollected = payments.reduce((sum, p) => sum + p.amount, 0);

  const totalCourseFeesBilled = students.reduce((sum, s) => sum + s.totalFee, 0);
  const totalStudentPaid = students.reduce((sum, s) => sum + s.paidAmount, 0);
  const outstandingFees = Math.max(0, totalCourseFeesBilled - totalStudentPaid);

  const upcomingBatches = batches.filter(
    (b) => b.status === "Upcoming" || b.status === "In Progress"
  );

  // Revenue by Course for Chart
  const courseRevenueData = courses.map((course) => {
    const courseStudents = students.filter((s) => s.courseId === course.id);
    const revenue = courseStudents.reduce((acc, s) => acc + s.paidAmount, 0);
    const outstanding = courseStudents.reduce(
      (acc, s) => acc + Math.max(0, s.totalFee - s.paidAmount),
      0
    );
    return {
      name: course.name.split(" ")[0] + " " + (course.name.split(" ")[1] || ""),
      fullName: course.name,
      Collected: revenue,
      Outstanding: outstanding,
    };
  });

  // Payment method breakdown for pie chart
  const paymentMethodMap: Record<string, number> = {};
  payments.forEach((p) => {
    paymentMethodMap[p.method] = (paymentMethodMap[p.method] || 0) + p.amount;
  });
  const paymentPieData = Object.entries(paymentMethodMap).map(([name, value]) => ({
    name,
    value,
  }));
  const PIE_COLORS = ["#C5A16F", "#242322", "#8C827A", "#E0B384"];

  const recentAdmissions = admissions.slice(0, 5);
  const recentPayments = payments.slice(0, 5);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Editorial Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#EAE4DC] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-champagne-700 bg-champagne-50 px-2.5 py-0.5 rounded-full border border-champagne-200">
              Executive Console
            </span>
            <span className="text-xs text-charcoal-400">• Session 2025</span>
          </div>
          <h1 className="font-serif text-2xl lg:text-3xl font-medium text-charcoal-900 mt-1">
            Academy Intelligence Overview
          </h1>
          <p className="text-xs text-charcoal-600 mt-0.5">
            Real-time enrollment statistics, bursar transactions, and cohort occupancies.
          </p>
        </div>

        {/* Quick Action Pill Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenNewAdmission}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-charcoal-900 hover:bg-charcoal-800 text-ivory-50 transition shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5 text-champagne-400" />
            <span>New Admission</span>
          </button>
          <button
            onClick={onOpenRecordPayment}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white hover:bg-[#F9F5EE] border border-[#DCD3C7] text-charcoal-800 transition shadow-sm"
          >
            <Receipt className="w-3.5 h-3.5 text-champagne-600" />
            <span>Record Payment</span>
          </button>
          <button
            onClick={onOpenNewBatch}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-white hover:bg-[#F9F5EE] border border-[#DCD3C7] text-charcoal-700 transition"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-charcoal-500" />
            <span>New Batch</span>
          </button>
          <button
            onClick={() => setActiveAdminTab("reports")}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-[#FAF5EE] hover:bg-[#F0E7DA] text-champagne-900 border border-[#E4D7C5] transition"
          >
            <span>Full Reports</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 6 Key Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Students */}
        <div
          onClick={() => setActiveAdminTab("students")}
          className="bg-white p-4 rounded-xl border border-[#EAE4DC] shadow-luxury hover:border-champagne-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-charcoal-500">
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              Total Students
            </span>
            <div className="p-2 rounded-lg bg-[#F9F5EE] group-hover:bg-champagne-100 transition">
              <Users className="w-4 h-4 text-charcoal-700" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-serif font-bold text-charcoal-900">
              {totalStudents}
            </div>
            <p className="text-[11px] text-emerald-800 font-medium mt-1">
              Active in directory
            </p>
          </div>
        </div>

        {/* Active Admissions */}
        <div
          onClick={() => setActiveAdminTab("admissions")}
          className="bg-white p-4 rounded-xl border border-[#EAE4DC] shadow-luxury hover:border-champagne-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-charcoal-500">
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              Approved / Enrolled
            </span>
            <div className="p-2 rounded-lg bg-[#F9F5EE] group-hover:bg-champagne-100 transition">
              <FileCheck2 className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-serif font-bold text-charcoal-900">
              {activeAdmissions}
            </div>
            <p className="text-[11px] text-charcoal-500 mt-1">
              Confirmed applicants
            </p>
          </div>
        </div>

        {/* Pending Admissions */}
        <div
          onClick={() => setActiveAdminTab("admissions")}
          className="bg-white p-4 rounded-xl border border-[#EAE4DC] shadow-luxury hover:border-champagne-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-charcoal-500">
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              Pending Review
            </span>
            <div className="p-2 rounded-lg bg-amber-50 group-hover:bg-amber-100 transition">
              <Clock className="w-4 h-4 text-amber-700" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-serif font-bold text-amber-900">
              {pendingAdmissions}
            </div>
            <p className="text-[11px] text-amber-700 font-medium mt-1">
              Awaiting decision
            </p>
          </div>
        </div>

        {/* Total Fees Collected */}
        <div
          onClick={() => setActiveAdminTab("fees")}
          className="bg-white p-4 rounded-xl border border-[#EAE4DC] shadow-luxury hover:border-champagne-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-charcoal-500">
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              Fees Collected
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 transition">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-serif font-bold text-charcoal-900 truncate">
              {formatINR(totalFeesCollected)}
            </div>
            <p className="text-[11px] text-emerald-800 font-medium mt-1">
              Total realized revenue
            </p>
          </div>
        </div>

        {/* Outstanding Fees */}
        <div
          onClick={() => setActiveAdminTab("fees")}
          className="bg-white p-4 rounded-xl border border-[#EAE4DC] shadow-luxury hover:border-champagne-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-charcoal-500">
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              Outstanding Fees
            </span>
            <div className="p-2 rounded-lg bg-rose-50 group-hover:bg-rose-100 transition">
              <AlertCircle className="w-4 h-4 text-rose-700" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-serif font-bold text-rose-950 truncate">
              {formatINR(outstandingFees)}
            </div>
            <p className="text-[11px] text-rose-800 font-medium mt-1">
              Due across installments
            </p>
          </div>
        </div>

        {/* Active Batches */}
        <div
          onClick={() => setActiveAdminTab("batches")}
          className="bg-white p-4 rounded-xl border border-[#EAE4DC] shadow-luxury hover:border-champagne-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-charcoal-500">
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              Active Batches
            </span>
            <div className="p-2 rounded-lg bg-[#F9F5EE] group-hover:bg-champagne-100 transition">
              <CalendarCheck className="w-4 h-4 text-champagne-700" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-serif font-bold text-charcoal-900">
              {upcomingBatches.length}
            </div>
            <p className="text-[11px] text-charcoal-500 mt-1">
              {batches.length} cohorts configured
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Collection by Course (Bar Chart) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#EAE4DC] shadow-luxury">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F2ECE1]">
            <div>
              <h3 className="font-serif text-lg font-medium text-charcoal-900">
                Course Financial Performance
              </h3>
              <p className="text-xs text-charcoal-500">
                Fee collections vs pending balances by curriculum track
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-champagne-600" />
                <span className="text-charcoal-600">Collected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#E4D7C5]" />
                <span className="text-charcoal-600">Outstanding</span>
              </div>
            </div>
          </div>

          <div className="h-72 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseRevenueData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
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
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val: number) => [formatINR(val), ""]}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#EAE4DC",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="Collected" fill="#C5A16F" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Outstanding" fill="#E4D7C5" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Channels Split (Pie Chart) */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE4DC] shadow-luxury flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-lg font-medium text-charcoal-900">
              Payment Channels
            </h3>
            <p className="text-xs text-charcoal-500">
              Distribution of incoming fee transactions
            </p>
          </div>

          <div className="h-52 my-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {paymentPieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [formatINR(val), "Volume"]}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#EAE4DC",
                    borderRadius: "10px",
                    fontSize: "11px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-[#F2ECE1]">
            {paymentPieData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                  />
                  <span className="text-charcoal-700">{item.name}</span>
                </div>
                <span className="font-mono font-medium text-charcoal-900">
                  {formatINR(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Admissions & Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Admissions */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE4DC] shadow-luxury">
          <div className="flex items-center justify-between pb-4 border-b border-[#F2ECE1]">
            <div>
              <h3 className="font-serif text-lg font-medium text-charcoal-900">
                Recent Admissions
              </h3>
              <p className="text-xs text-charcoal-500">Latest applicant inquiries and registrations</p>
            </div>
            <button
              onClick={() => setActiveAdminTab("admissions")}
              className="text-xs font-semibold text-champagne-700 hover:text-champagne-900 flex items-center gap-1 transition"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#F6F1EA] mt-2">
            {recentAdmissions.map((adm) => (
              <div key={adm.id} className="py-3.5 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-charcoal-900 truncate">
                      {adm.studentName}
                    </span>
                    <span className="font-mono text-[10px] text-charcoal-400">
                      {adm.applicationNumber}
                    </span>
                  </div>
                  <p className="text-charcoal-500 truncate text-[11px] mt-0.5">
                    {adm.courseName}
                  </p>
                </div>

                <div className="text-right shrink-0">
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
                  <div className="text-[10px] text-charcoal-400 mt-1">
                    {formatDate(adm.admissionDate || adm.createdDate)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE4DC] shadow-luxury">
          <div className="flex items-center justify-between pb-4 border-b border-[#F2ECE1]">
            <div>
              <h3 className="font-serif text-lg font-medium text-charcoal-900">
                Recent Bursar Receipts
              </h3>
              <p className="text-xs text-charcoal-500">Processed simulated student transactions</p>
            </div>
            <button
              onClick={() => setActiveAdminTab("fees")}
              className="text-xs font-semibold text-champagne-700 hover:text-champagne-900 flex items-center gap-1 transition"
            >
              <span>Fee Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#F6F1EA] mt-2">
            {recentPayments.map((pay) => (
              <div key={pay.id} className="py-3.5 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-charcoal-900 truncate">
                      {pay.studentName}
                    </span>
                    <button
                      onClick={() => openReceiptModal(pay)}
                      className="font-mono text-[10px] text-champagne-700 hover:underline inline-flex items-center gap-1"
                    >
                      <Receipt className="w-3 h-3" />
                      {pay.receiptNumber}
                    </button>
                  </div>
                  <p className="text-charcoal-500 text-[11px] mt-0.5">
                    {pay.method} • {formatDate(pay.date)}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono font-semibold text-charcoal-900 text-sm">
                    {formatINR(pay.amount)}
                  </span>
                  <div className="text-[10px] text-emerald-800 font-medium">
                    Verified
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cohort Occupancy Progress Cards */}
      <div className="bg-white p-6 rounded-2xl border border-[#EAE4DC] shadow-luxury">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F2ECE1]">
          <div>
            <h3 className="font-serif text-lg font-medium text-charcoal-900">
              Live Cohort Capacity & Occupancy
            </h3>
            <p className="text-xs text-charcoal-500">
              Active intake tracking against classroom seat limits
            </p>
          </div>
          <button
            onClick={() => setActiveAdminTab("batches")}
            className="text-xs font-semibold text-champagne-700 hover:text-champagne-900 flex items-center gap-1 transition"
          >
            <span>Manage All Batches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {batches.map((batch) => {
            const pct = Math.round((batch.enrolledCount / batch.maxCapacity) * 100);
            const isFull = batch.enrolledCount >= batch.maxCapacity;
            return (
              <div
                key={batch.id}
                className="p-4 rounded-xl border border-[#EBE4DC] bg-[#FCFAF7] hover:bg-white hover:border-champagne-400 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-charcoal-900 text-xs truncate">
                      {batch.name}
                    </h4>
                    <p className="text-[11px] text-charcoal-500 truncate mt-0.5">
                      Trainer: {batch.trainer}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                      isFull
                        ? "bg-rose-100 text-rose-800"
                        : batch.status === "In Progress"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {isFull ? "Full" : batch.status}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-[11px] text-charcoal-600 mb-1.5 font-medium">
                    <span>
                      Enrolled: {batch.enrolledCount} / {batch.maxCapacity} seats
                    </span>
                    <span className="font-mono">{pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#E9E1D6] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFull
                          ? "bg-rose-500"
                          : pct >= 80
                          ? "bg-amber-500"
                          : "bg-champagne-600"
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#F0EAE1] flex justify-between items-center text-[10px] text-charcoal-500">
                  <span>Starts: {formatDate(batch.startDate)}</span>
                  <span>{batch.locationRoom.split("—")[0]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
