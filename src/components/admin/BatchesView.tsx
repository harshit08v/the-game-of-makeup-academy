"use client";

import React, { useState } from "react";
import { useAcademy } from "@/lib/store";
import { Batch } from "@/types";
import { formatDate, formatINR } from "@/lib/utils";
import {
  CalendarDays,
  Users,
  Plus,
  Clock,
  MapPin,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export function BatchesView() {
  const { batches, courses, students, addBatch, updateBatch, deleteBatch, showToast } =
    useAcademy();

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [viewingBatch, setViewingBatch] = useState<Batch | null>(null);

  // New Batch Form State
  const [newBatchData, setNewBatchData] = useState({
    name: "",
    courseId: courses[0]?.id || "",
    trainer: "Natasha Poonawala",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    schedule: "Mon, Wed, Fri • 10:00 AM - 02:00 PM",
    maxCapacity: 12,
    status: "Upcoming" as "Upcoming" | "In Progress" | "Completed",
    locationRoom: "Studio Suite 1 — Bridal Wing",
  });

  const filteredBatches = batches.filter((b) => {
    if (statusFilter === "ALL") return true;
    return b.status === statusFilter;
  });

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchData.name.trim() || !newBatchData.trainer.trim()) {
      showToast("Validation Error", "Please provide a batch name and trainer.", "error");
      return;
    }

    const course = courses.find((c) => c.id === newBatchData.courseId);
    addBatch({
      name: newBatchData.name,
      courseId: newBatchData.courseId,
      courseName: course?.name || "Professional Makeup Course",
      trainer: newBatchData.trainer,
      startDate: newBatchData.startDate,
      endDate: newBatchData.endDate,
      schedule: newBatchData.schedule,
      maxCapacity: Number(newBatchData.maxCapacity),
      status: newBatchData.status,
      locationRoom: newBatchData.locationRoom,
    });

    setIsAddModalOpen(false);
    setNewBatchData({
      name: "",
      courseId: courses[0]?.id || "",
      trainer: "Natasha Poonawala",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      schedule: "Mon, Wed, Fri • 10:00 AM - 02:00 PM",
      maxCapacity: 12,
      status: "Upcoming",
      locationRoom: "Studio Suite 1 — Bridal Wing",
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch) return;
    updateBatch(editingBatch);
    setEditingBatch(null);
  };

  // Get enrolled students for viewing batch
  const enrolledStudentsInView = viewingBatch
    ? students.filter((s) => s.batchId === viewingBatch.id)
    : [];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE4DC] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-champagne-700 bg-champagne-50 px-2 py-0.5 rounded-full border border-champagne-200">
              Curriculum Logistics
            </span>
            <span className="text-xs text-charcoal-400">• Cohort Capacity Engine</span>
          </div>
          <h1 className="font-serif text-2xl font-medium text-charcoal-900 mt-1">
            Batch & Cohort Management
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Schedule studio cohorts, configure student capacity limits, and assign lead artistry trainers.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-charcoal-900 text-ivory-50 hover:bg-charcoal-800 transition shadow-sm self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5 text-champagne-400" />
          <span>Create New Cohort Batch</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EAE4DC] pb-3 text-xs font-medium text-charcoal-600">
        <button
          onClick={() => setStatusFilter("ALL")}
          className={`px-3 py-1.5 rounded-lg transition ${
            statusFilter === "ALL"
              ? "bg-charcoal-900 text-ivory-50 font-semibold"
              : "hover:bg-[#F2ECE0] text-charcoal-700"
          }`}
        >
          All Batches ({batches.length})
        </button>
        <button
          onClick={() => setStatusFilter("In Progress")}
          className={`px-3 py-1.5 rounded-lg transition ${
            statusFilter === "In Progress"
              ? "bg-charcoal-900 text-ivory-50 font-semibold"
              : "hover:bg-[#F2ECE0] text-charcoal-700"
          }`}
        >
          In Progress ({batches.filter((b) => b.status === "In Progress").length})
        </button>
        <button
          onClick={() => setStatusFilter("Upcoming")}
          className={`px-3 py-1.5 rounded-lg transition ${
            statusFilter === "Upcoming"
              ? "bg-charcoal-900 text-ivory-50 font-semibold"
              : "hover:bg-[#F2ECE0] text-charcoal-700"
          }`}
        >
          Upcoming ({batches.filter((b) => b.status === "Upcoming").length})
        </button>
        <button
          onClick={() => setStatusFilter("Completed")}
          className={`px-3 py-1.5 rounded-lg transition ${
            statusFilter === "Completed"
              ? "bg-charcoal-900 text-ivory-50 font-semibold"
              : "hover:bg-[#F2ECE0] text-charcoal-700"
          }`}
        >
          Completed ({batches.filter((b) => b.status === "Completed").length})
        </button>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBatches.map((batch) => {
          const pct = Math.round((batch.enrolledCount / batch.maxCapacity) * 100);
          const isFull = batch.enrolledCount >= batch.maxCapacity;

          return (
            <div
              key={batch.id}
              className="bg-white rounded-2xl border border-[#EAE4DC] shadow-luxury p-5 flex flex-col justify-between hover:border-champagne-400 transition group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#F2ECE1]">
                  <div>
                    <span className="font-mono text-[10px] text-charcoal-400 uppercase tracking-wider font-semibold">
                      {batch.id}
                    </span>
                    <h3 className="font-serif text-base font-semibold text-charcoal-900 mt-0.5 line-clamp-1">
                      {batch.name}
                    </h3>
                    <p className="text-xs text-champagne-800 font-medium mt-0.5">
                      {batch.courseName}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold shrink-0 border ${
                      isFull
                        ? "bg-rose-50 text-rose-800 border-rose-200"
                        : batch.status === "In Progress"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : batch.status === "Upcoming"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-charcoal-100 text-charcoal-700 border-charcoal-200"
                    }`}
                  >
                    {isFull ? "FULL CAPACITY" : batch.status}
                  </span>
                </div>

                {/* Details */}
                <div className="py-4 space-y-2 text-xs text-charcoal-600">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-champagne-600 shrink-0" />
                    <span>
                      Lead Trainer: <strong className="text-charcoal-900">{batch.trainer}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
                    <span className="truncate">{batch.schedule}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
                    <span className="truncate">{batch.locationRoom}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-charcoal-500 pt-1">
                    <CalendarDays className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
                    <span>
                      {formatDate(batch.startDate)} → {formatDate(batch.endDate)}
                    </span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="pt-2 pb-3">
                  <div className="flex justify-between text-xs text-charcoal-700 font-medium mb-1">
                    <span>
                      Enrolled: <strong>{batch.enrolledCount}</strong> of {batch.maxCapacity} Seats
                    </span>
                    <span className="font-mono text-xs">{pct}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#F0EAE1] rounded-full overflow-hidden">
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
                  {isFull && (
                    <p className="text-[10px] text-rose-700 font-medium mt-1">
                      Batch full. Enrolling requires expanding max capacity.
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-between text-xs">
                <button
                  onClick={() => setViewingBatch(batch)}
                  className="font-semibold text-champagne-700 hover:text-champagne-900 flex items-center gap-1 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Roster ({batch.enrolledCount})</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingBatch(batch)}
                    className="p-1.5 rounded-lg text-charcoal-500 hover:text-charcoal-900 hover:bg-[#F2ECE1]"
                    title="Edit Batch"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteBatch(batch.id)}
                    className="p-1.5 rounded-lg text-charcoal-400 hover:text-rose-700 hover:bg-rose-50"
                    title="Delete Batch"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- MODAL 1: CREATE NEW BATCH --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-luxury-lg border border-[#EAE4DC] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
              <h3 className="font-serif text-lg font-medium text-charcoal-900">
                Create Studio Cohort Batch
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Batch Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. May Bridal Masterclass — Cohort Gamma"
                  value={newBatchData.name}
                  onChange={(e) => setNewBatchData({ ...newBatchData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Course *</label>
                <select
                  value={newBatchData.courseId}
                  onChange={(e) => setNewBatchData({ ...newBatchData, courseId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#DACFBF] bg-white"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.duration})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Lead Trainer *</label>
                  <input
                    type="text"
                    required
                    value={newBatchData.trainer}
                    onChange={(e) => setNewBatchData({ ...newBatchData, trainer: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">
                    Maximum Capacity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={newBatchData.maxCapacity}
                    onChange={(e) =>
                      setNewBatchData({ ...newBatchData, maxCapacity: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newBatchData.startDate}
                    onChange={(e) =>
                      setNewBatchData({ ...newBatchData, startDate: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={newBatchData.endDate}
                    onChange={(e) => setNewBatchData({ ...newBatchData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Class Schedule</label>
                <input
                  type="text"
                  placeholder="e.g. Mon, Wed, Fri • 10:00 AM - 02:00 PM"
                  value={newBatchData.schedule}
                  onChange={(e) => setNewBatchData({ ...newBatchData, schedule: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Studio Room</label>
                  <input
                    type="text"
                    value={newBatchData.locationRoom}
                    onChange={(e) =>
                      setNewBatchData({ ...newBatchData, locationRoom: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Status</label>
                  <select
                    value={newBatchData.status}
                    onChange={(e) =>
                      setNewBatchData({
                        ...newBatchData,
                        status: e.target.value as "Upcoming" | "In Progress" | "Completed",
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#DACFBF] bg-white"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0EAE1] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-charcoal-600 hover:bg-[#F2ECE0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold bg-charcoal-900 text-ivory-50 rounded-lg hover:bg-charcoal-800 transition"
                >
                  Publish Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: EDIT BATCH --- */}
      {editingBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-luxury-lg border border-[#EAE4DC] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
              <h3 className="font-serif text-lg font-medium text-charcoal-900">
                Edit Batch — {editingBatch.id}
              </h3>
              <button
                onClick={() => setEditingBatch(null)}
                className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Batch Name</label>
                <input
                  type="text"
                  required
                  value={editingBatch.name}
                  onChange={(e) => setEditingBatch({ ...editingBatch, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Trainer</label>
                  <input
                    type="text"
                    required
                    value={editingBatch.trainer}
                    onChange={(e) => setEditingBatch({ ...editingBatch, trainer: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Max Capacity</label>
                  <input
                    type="number"
                    min={editingBatch.enrolledCount}
                    required
                    value={editingBatch.maxCapacity}
                    onChange={(e) =>
                      setEditingBatch({ ...editingBatch, maxCapacity: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Schedule</label>
                <input
                  type="text"
                  value={editingBatch.schedule}
                  onChange={(e) => setEditingBatch({ ...editingBatch, schedule: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Status</label>
                  <select
                    value={editingBatch.status}
                    onChange={(e) =>
                      setEditingBatch({
                        ...editingBatch,
                        status: e.target.value as "Upcoming" | "In Progress" | "Completed",
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#DACFBF] bg-white"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Studio Room</label>
                  <input
                    type="text"
                    value={editingBatch.locationRoom}
                    onChange={(e) =>
                      setEditingBatch({ ...editingBatch, locationRoom: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0EAE1] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingBatch(null)}
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

      {/* --- MODAL 3: VIEW BATCH ROSTER --- */}
      {viewingBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-luxury-lg border border-[#EAE4DC] p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
              <div>
                <h3 className="font-serif text-lg font-medium text-charcoal-900">
                  {viewingBatch.name}
                </h3>
                <p className="text-xs text-charcoal-500">
                  Trainer: {viewingBatch.trainer} • {viewingBatch.enrolledCount}/{viewingBatch.maxCapacity} Enrolled
                </p>
              </div>
              <button
                onClick={() => setViewingBatch(null)}
                className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 text-xs">
              <h4 className="font-semibold text-charcoal-800 mb-2">Enrolled Student Roster</h4>
              {enrolledStudentsInView.length === 0 ? (
                <p className="text-charcoal-400 italic py-6 text-center">
                  No students currently enrolled in this cohort.
                </p>
              ) : (
                <div className="divide-y divide-[#F0EAE1] border border-[#EAE4DC] rounded-xl overflow-hidden bg-white">
                  {enrolledStudentsInView.map((stu) => (
                    <div key={stu.id} className="p-3 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-charcoal-900">{stu.fullName}</div>
                        <div className="text-[10px] text-charcoal-500 font-mono mt-0.5">
                          {stu.id} • {stu.phone}
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                            stu.feeStatus === "Paid"
                              ? "bg-emerald-50 text-emerald-800"
                              : "bg-amber-50 text-amber-800"
                          }`}
                        >
                          {stu.feeStatus}
                        </span>
                        <div className="text-[10px] text-charcoal-400 mt-0.5">
                          Paid: {formatINR(stu.paidAmount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#F0EAE1] flex justify-end">
              <button
                onClick={() => setViewingBatch(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-charcoal-900 text-ivory-50 rounded-lg hover:bg-charcoal-800"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
