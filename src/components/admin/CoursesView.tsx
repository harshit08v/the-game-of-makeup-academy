"use client";

import React, { useState } from "react";
import { useAcademy } from "@/lib/store";
import { Course } from "@/types";
import { formatINR } from "@/lib/utils";
import {
  BookOpen,
  Plus,
  Clock,
  CheckCircle,
  Package,
  Award,
  Edit2,
  Trash2,
  X,
  Sparkles,
  Layers,
} from "lucide-react";

export function CoursesView() {
  const { courses, batches, addCourse, updateCourse, deleteCourse, showToast } = useAcademy();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // New Course Form State
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    duration: "6 Weeks (120 Hours)",
    fee: 65000,
    status: "Active" as const,
    syllabusModules: [
      "Skin Preparation & Primer Selection",
      "Foundation Textures & Color Matching",
      "Signature Eye Looks & Liner Mastery",
      "Vanity Setup & Client Protocol",
    ],
    kitIncluded: true,
    certification: "Certified Professional Diploma",
  });

  const [moduleInput, setModuleInput] = useState("");

  const handleAddModule = () => {
    if (!moduleInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      syllabusModules: [...prev.syllabusModules, moduleInput.trim()],
    }));
    setModuleInput("");
  };

  const handleRemoveModule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      syllabusModules: prev.syllabusModules.filter((_, i) => i !== index),
    }));
  };

  const handleSubmitNewCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      showToast("Validation Error", "Course title and code are required.", "error");
      return;
    }

    addCourse({
      name: formData.name,
      code: formData.code,
      description: formData.description,
      duration: formData.duration,
      fee: Number(formData.fee),
      status: formData.status,
      syllabusModules: formData.syllabusModules,
      kitIncluded: formData.kitIncluded,
      certification: formData.certification,
    });

    setIsAddModalOpen(false);
    setFormData({
      name: "",
      code: "",
      description: "",
      duration: "6 Weeks (120 Hours)",
      fee: 65000,
      status: "Active",
      syllabusModules: [
        "Skin Preparation & Primer Selection",
        "Foundation Textures & Color Matching",
        "Signature Eye Looks & Liner Mastery",
        "Vanity Setup & Client Protocol",
      ],
      kitIncluded: true,
      certification: "Certified Professional Diploma",
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    updateCourse(editingCourse);
    setEditingCourse(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE4DC] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-champagne-700 bg-champagne-50 px-2 py-0.5 rounded-full border border-champagne-200">
              Curriculum Catalog
            </span>
            <span className="text-xs text-charcoal-400">• Certified Programs</span>
          </div>
          <h1 className="font-serif text-2xl font-medium text-charcoal-900 mt-1">
            Courses & Syllabus Management
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Configure premium beauty curricula, module sequences, kit allocations, and official pricing.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-charcoal-900 text-ivory-50 hover:bg-charcoal-800 transition shadow-sm self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5 text-champagne-400" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.map((course) => {
          const courseBatches = batches.filter((b) => b.courseId === course.id);

          return (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-[#EAE4DC] shadow-luxury p-6 flex flex-col justify-between hover:border-champagne-400 transition"
            >
              <div>
                {/* Course Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F2ECE1]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-semibold text-champagne-700 bg-champagne-50 px-2 py-0.5 rounded border border-champagne-200">
                        {course.code}
                      </span>
                      <span className="text-[11px] text-charcoal-400">• {course.duration}</span>
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-charcoal-900 mt-1">
                      {course.name}
                    </h3>
                  </div>

                  <div className="text-right">
                    <div className="font-serif text-xl font-bold text-charcoal-900">
                      {formatINR(course.fee)}
                    </div>
                    <span className="text-[10px] text-charcoal-500">Per student</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-charcoal-600 mt-3 leading-relaxed">
                  {course.description}
                </p>

                {/* Feature Tags */}
                <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FAF6EE] text-champagne-900 border border-[#E8DEC0]">
                    <Award className="w-3 h-3 text-champagne-700" />
                    <span>{course.certification}</span>
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border ${
                      course.kitIncluded
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-charcoal-50 text-charcoal-600 border-charcoal-200"
                    }`}
                  >
                    <Package className="w-3 h-3" />
                    <span>{course.kitIncluded ? "Pro Kit Included" : "Kit Not Included"}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white text-charcoal-700 border border-[#E4D9CA]">
                    <Layers className="w-3 h-3 text-charcoal-400" />
                    <span>{courseBatches.length} Cohorts Active</span>
                  </span>
                </div>

                {/* Syllabus Modules Accordion Preview */}
                <div className="mt-4 pt-3 border-t border-[#F2ECE1]">
                  <span className="text-[10px] uppercase font-semibold text-charcoal-400 tracking-wider block mb-2">
                    Key Syllabus Modules ({course.syllabusModules.length})
                  </span>
                  <ul className="space-y-1 text-xs text-charcoal-700">
                    {course.syllabusModules.map((mod, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-champagne-600 font-bold shrink-0 mt-0.5">•</span>
                        <span>{mod}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-[#F2ECE1] flex items-center justify-between text-xs">
                <span className="text-[11px] text-charcoal-400">
                  Status: <strong className="text-emerald-700">{course.status}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditingCourse(course)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#DACFBF] text-charcoal-700 hover:bg-[#F2ECE0] transition"
                  >
                    <Edit2 className="w-3 h-3 text-charcoal-500" />
                    <span>Edit Course</span>
                  </button>
                  <button
                    onClick={() => deleteCourse(course.id)}
                    className="p-1.5 rounded-lg text-charcoal-400 hover:text-rose-700 hover:bg-rose-50 transition"
                    title="Delete Course"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- MODAL 1: ADD NEW COURSE --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-luxury-lg border border-[#EAE4DC] p-6 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
              <h3 className="font-serif text-lg font-medium text-charcoal-900">
                Add New Academy Course
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewCourse} className="space-y-3 text-xs overflow-y-auto pr-1">
              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Course Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Bridal Makeup & Hair Artistry"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Course Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MBM-101"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 6 Weeks (120 Hours)"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Tuition Fee (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.fee}
                    onChange={(e) => setFormData({ ...formData, fee: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Kit Included?</label>
                  <select
                    value={formData.kitIncluded ? "yes" : "no"}
                    onChange={(e) =>
                      setFormData({ ...formData, kitIncluded: e.target.value === "yes" })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#DACFBF] bg-white"
                  >
                    <option value="yes">Yes — Professional Vanity Kit Included</option>
                    <option value="no">No — Personal Kit Required</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Certification Title</label>
                <input
                  type="text"
                  value={formData.certification}
                  onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                />
              </div>

              {/* Modules list builder */}
              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">
                  Syllabus Modules ({formData.syllabusModules.length})
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add topic / module title..."
                    value={moduleInput}
                    onChange={(e) => setModuleInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-[#DACFBF]"
                  />
                  <button
                    type="button"
                    onClick={handleAddModule}
                    className="px-3 py-1.5 rounded-lg bg-[#FAF5EE] border border-[#E3D4C1] text-champagne-900 font-semibold hover:bg-[#F2E7D5]"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1 max-h-32 overflow-y-auto p-2 bg-[#FAF8F5] rounded-lg border border-[#EAE4DC]">
                  {formData.syllabusModules.map((mod, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px] text-charcoal-700">
                      <span>• {mod}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveModule(idx)}
                        className="text-rose-600 hover:text-rose-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
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
                  Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: EDIT COURSE --- */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-luxury-lg border border-[#EAE4DC] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
              <h3 className="font-serif text-lg font-medium text-charcoal-900">
                Edit Course — {editingCourse.code}
              </h3>
              <button
                onClick={() => setEditingCourse(null)}
                className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Course Name</label>
                <input
                  type="text"
                  required
                  value={editingCourse.name}
                  onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Tuition Fee (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingCourse.fee}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, fee: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={editingCourse.duration}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, duration: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingCourse.description}
                  onChange={(e) =>
                    setEditingCourse({ ...editingCourse, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[#DACFBF]"
                />
              </div>

              <div className="pt-3 border-t border-[#F0EAE1] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
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
    </div>
  );
}
