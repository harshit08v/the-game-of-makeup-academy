"use client";

import React, { useState } from "react";
import { useAcademy } from "@/lib/store";
import { formatINR, formatDate } from "@/lib/utils";
import { PaymentMethod } from "@/types";
import {
  Receipt,
  Printer,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Clock,
  Sparkles,
} from "lucide-react";

export function StudentFeesView() {
  const { students, selectedStudentId, payments, openReceiptModal, recordPayment, showToast } =
    useAcademy();

  const student = students.find((s) => s.id === selectedStudentId) || students[0];
  const studentPayments = payments.filter((p) => p.studentId === student?.id);

  const [isSimPayModalOpen, setIsSimPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState(25000);
  const [payMethod, setPayMethod] = useState<PaymentMethod>("UPI");

  if (!student) {
    return (
      <div className="p-8 text-center text-charcoal-400">
        Student profile not found.
      </div>
    );
  }

  const outstanding = Math.max(0, student.totalFee - student.paidAmount);
  const feePct = Math.round((student.paidAmount / student.totalFee) * 100);

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) {
      showToast("Invalid Amount", "Payment amount must be greater than zero.", "error");
      return;
    }

    const newPayment = recordPayment({
      studentId: student.id,
      amount: Number(payAmount),
      method: payMethod,
      transactionRef: `STUDENT/PORTAL/${payMethod.toUpperCase()}/${Date.now().toString().slice(-6)}`,
      notes: "Online installment simulated via student portal.",
    });

    if (newPayment) {
      setIsSimPayModalOpen(false);
      openReceiptModal(newPayment);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE4DC] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-champagne-700 bg-champagne-50 px-2 py-0.5 rounded-full border border-champagne-200">
              Student Bursar Statement
            </span>
            <span className="text-xs text-charcoal-400">• Official Ledger</span>
          </div>
          <h1 className="font-serif text-2xl font-medium text-charcoal-900 mt-1">
            My Fees & Electronic Receipts
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            View course tuition commitments, installment history, and download tax-compliant payment receipts.
          </p>
        </div>

        {outstanding > 0 && (
          <button
            onClick={() => {
              setPayAmount(Math.min(outstanding, 25000));
              setIsSimPayModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-charcoal-900 text-ivory-50 hover:bg-charcoal-800 transition shadow-sm self-start md:self-auto"
          >
            <CreditCard className="w-3.5 h-3.5 text-champagne-400" />
            <span>Pay Installment (Simulate)</span>
          </button>
        )}
      </div>

      {/* Simulation Notice */}
      <div className="bg-[#FAF6EE] border border-[#E8DEC0] rounded-xl p-3.5 flex items-center gap-2.5 text-xs text-amber-950">
        <ShieldCheck className="w-4 h-4 text-champagne-700 shrink-0" />
        <span>
          <strong>Simulated Fee Module:</strong> Payments made here are safe sandbox demonstrations. All electronic receipts are generated in real-time and formatted for printing.
        </span>
      </div>

      {/* 3 Fee Summary Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#EAE4DC] shadow-luxury">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-500">
            Total Program Tuition
          </span>
          <div className="text-2xl font-serif font-bold text-charcoal-900 mt-2">
            {formatINR(student.totalFee)}
          </div>
          <p className="text-xs text-charcoal-500 mt-1">{student.courseName}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EAE4DC] shadow-luxury">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-800">
            Total Amount Settled
          </span>
          <div className="text-2xl font-serif font-bold text-emerald-900 mt-2">
            {formatINR(student.paidAmount)}
          </div>
          <p className="text-xs text-emerald-700 font-medium mt-1">
            {feePct}% of total course fees cleared
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EAE4DC] shadow-luxury">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-rose-800">
            Current Outstanding Balance
          </span>
          <div className="text-2xl font-serif font-bold text-rose-950 mt-2">
            {formatINR(outstanding)}
          </div>
          <p className="text-xs text-rose-700 font-medium mt-1">
            {outstanding === 0 ? "All fees fully settled" : "Due prior to final certification"}
          </p>
        </div>
      </div>

      {/* Payment History List */}
      <div className="bg-white rounded-2xl border border-[#EAE4DC] shadow-luxury overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F0EAE1] bg-[#FAF8F5] flex items-center justify-between">
          <div>
            <h3 className="font-serif text-base font-semibold text-charcoal-900">
              Payment Receipts Ledger
            </h3>
            <p className="text-xs text-charcoal-500">
              Chronological log of verified tuition installments
            </p>
          </div>
          <span className="text-xs text-charcoal-500">
            {studentPayments.length} Total Receipts
          </span>
        </div>

        {studentPayments.length === 0 ? (
          <div className="p-8 text-center text-charcoal-400">
            No payments recorded yet for your account.
          </div>
        ) : (
          <div className="divide-y divide-[#F0EAE1]">
            {studentPayments.map((p) => (
              <div
                key={p.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FCFAF7] transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-charcoal-900">
                      {p.receiptNumber}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                      Verified
                    </span>
                  </div>
                  <div className="text-xs text-charcoal-600">
                    Paid on <strong className="text-charcoal-900">{formatDate(p.date)}</strong> via {p.method}
                  </div>
                  <div className="font-mono text-[10px] text-charcoal-400">
                    Ref: {p.transactionRef}
                  </div>
                  {p.notes && (
                    <div className="text-xs text-champagne-800 italic mt-1">Note: {p.notes}</div>
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-semibold text-charcoal-400 block">
                      Amount Paid
                    </span>
                    <span className="font-mono text-lg font-bold text-charcoal-900">
                      {formatINR(p.amount)}
                    </span>
                  </div>

                  <button
                    onClick={() => openReceiptModal(p)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#FAF5EE] text-champagne-900 hover:bg-[#F2E7D5] border border-[#E3D4C1] transition shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5 text-champagne-700" />
                    <span>View / Print</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- MODAL: SIMULATE PAYMENT --- */}
      {isSimPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-luxury-lg border border-[#EAE4DC] p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
              <div>
                <h3 className="font-serif text-lg font-medium text-charcoal-900">
                  Simulate Fee Installment
                </h3>
                <p className="text-xs text-charcoal-500">
                  Select payment instrument to clear pending balance
                </p>
              </div>
              <button
                onClick={() => setIsSimPayModalOpen(false)}
                className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSimulatePayment} className="space-y-4">
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EBE4DC] flex justify-between items-center">
                <span className="text-charcoal-600">Current Outstanding Balance:</span>
                <span className="font-mono font-bold text-amber-900 text-sm">
                  {formatINR(outstanding)}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">
                  Payment Amount (₹) *
                </label>
                <input
                  type="number"
                  min="1"
                  max={outstanding}
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-[#DACFBF] font-mono text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">
                  Select Simulated Payment Method
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 rounded-lg border border-[#DACFBF] bg-white"
                >
                  <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="Bank Transfer">Net Banking / NEFT</option>
                  <option value="Credit/Debit Card">Credit / Debit Card</option>
                  <option value="Cash">Cash at Campus Desk</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#F0EAE1] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsSimPayModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-charcoal-600 hover:bg-[#F2ECE0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold bg-charcoal-900 text-ivory-50 rounded-lg hover:bg-charcoal-800 transition"
                >
                  Confirm Simulated Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
