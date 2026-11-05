"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  Role,
  Course,
  Batch,
  Student,
  Admission,
  PaymentRecord,
  AcademySettings,
  AdmissionStatus,
  FeeStatus,
  PaymentMethod,
} from "@/types";
import {
  initialCourses,
  initialBatches,
  initialStudents,
  initialAdmissions,
  initialPayments,
  initialSettings,
} from "@/data/seedData";

interface ToastNotification {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message: string;
}

interface AcademyContextType {
  // Navigation & Role
  role: Role;
  setRole: (role: Role) => void;
  activeAdminTab: string;
  setActiveAdminTab: (tab: string) => void;
  activeStudentTab: string;
  setActiveStudentTab: (tab: string) => void;
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;

  // Data
  courses: Course[];
  batches: Batch[];
  students: Student[];
  admissions: Admission[];
  payments: PaymentRecord[];
  settings: AcademySettings;
  isHydrated: boolean;

  // Modals & UI
  selectedReceiptPayment: PaymentRecord | null;
  openReceiptModal: (payment: PaymentRecord) => void;
  closeReceiptModal: () => void;
  toast: ToastNotification | null;
  showToast: (title: string, message: string, type?: "success" | "error" | "info") => void;

  // Admissions actions
  addAdmission: (data: Omit<Admission, "id" | "applicationNumber" | "createdDate">) => void;
  updateAdmission: (admission: Admission) => void;
  deleteAdmission: (id: string) => void;
  approveAdmission: (id: string) => void;
  rejectAdmission: (id: string) => void;
  convertToStudent: (
    admissionId: string,
    batchId: string,
    initialPaidAmount: number,
    paymentMethod: PaymentMethod
  ) => boolean;

  // Students actions
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  reallocateStudentBatch: (studentId: string, newBatchId: string) => boolean;

  // Fees & Payments actions
  recordPayment: (payment: {
    studentId: string;
    amount: number;
    method: PaymentMethod;
    transactionRef: string;
    notes?: string;
  }) => PaymentRecord | null;

  // Batches actions
  addBatch: (batch: Omit<Batch, "id" | "enrolledCount" | "enrolledStudentIds">) => void;
  updateBatch: (batch: Batch) => void;
  deleteBatch: (id: string) => void;

  // Courses actions
  addCourse: (course: Omit<Course, "id">) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;

  // Settings & System
  updateSettings: (newSettings: AcademySettings) => void;
  resetToDefaults: () => void;
}

const AcademyContext = createContext<AcademyContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = "the_game_of_makeup_v1_";

