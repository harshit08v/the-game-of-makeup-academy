"use client";

import React, { useState } from "react";
import { useAcademy } from "@/lib/store";
import {
  Settings,
  Building2,
  Receipt,
  RotateCcw,
  Save,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

export function SettingsView() {
  const { settings, updateSettings, resetToDefaults, showToast } = useAcademy();

  const [formData, setFormData] = useState({ ...settings });
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const handleDownloadBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      settings: formData,
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `THE_GAME_OF_MAKEUP_SETTINGS_BACKUP_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Backup Saved", "Academy configuration exported to JSON.", "info");
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE4DC] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-champagne-700 bg-champagne-50 px-2 py-0.5 rounded-full border border-champagne-200">
              System Configuration
            </span>
            <span className="text-xs text-charcoal-400">• Institutional Parameters</span>
          </div>
          <h1 className="font-serif text-2xl font-medium text-charcoal-900 mt-1">
            Academy Settings & Billing Config
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Manage branding, campus coordinates, electronic receipt templates, and demo storage state.
          </p>
        </div>

        <button
          onClick={handleDownloadBackup}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-white border border-[#DCD3C7] text-charcoal-700 hover:bg-[#FAF6F0] transition shadow-sm self-start md:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-charcoal-500" />
          <span>Export Config JSON</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Academy Identity Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE4DC] shadow-luxury space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F2ECE1]">
            <Building2 className="w-4 h-4 text-champagne-700" />
            <h3 className="font-serif text-base font-semibold text-charcoal-900">
              Academy Branding & Contact Dossier
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-charcoal-700 mb-1">
                Institutional Brand Name
              </label>
              <input
                type="text"
                required
                value={formData.academyName}
                onChange={(e) => setFormData({ ...formData, academyName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#DACFBF] font-serif"
              />
            </div>
            <div>
              <label className="block font-semibold text-charcoal-700 mb-1">System Subtitle</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
              />
            </div>
            <div>
              <label className="block font-semibold text-charcoal-700 mb-1">
                Registrar Email
              </label>
              <input
                type="email"
                required
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
              />
            </div>
            <div>
              <label className="block font-semibold text-charcoal-700 mb-1">
                Campus Telephone
              </label>
              <input
                type="tel"
                required
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-semibold text-charcoal-700 mb-1">
                Campus Physical Address (Printed on Receipts)
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
              />
            </div>
          </div>
        </div>

        {/* Financial & Receipt Configuration */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE4DC] shadow-luxury space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F2ECE1]">
            <Receipt className="w-4 h-4 text-champagne-700" />
            <h3 className="font-serif text-base font-semibold text-charcoal-900">
              Fiscal, GST & Electronic Receipt Parameters
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-charcoal-700 mb-1">
                GSTIN / Tax Identification
              </label>
              <input
                type="text"
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#DACFBF] font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-charcoal-700 mb-1">
                Receipt Number Sequence Prefix
              </label>
              <input
                type="text"
                value={formData.receiptPrefix}
                onChange={(e) => setFormData({ ...formData, receiptPrefix: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#DACFBF] font-mono"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-semibold text-charcoal-700 mb-1">
                Official Bursar Receipt Notes & Disclaimer
              </label>
              <textarea
                rows={3}
                value={formData.receiptNotes}
                onChange={(e) => setFormData({ ...formData, receiptNotes: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg bg-charcoal-900 text-ivory-50 hover:bg-charcoal-800 transition shadow-sm"
          >
            <Save className="w-4 h-4 text-champagne-400" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      {/* Danger Zone / Demo Data Reset */}
      <div className="bg-[#FAF5EE] p-6 rounded-2xl border border-[#E4D6C3] space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E7DFD4]">
          <ShieldAlert className="w-5 h-5 text-amber-700" />
          <div>
            <h3 className="font-serif text-base font-semibold text-charcoal-900">
              Demo Environment Diagnostics & Reset
            </h3>
            <p className="text-xs text-charcoal-600">
              Manage client demonstration state and restore default fictional academy database.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <p className="text-xs font-semibold text-charcoal-900">Restore Factory Demo Seed Data</p>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Erases local modifications and resets students, batches, courses and bursar receipts.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-[#D5C6B1] text-charcoal-800 hover:bg-rose-50 hover:text-rose-800 hover:border-rose-300 transition shadow-sm self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5 text-charcoal-500" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {showResetConfirm && (
          <div className="p-4 bg-white rounded-xl border border-rose-300 space-y-3 animate-fadeIn text-xs">
            <p className="font-semibold text-rose-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Confirm Data Reset?</span>
            </p>
            <p className="text-charcoal-600 leading-relaxed">
              Are you sure? This will reload the default set of 12 fictional students, active cohorts, and simulated bursar payments.
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-charcoal-600 hover:bg-[#F2ECE0] rounded-md transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetToDefaults();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-1.5 font-semibold bg-rose-700 text-white rounded-md hover:bg-rose-800 transition shadow-sm"
              >
                Yes, Restore Demo Seeds
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
