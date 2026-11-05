"use client";

import React, { useState, useMemo } from "react";
import { useAcademy } from "@/lib/store";
import { PaymentMethod } from "@/types";
import { formatINR, formatDate, exportToCSV } from "@/lib/utils";
import {
  CreditCard,
  TrendingUp,
  AlertCircle,
  Clock,
  Plus,
  Receipt,
  Search,
  Filter,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  X,
  Info,
} from "lucide-react";

export function FeesView() {
  const {
    students,
    payments,
    recordPayment,
    openReceiptModal,
    showToast,
  } = useAcademy();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [activeLedgerTab, setActiveLedgerTab] = useState<"transactions" | "students">("transactions");

  // Record Payment Modal State
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || "");
  const [paymentAmount, setPaymentAmount] = useState(25000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [transactionRef, setTransactionRef] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");

  // Summary Metrics calculated dynamically
  const totalBilled = students.reduce((sum, s) => sum + s.totalFee, 0);
  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = Math.max(0, totalBilled - totalCollected);
  const overdueAmount = students
    .filter((s) => s.feeStatus === "Overdue")
    .reduce((sum, s) => sum + Math.max(0, s.totalFee - s.paidAmount), 0);

  // Selected student for quick form reference
  const currentStudent = students.find((s) => s.id === selectedStudentId);
  const currentOutstanding = currentStudent
    ? Math.max(0, currentStudent.totalFee - currentStudent.paidAmount)
    : 0;

  // Filtered Payments List
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        p.studentName.toLowerCase().includes(q) ||
        p.receiptNumber.toLowerCase().includes(q) ||
        p.transactionRef.toLowerCase().includes(q) ||
        p.courseName.toLowerCase().includes(q);

      const matchesMethod = methodFilter === "ALL" || p.method === methodFilter;

      return matchesSearch && matchesMethod;
    });
  }, [payments, searchQuery, methodFilter]);

  // Handle Record Payment Submit
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      showToast("Select Student", "Please select a student to record fee against.", "error");
      return;
    }

    if (paymentAmount <= 0) {
      showToast("Invalid Amount", "Fee amount must be greater than zero.", "error");
      return;
    }

    const newPayment = recordPayment({
      studentId: selectedStudentId,
      amount: Number(paymentAmount),
      method: paymentMethod,
      transactionRef: transactionRef.trim() || `REF/${paymentMethod.toUpperCase()}/${Date.now().toString().slice(-6)}`,
      notes: paymentNotes,
    });

    if (newPayment) {
      setIsRecordModalOpen(false);
      setPaymentNotes("");
      setTransactionRef("");
      // Open the generated receipt right away!
      openReceiptModal(newPayment);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Receipt No",
      "Date",
      "Student ID",
      "Student Name",
      "Course",
      "Amount Paid",
      "Payment Method",
      "Transaction Ref",
      "Remaining Balance",
      "Status",
    ];
    const rows = filteredPayments.map((p) => [
      p.receiptNumber,
      p.date,
      p.studentId,
      p.studentName,
      p.courseName,
      p.amount,
      p.method,
      p.transactionRef,
      p.balanceAfterPayment,
      p.status,
    ]);
    exportToCSV("Bursar_Fee_Ledger", headers, rows);
    showToast("CSV Exported", "Bursar fee transactions downloaded.", "info");
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE4DC] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-champagne-700 bg-champagne-50 px-2 py-0.5 rounded-full border border-champagne-200">
              Bursar & Accounts
            </span>
            <span className="text-xs text-charcoal-400">• Financial Year 2024-25</span>
          </div>
          <h1 className="font-serif text-2xl font-medium text-charcoal-900 mt-1">
            Fees & Payment Management
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Record fee installments, monitor student debt aging, and generate official electronic receipts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-white border border-[#DCD3C7] text-charcoal-700 hover:bg-[#FAF6F0] transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-charcoal-500" />
            <span>Export Ledger (CSV)</span>
          </button>
          <button
            onClick={() => {
              if (currentOutstanding > 0) {
                setPaymentAmount(Math.min(currentOutstanding, 25000));
              }
              setIsRecordModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-charcoal-900 text-ivory-50 hover:bg-charcoal-800 transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-champagne-400" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Simulation Notice Banner */}
      <div className="bg-[#FAF6EE] border border-[#E8DEC0] rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs text-amber-950">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-champagne-700 shrink-0" />
          <span>
            <strong className="font-semibold">Simulated Financial Environment:</strong> All receipts and ledger items are local mock records for demonstration purposes. No real bank gateway is invoked.
          </span>
        </div>
      </div>

      {/* 4 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Course Fees Billed */}
        <div className="bg-white p-5 rounded-xl border border-[#EAE4DC] shadow-luxury">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-500">
            Total Billed Fees
          </span>
          <div className="text-2xl font-serif font-bold text-charcoal-900 mt-2">
            {formatINR(totalBilled)}
          </div>
          <p className="text-[11px] text-charcoal-500 mt-1">
            Across {students.length} enrolled students
          </p>
        </div>

        {/* Fees Collected */}
        <div className="bg-white p-5 rounded-xl border border-[#EAE4DC] shadow-luxury">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-800">
            Total Fees Collected
          </span>
          <div className="text-2xl font-serif font-bold text-emerald-900 mt-2">
            {formatINR(totalCollected)}
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            {totalBilled > 0 ? `${Math.round((totalCollected / totalBilled) * 100)}% realization rate` : ""}
          </p>
        </div>

        {/* Pending Amount */}
        <div className="bg-white p-5 rounded-xl border border-[#EAE4DC] shadow-luxury">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-800">
            Pending / Installments
          </span>
          <div className="text-2xl font-serif font-bold text-amber-900 mt-2">
            {formatINR(pendingAmount)}
          </div>
          <p className="text-[11px] text-amber-700 font-medium mt-1">
            Scheduled upcoming balance
          </p>
        </div>

        {/* Overdue Amount */}
        <div className="bg-white p-5 rounded-xl border border-[#EAE4DC] shadow-luxury">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-rose-800">
            Overdue Balance
          </span>
          <div className="text-2xl font-serif font-bold text-rose-950 mt-2">
            {formatINR(overdueAmount)}
          </div>
          <p className="text-[11px] text-rose-700 font-medium mt-1">
            Critical follow-up required
          </p>
        </div>
      </div>

      {/* View Switcher: Transactions List vs Student Balances */}
      <div className="flex border-b border-[#EAE4DC] gap-6 text-xs font-semibold text-charcoal-500">
        <button
          onClick={() => setActiveLedgerTab("transactions")}
          className={`pb-3 border-b-2 transition ${
            activeLedgerTab === "transactions"
              ? "border-charcoal-900 text-charcoal-900"
              : "border-transparent hover:text-charcoal-900"
          }`}
        >
          Payment Transactions Ledger ({payments.length})
        </button>
        <button
          onClick={() => setActiveLedgerTab("students")}
          className={`pb-3 border-b-2 transition ${
            activeLedgerTab === "students"
              ? "border-charcoal-900 text-charcoal-900"
              : "border-transparent hover:text-charcoal-900"
          }`}
        >
          Student Fee Statuses & Dues ({students.length})
        </button>
      </div>

      {activeLedgerTab === "transactions" ? (
        <>
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-[#EAE4DC] shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
              <input
                type="text"
                placeholder="Search receipt #, student name, or ref..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#DACFBF] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-champagne-600 transition placeholder:text-charcoal-400"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-charcoal-600 w-full md:w-auto">
              <span className="text-[11px] font-medium">Payment Mode:</span>
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-[#DACFBF] bg-[#FAF8F5] text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-champagne-600"
              >
                <option value="ALL">All Modes</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                <option value="Credit/Debit Card">Credit/Debit Card</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-xl border border-[#EAE4DC] shadow-luxury overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#EAE4DC] text-[10px] uppercase font-semibold text-charcoal-500 tracking-wider">
                    <th className="py-3 px-4">Receipt & Date</th>
                    <th className="py-3 px-4">Student & Course</th>
                    <th className="py-3 px-4">Instrument & Ref</th>
                    <th className="py-3 px-4 text-right">Amount Received</th>
                    <th className="py-3 px-4 text-right">Remaining Balance</th>
                    <th className="py-3 px-4 text-center">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE1]">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-charcoal-400">
                        No transactions found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FCFAF7] transition group">
                        {/* Receipt No */}
                        <td className="py-3.5 px-4 font-mono">
                          <button
                            onClick={() => openReceiptModal(p)}
                            className="font-bold text-charcoal-900 hover:text-champagne-700 hover:underline inline-flex items-center gap-1.5"
                          >
                            <Receipt className="w-3.5 h-3.5 text-champagne-600" />
                            <span>{p.receiptNumber}</span>
                          </button>
                          <div className="text-[10px] text-charcoal-400 mt-0.5">
                            {formatDate(p.date)}
                          </div>
                        </td>

                        {/* Student */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-charcoal-900">{p.studentName}</div>
                          <div className="text-[11px] text-charcoal-500 mt-0.5">{p.courseName}</div>
                        </td>

                        {/* Mode & Ref */}
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-charcoal-800">{p.method}</span>
                          <div className="font-mono text-[10px] text-charcoal-400 mt-0.5 truncate max-w-[170px]">
                            {p.transactionRef}
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-charcoal-900 text-sm">
                          {formatINR(p.amount)}
                        </td>

                        {/* Balance */}
                        <td className="py-3.5 px-4 text-right font-mono text-charcoal-600">
                          {formatINR(p.balanceAfterPayment)}
                        </td>

                        {/* Print Receipt */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => openReceiptModal(p)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg bg-[#FAF5EE] text-champagne-800 hover:bg-[#F2E7D5] border border-[#E3D4C1] transition"
                            title="Generate and Print Receipt"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Receipt</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Student Balances View */
        <div className="bg-white rounded-xl border border-[#EAE4DC] shadow-luxury overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#EAE4DC] text-[10px] uppercase font-semibold text-charcoal-500 tracking-wider">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Course Track</th>
                  <th className="py-3 px-4 text-right">Total Tuition</th>
                  <th className="py-3 px-4 text-right">Amount Paid</th>
                  <th className="py-3 px-4 text-right">Outstanding Dues</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE1]">
                {students.map((stu) => {
                  const balance = Math.max(0, stu.totalFee - stu.paidAmount);
                  return (
                    <tr key={stu.id} className="hover:bg-[#FCFAF7] transition">
                      <td className="py-3.5 px-4 font-semibold text-charcoal-900">
                        {stu.fullName}
                        <div className="font-mono text-[10px] text-charcoal-400 font-normal">
                          {stu.id}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-charcoal-700">{stu.courseName}</td>

                      <td className="py-3.5 px-4 text-right font-mono text-charcoal-600">
                        {formatINR(stu.totalFee)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-emerald-800">
                        {formatINR(stu.paidAmount)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-charcoal-900">
                        {formatINR(balance)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            stu.feeStatus === "Paid"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : stu.feeStatus === "Partial"
                              ? "bg-amber-50 text-amber-900 border border-amber-200"
                              : "bg-rose-50 text-rose-800 border border-rose-200"
                          }`}
                        >
                          {stu.feeStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {balance > 0 ? (
                          <button
                            onClick={() => {
                              setSelectedStudentId(stu.id);
                              setPaymentAmount(Math.min(balance, 25000));
                              setIsRecordModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-champagne-600 text-white rounded-lg hover:bg-champagne-700 transition"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>Collect Fee</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-medium">
                            Settled In Full
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- MODAL: RECORD PAYMENT --- */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-luxury-lg border border-[#EAE4DC] overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
              <div>
                <h3 className="font-serif text-lg font-medium text-charcoal-900">
                  Record Student Fee Payment
                </h3>
                <p className="text-xs text-charcoal-500">
                  Process an installment and generate an official bursar receipt
                </p>
              </div>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              {/* Select Student */}
              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">
                  Select Enrolled Student *
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => {
                    const sid = e.target.value;
                    setSelectedStudentId(sid);
                    const stu = students.find((s) => s.id === sid);
                    if (stu) {
                      const bal = Math.max(0, stu.totalFee - stu.paidAmount);
                      setPaymentAmount(Math.min(bal, 25000));
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-[#DACFBF] bg-white focus:outline-none focus:ring-1 focus:ring-champagne-600"
                >
                  {students.map((stu) => {
                    const bal = Math.max(0, stu.totalFee - stu.paidAmount);
                    return (
                      <option key={stu.id} value={stu.id}>
                        {stu.fullName} ({stu.id}) — Outstanding: {formatINR(bal)}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Outstanding Balance Banner */}
              {currentStudent && (
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EBE4DC] flex justify-between items-center">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-charcoal-400">
                      Total Course Tuition
                    </span>
                    <p className="font-mono font-medium text-charcoal-800">
                      {formatINR(currentStudent.totalFee)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-charcoal-400">
                      Already Paid
                    </span>
                    <p className="font-mono font-semibold text-emerald-800">
                      {formatINR(currentStudent.paidAmount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-semibold text-charcoal-400">
                      Remaining Balance
                    </span>
                    <p className="font-mono font-bold text-amber-900">
                      {formatINR(currentOutstanding)}
                    </p>
                  </div>
                </div>
              )}

              {/* Amount to Record */}
              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">
                  Installment Amount to Receive (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={currentOutstanding || 999999}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-[#DACFBF] font-mono text-sm focus:outline-none focus:ring-1 focus:ring-champagne-600"
                />
              </div>

              {/* Payment Method & Ref */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DACFBF] bg-white"
                  >
                    <option value="UPI">UPI / QR Code</option>
                    <option value="Bank Transfer">NEFT / RTGS Transfer</option>
                    <option value="Credit/Debit Card">Credit / Debit Card</option>
                    <option value="Cash">Cash at Counter</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">
                    Bank / Transaction Ref (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UPI/2025/11902"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Receipt Notes</label>
                <input
                  type="text"
                  placeholder="e.g. 2nd installment for bridal masterclass vanity kit."
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                />
              </div>

              <div className="pt-3 border-t border-[#F0EAE1] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg text-charcoal-600 hover:bg-[#F2ECE0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold bg-charcoal-900 text-ivory-50 rounded-lg hover:bg-charcoal-800 transition shadow-sm"
                >
                  Generate Receipt & Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