export function AcademyProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>("admin");
  const [activeAdminTab, setActiveAdminTab] = useState<string>("overview");
  const [activeStudentTab, setActiveStudentTab] = useState<string>("overview");
  const [selectedStudentId, setSelectedStudentIdState] = useState<string>("GOM-2025-001");

  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [batches, setBatches] = useState<Batch[]>(initialBatches);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [admissions, setAdmissions] = useState<Admission[]>(initialAdmissions);
  const [payments, setPayments] = useState<PaymentRecord[]>(initialPayments);
  const [settings, setSettings] = useState<AcademySettings>(initialSettings);
  const [isHydrated, setIsHydrated] = useState(false);

  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState<PaymentRecord | null>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedRole = localStorage.getItem(`${STORAGE_KEY_PREFIX}role`);
      if (storedRole === "admin" || storedRole === "student") {
        setRoleState(storedRole);
      }

      const storedStudentId = localStorage.getItem(`${STORAGE_KEY_PREFIX}selected_student`);
      if (storedStudentId) {
        setSelectedStudentIdState(storedStudentId);
      }

      const storedCourses = localStorage.getItem(`${STORAGE_KEY_PREFIX}courses`);
      if (storedCourses) setCourses(JSON.parse(storedCourses));

      const storedBatches = localStorage.getItem(`${STORAGE_KEY_PREFIX}batches`);
      if (storedBatches) setBatches(JSON.parse(storedBatches));

      const storedStudents = localStorage.getItem(`${STORAGE_KEY_PREFIX}students`);
      if (storedStudents) setStudents(JSON.parse(storedStudents));

      const storedAdmissions = localStorage.getItem(`${STORAGE_KEY_PREFIX}admissions`);
      if (storedAdmissions) setAdmissions(JSON.parse(storedAdmissions));

      const storedPayments = localStorage.getItem(`${STORAGE_KEY_PREFIX}payments`);
      if (storedPayments) setPayments(JSON.parse(storedPayments));

      const storedSettings = localStorage.getItem(`${STORAGE_KEY_PREFIX}settings`);
      if (storedSettings) setSettings(JSON.parse(storedSettings));
    } catch (e) {
      console.warn("Could not read from localStorage, using initial seed data.", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage when state changes after hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}role`, role);
      localStorage.setItem(`${STORAGE_KEY_PREFIX}selected_student`, selectedStudentId);
      localStorage.setItem(`${STORAGE_KEY_PREFIX}courses`, JSON.stringify(courses));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}batches`, JSON.stringify(batches));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}students`, JSON.stringify(students));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}admissions`, JSON.stringify(admissions));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}payments`, JSON.stringify(payments));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}settings`, JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to persist data to localStorage", e);
    }
  }, [role, selectedStudentId, courses, batches, students, admissions, payments, settings, isHydrated]);

  const showToast = (title: string, message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now().toString();
    setToast({ id, title, message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 4500);
  };

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    showToast(
      `Switched to ${newRole === "admin" ? "Academy Admin" : "Student"} Portal`,
      newRole === "admin"
        ? "Viewing full management suite & analytics."
        : `Viewing personalized portal for ${students.find((s) => s.id === selectedStudentId)?.fullName || "Student"}.`,
      "info"
    );
  };

  const setSelectedStudentId = (id: string) => {
    setSelectedStudentIdState(id);
    const s = students.find((item) => item.id === id);
    if (s && role === "student") {
      showToast("Student Profile Switched", `Now previewing portal as ${s.fullName}`, "info");
    }
  };

  const openReceiptModal = (payment: PaymentRecord) => {
    setSelectedReceiptPayment(payment);
  };

  const closeReceiptModal = () => {
    setSelectedReceiptPayment(null);
  };

  // --- Admissions Handlers ---
  const addAdmission = (data: Omit<Admission, "id" | "applicationNumber" | "createdDate">) => {
    const nextNum = admissions.length + 1;
    const applicationNumber = `ADM-${new Date().getFullYear()}-${String(nextNum).padStart(3, "0")}`;
    const newAdmission: Admission = {
      ...data,
      id: `ADM-${Date.now()}`,
      applicationNumber,
      createdDate: new Date().toISOString().split("T")[0],
    };

    setAdmissions((prev) => [newAdmission, ...prev]);
    showToast("Application Registered", `Admission application ${applicationNumber} created for ${data.studentName}.`, "success");
  };

  const updateAdmission = (updated: Admission) => {
    setAdmissions((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    showToast("Admission Updated", `Details updated for ${updated.studentName}.`, "success");
  };

  const deleteAdmission = (id: string) => {
    const target = admissions.find((a) => a.id === id);
    setAdmissions((prev) => prev.filter((item) => item.id !== id));
    showToast("Admission Removed", `Application ${target?.applicationNumber || ""} has been deleted.`, "info");
  };

  const approveAdmission = (id: string) => {
    setAdmissions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Approved" as AdmissionStatus } : item))
    );
    showToast("Admission Approved", "Application approved. You can now convert it to an enrolled student.", "success");
  };

  const rejectAdmission = (id: string) => {
    setAdmissions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Rejected" as AdmissionStatus } : item))
    );
    showToast("Admission Rejected", "Application marked as rejected.", "info");
  };

  const convertToStudent = (
    admissionId: string,
    batchId: string,
    initialPaidAmount: number,
    paymentMethod: PaymentMethod
  ): boolean => {
    const admission = admissions.find((a) => a.id === admissionId);
    if (!admission) {
      showToast("Conversion Failed", "Admission record not found.", "error");
      return false;
    }

    const batch = batches.find((b) => b.id === batchId);
    if (!batch) {
      showToast("Conversion Failed", "Selected batch does not exist.", "error");
      return false;
    }

    if (batch.enrolledCount >= batch.maxCapacity) {
      showToast(
        "Batch Full",
        `Cannot enroll into ${batch.name}. Maximum capacity of ${batch.maxCapacity} students reached.`,
        "error"
      );
      return false;
    }

    // Generate new student ID
    const studentCount = students.length + 1;
    const studentId = `GOM-${new Date().getFullYear()}-${String(studentCount).padStart(3, "0")}`;

    const totalFee = admission.totalCourseFee;
    const paidAmount = Math.max(0, initialPaidAmount);
    let feeStatus: FeeStatus = "Unpaid";
    if (paidAmount >= totalFee) {
      feeStatus = "Paid";
    } else if (paidAmount > 0) {
      feeStatus = "Partial";
    }

    const newStudent: Student = {
      id: studentId,
      admissionId: admission.id,
      fullName: admission.studentName,
      phone: admission.phone,
      email: admission.email,
      city: "Mumbai, Maharashtra",
      emergencyContact: "+91 98200 00000",
      emergencyRelation: "Parent/Guardian",
      courseId: admission.courseId,
      courseName: admission.courseName,
      batchId: batch.id,
      batchName: batch.name,
      admissionDate: admission.admissionDate || new Date().toISOString().split("T")[0],
      enrollmentStatus: "Active",
      totalFee,
      paidAmount,
      feeStatus,
      attendanceRate: 100,
      notes: admission.notes || "Enrolled from online admission portal.",
    };

    // Update batch enrolled students
    const updatedBatches = batches.map((b) => {
      if (b.id === batch.id) {
        return {
          ...b,
          enrolledCount: b.enrolledCount + 1,
          enrolledStudentIds: [...b.enrolledStudentIds, studentId],
        };
      }
      return b;
    });

    // If initial payment was made, generate payment receipt record
    let newPayment: PaymentRecord | null = null;
    if (paidAmount > 0) {
      const receiptNumber = `${settings.receiptPrefix}-${new Date().getFullYear()}-${String(payments.length + 101).padStart(3, "0")}`;
      newPayment = {
        id: `PAY-${Date.now()}`,
        receiptNumber,
        studentId,
        studentName: newStudent.fullName,
        courseName: newStudent.courseName,
        amount: paidAmount,
        date: new Date().toISOString().split("T")[0],
        method: paymentMethod,
        transactionRef: `${paymentMethod.toUpperCase()}/INIT/${Date.now().toString().slice(-6)}`,
        status: "Completed",
        notes: "Initial enrollment deposit upon admission conversion.",
        balanceAfterPayment: Math.max(0, totalFee - paidAmount),
      };
    }

    // Update state
    setStudents((prev) => [newStudent, ...prev]);
    setBatches(updatedBatches);
    setAdmissions((prev) =>
      prev.map((a) =>
        a.id === admissionId
          ? {
              ...a,
              status: "Enrolled",
              studentId,
              amountPaid: paidAmount,
              preferredBatchId: batch.id,
              preferredBatchName: batch.name,
            }
          : a
      )
    );

    if (newPayment) {
      setPayments((prev) => [newPayment!, ...prev]);
    }

    showToast(
      "Student Enrolled Successfully!",
      `${newStudent.fullName} allocated to ${batch.name} with ID ${studentId}.`,
      "success"
    );

    return true;
  };

  // --- Student Actions ---
  const updateStudent = (updatedStudent: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
    showToast("Student Updated", `Record updated for ${updatedStudent.fullName}.`, "success");
  };

  const deleteStudent = (id: string) => {
    const target = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    // Remove student from batch enrolled count
    setBatches((prev) =>
      prev.map((b) => {
        if (b.enrolledStudentIds.includes(id)) {
          return {
            ...b,
            enrolledCount: Math.max(0, b.enrolledCount - 1),
            enrolledStudentIds: b.enrolledStudentIds.filter((sid) => sid !== id),
          };
        }
        return b;
      })
    );
    showToast("Student Deleted", `Record for ${target?.fullName || id} removed from directory.`, "info");
  };

  const reallocateStudentBatch = (studentId: string, newBatchId: string): boolean => {
    const student = students.find((s) => s.id === studentId);
    const newBatch = batches.find((b) => b.id === newBatchId);

    if (!student || !newBatch) {
      showToast("Reallocation Failed", "Student or Batch not found.", "error");
      return false;
    }

    if (student.batchId === newBatchId) {
      showToast("Same Batch", "Student is already in this batch.", "info");
      return true;
    }

    if (newBatch.enrolledCount >= newBatch.maxCapacity) {
      showToast(
        "Batch Full",
        `Cannot transfer to ${newBatch.name}. Maximum capacity of ${newBatch.maxCapacity} reached.`,
        "error"
      );
      return false;
    }

    // Update old and new batch lists
    setBatches((prev) =>
      prev.map((b) => {
        if (b.id === student.batchId) {
          return {
            ...b,
            enrolledCount: Math.max(0, b.enrolledCount - 1),
            enrolledStudentIds: b.enrolledStudentIds.filter((id) => id !== studentId),
          };
        }
        if (b.id === newBatchId) {
          return {
            ...b,
            enrolledCount: b.enrolledCount + 1,
            enrolledStudentIds: [...b.enrolledStudentIds, studentId],
          };
        }
        return b;
      })
    );

    // Update student
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              batchId: newBatch.id,
              batchName: newBatch.name,
            }
          : s
      )
    );

    showToast(
      "Batch Reallocated",
      `${student.fullName} moved to ${newBatch.name}.`,
      "success"
    );
    return true;
  };

  // --- Payments / Fees Handlers ---
  const recordPayment = ({
    studentId,
    amount,
    method,
    transactionRef,
    notes,
  }: {
    studentId: string;
    amount: number;
    method: PaymentMethod;
    transactionRef: string;
    notes?: string;
  }): PaymentRecord | null => {
    const student = students.find((s) => s.id === studentId);
    if (!student) {
      showToast("Payment Failed", "Student record not found.", "error");
      return null;
    }

    if (amount <= 0) {
      showToast("Invalid Amount", "Payment amount must be greater than zero.", "error");
      return null;
    }

    const outstanding = Math.max(0, student.totalFee - student.paidAmount);
    if (amount > outstanding) {
      showToast(
        "Excess Payment",
        `Amount (₹${amount.toLocaleString("en-IN")}) exceeds remaining balance of ₹${outstanding.toLocaleString("en-IN")}.`,
        "error"
      );
      return null;
    }

    const newPaidAmount = student.paidAmount + amount;
    const remainingBalance = Math.max(0, student.totalFee - newPaidAmount);

    let newFeeStatus: FeeStatus = "Partial";
    if (newPaidAmount >= student.totalFee) {
      newFeeStatus = "Paid";
    }

    const receiptNumber = `${settings.receiptPrefix}-${new Date().getFullYear()}-${String(payments.length + 101).padStart(3, "0")}`;
    const newPaymentRecord: PaymentRecord = {
      id: `PAY-${Date.now()}`,
      receiptNumber,
      studentId: student.id,
      studentName: student.fullName,
      courseName: student.courseName,
      amount,
      date: new Date().toISOString().split("T")[0],
      method,
      transactionRef: transactionRef || `REF/${method}/${Date.now().toString().slice(-6)}`,
      status: "Completed",
      notes: notes || "Fee installment processed.",
      balanceAfterPayment: remainingBalance,
    };

    // Update student paid amount & fee status
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              paidAmount: newPaidAmount,
              feeStatus: newFeeStatus,
            }
          : s
      )
    );

    setPayments((prev) => [newPaymentRecord, ...prev]);

    showToast(
      "Payment Recorded",
      `₹${amount.toLocaleString("en-IN")} received for ${student.fullName}. Receipt ${receiptNumber} generated.`,
      "success"
    );

    return newPaymentRecord;
  };

  // --- Batches Handlers ---
  const addBatch = (batchData: Omit<Batch, "id" | "enrolledCount" | "enrolledStudentIds">) => {
    const newBatch: Batch = {
      ...batchData,
      id: `BAT-${new Date().getFullYear()}-${String(batches.length + 1).padStart(2, "0")}`,
      enrolledCount: 0,
      enrolledStudentIds: [],
    };
    setBatches((prev) => [newBatch, ...prev]);
    showToast("Batch Created", `New cohort "${newBatch.name}" is now open.`, "success");
  };

  const updateBatch = (updated: Batch) => {
    setBatches((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    // Also sync batch name in student records if name changed
    setStudents((prev) =>
      prev.map((s) => (s.batchId === updated.id ? { ...s, batchName: updated.name } : s))
    );
    showToast("Batch Updated", `Cohort details saved for "${updated.name}".`, "success");
  };

  const deleteBatch = (id: string) => {
    const target = batches.find((b) => b.id === id);
    if (target && target.enrolledCount > 0) {
      showToast(
        "Cannot Delete Batch",
        `This batch has ${target.enrolledCount} active students. Reallocate them first.`,
        "error"
      );
      return;
    }
    setBatches((prev) => prev.filter((b) => b.id !== id));
    showToast("Batch Deleted", `Batch ${target?.name || id} has been removed.`, "info");
  };

  // --- Courses Handlers ---
  const addCourse = (courseData: Omit<Course, "id">) => {
    const newCourse: Course = {
      ...courseData,
      id: `CRS-${String(courses.length + 1).padStart(2, "0")}`,
    };
    setCourses((prev) => [...prev, newCourse]);
    showToast("Course Added", `"${newCourse.name}" has been published to curriculum.`, "success");
  };

  const updateCourse = (updated: Course) => {
    setCourses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    showToast("Course Updated", `Curriculum details saved for "${updated.name}".`, "success");
  };

  const deleteCourse = (id: string) => {
    const enrolledStudents = students.filter((s) => s.courseId === id);
    if (enrolledStudents.length > 0) {
      showToast(
        "Cannot Delete Course",
        `This course has ${enrolledStudents.length} active students enrolled.`,
        "error"
      );
      return;
    }
    setCourses((prev) => prev.filter((c) => c.id !== id));
    showToast("Course Removed", "Course removed from curriculum.", "info");
  };

  // --- Settings & Reset ---
  const updateSettings = (newSettings: AcademySettings) => {
    setSettings(newSettings);
    showToast("Settings Saved", "Academy profile and billing settings updated.", "success");
  };

  const resetToDefaults = () => {
    if (typeof window !== "undefined") {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(STORAGE_KEY_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    }
    setCourses(initialCourses);
    setBatches(initialBatches);
    setStudents(initialStudents);
    setAdmissions(initialAdmissions);
    setPayments(initialPayments);
    setSettings(initialSettings);
    setRoleState("admin");
    setSelectedStudentIdState("GOM-2025-001");
    showToast("Demo Data Reset", "Restored all default students, courses, batches and payments.", "info");
  };

  const value = useMemo(
    () => ({
      role,
      setRole,
      activeAdminTab,
      setActiveAdminTab,
      activeStudentTab,
      setActiveStudentTab,
      selectedStudentId,
      setSelectedStudentId,
      courses,
      batches,
      students,
      admissions,
      payments,
      settings,
      isHydrated,
      selectedReceiptPayment,
      openReceiptModal,
      closeReceiptModal,
      toast,
      showToast,
      addAdmission,
      updateAdmission,
      deleteAdmission,
      approveAdmission,
      rejectAdmission,
      convertToStudent,
      updateStudent,
      deleteStudent,
      reallocateStudentBatch,
      recordPayment,
      addBatch,
      updateBatch,
      deleteBatch,
      addCourse,
      updateCourse,
      deleteCourse,
      updateSettings,
      resetToDefaults,
    }),
    [
      role,
      activeAdminTab,
      activeStudentTab,
      selectedStudentId,
      courses,
      batches,
      students,
      admissions,
      payments,
      settings,
      isHydrated,
      selectedReceiptPayment,
      toast,
    ]
  );

  return <AcademyContext.Provider value={value}>{children}</AcademyContext.Provider>;
}

export function useAcademy() {
  const context = useContext(AcademyContext);
  if (!context) {
    throw new Error("useAcademy must be used within an AcademyProvider");
  }
  return context;
}
