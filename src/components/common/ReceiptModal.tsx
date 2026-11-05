"use client";

import React, { useRef } from "react";
import { useAcademy } from "@/lib/store";
import { formatINR, formatDate } from "@/lib/utils";
import { X, Printer, CheckCircle, ShieldCheck } from "lucide-react";

export function ReceiptModal() {
  const { selectedReceiptPayment, closeReceiptModal, settings, students } = useAcademy();
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!selectedReceiptPayment) return null;

  const payment = selectedReceiptPayment;
  const student = students.find((s) => s.id === payment.studentId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-luxury-lg border border-[#EAE4DC] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0EAE1] bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-champagne-600 animate-pulse" />
            <h3 className="text-xs font-semibold tracking-widest uppercase text-charcoal-800">
              Electronic Fee Receipt
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
              Demo Simulation
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-charcoal-900 text-ivory-50 rounded-lg hover:bg-charcoal-800 transition shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-champagne-400" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={closeReceiptModal}
              className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-800 hover:bg-[#F2ECE2] transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="p-6 md:p-8 overflow-y-auto bg-white flex-1 print:p-0 print:m-0" id="printable-receipt" ref={receiptRef}>
          <div className="border border-[#E7DFD4] rounded-xl p-6 md:p-8 bg-[#FCFAF7] relative shadow-inner">
            {/* Subtle Watermark Stamp */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
              <span className="font-serif text-8xl font-bold tracking-widest text-charcoal-950 uppercase -rotate-12">
                GOM ACADEMY
              </span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-[#EAE4DC] gap-4">
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase font-semibold text-champagne-700">
                  {settings.subtitle}
                </p>
                <h1 className="font-serif text-2xl md:text-3xl font-normal text-charcoal-900 tracking-tight mt-0.5">
                  {settings.academyName}
                </h1>
                <p className="text-xs text-charcoal-500 mt-1 max-w-sm">
                  {settings.address}
                </p>
                <p className="text-xs text-charcoal-500">
                  GSTIN: <span className="font-mono text-charcoal-700 font-medium">{settings.gstNumber}</span> • Email: {settings.contactEmail}
                </p>
              </div>

              <div className="text-left md:text-right bg-white/80 p-3 rounded-lg border border-[#EBE4DC]">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-charcoal-400">
                  Official Receipt
                </div>
                <div className="font-mono text-sm font-bold text-charcoal-900 mt-0.5">
                  {payment.receiptNumber}
                </div>
                <div className="text-xs text-charcoal-500 mt-1">
                  Date: <span className="text-charcoal-800 font-medium">{formatDate(payment.date)}</span>
                </div>
              </div>
            </div>

            {/* Student & Course Particulars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6 border-b border-[#EAE4DC] text-xs">
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-charcoal-400">
                  Billed To Student
                </p>
                <p className="text-sm font-semibold text-charcoal-900">{payment.studentName}</p>
                <p className="text-charcoal-600 font-mono">Student ID: {payment.studentId}</p>
                {student && (
                  <>
                    <p className="text-charcoal-600">Phone: {student.phone}</p>
                    <p className="text-charcoal-600">City: {student.city}</p>
                  </>
                )}
              </div>

              <div className="space-y-1.5 md:text-right">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-charcoal-400">
                  Program & Cohort
                </p>
                <p className="text-sm font-semibold text-charcoal-900">{payment.courseName}</p>
                {student && <p className="text-charcoal-600">Batch: {student.batchName}</p>}
                <p className="text-charcoal-600">
                  Payment Mode: <span className="font-medium text-charcoal-900">{payment.method}</span>
                </p>
                <p className="text-charcoal-500 font-mono text-[11px]">
                  Ref: {payment.transactionRef}
                </p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="py-6 border-b border-[#EAE4DC]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EAE4DC] text-[10px] uppercase font-semibold text-charcoal-500">
                    <th className="pb-2">Description</th>
                    <th className="pb-2 text-right">Fee Component</th>
                    <th className="pb-2 text-right">Amount Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EAE1]">
                  <tr>
                    <td className="py-3">
                      <div className="font-semibold text-charcoal-900">{payment.courseName}</div>
                      <div className="text-charcoal-500 text-[11px]">
                        Tuition, Practical Studio Lab Hours & Master Certification
                      </div>
                      {payment.notes && (
                        <div className="text-champagne-700 italic text-[11px] mt-0.5">
                          Note: {payment.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3 text-right text-charcoal-600">
                      {student ? formatINR(student.totalFee) : "—"}
                    </td>
                    <td className="py-3 text-right font-mono font-semibold text-charcoal-900 text-sm">
                      {formatINR(payment.amount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Calculations & Balance */}
            <div className="py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-medium">Status: {payment.status}</span>
              </div>

              <div className="w-full md:w-64 space-y-1.5 text-xs">
                <div className="flex justify-between text-charcoal-600">
                  <span>Current Installment:</span>
                  <span className="font-mono font-semibold text-charcoal-900">{formatINR(payment.amount)}</span>
                </div>
                <div className="flex justify-between text-charcoal-600">
                  <span>Outstanding Balance:</span>
                  <span className="font-mono font-semibold text-amber-900">
                    {formatINR(payment.balanceAfterPayment)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#EAE4DC] text-sm font-semibold text-charcoal-900">
                  <span>Total Amount Paid:</span>
                  <span className="font-mono text-champagne-700 text-base">{formatINR(payment.amount)}</span>
                </div>
              </div>
            </div>

            {/* Signatures & Seal */}
            <div className="pt-6 border-t border-[#EAE4DC] flex flex-col md:flex-row justify-between items-end gap-6 text-xs text-charcoal-500">
              <div className="max-w-xs text-[10px] leading-relaxed">
                <p className="font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                  Terms & Verification
                </p>
                <p>{settings.receiptNotes}</p>
                <div className="mt-2 flex items-center gap-1.5 text-amber-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Electronic Simulation Record</span>
                </div>
              </div>

              <div className="text-center md:text-right min-w-[160px]">
                <div className="h-10 flex items-center justify-end">
                  <span className="font-serif italic text-lg text-champagne-800">
                    The Game of Makeup
                  </span>
                </div>
                <div className="border-t border-[#DACFBF] pt-1 text-[11px] text-charcoal-600">
                  Authorized Signatory / Bursar
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#FAF8F5] border-t border-[#F0EAE1] flex justify-between items-center text-xs text-charcoal-500">
          <span>Official Academy Record</span>
          <button
            onClick={closeReceiptModal}
            className="px-4 py-1.5 rounded-lg border border-[#DACFBF] bg-white hover:bg-[#F2ECE2] text-charcoal-800 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
