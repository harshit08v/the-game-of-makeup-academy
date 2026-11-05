export type Role = "admin" | "student";

export type AdmissionStatus = "New" | "Approved" | "Enrolled" | "Rejected";

export type FeeStatus = "Paid" | "Partial" | "Overdue" | "Unpaid";

export type EnrollmentStatus = "Active" | "Completed" | "On Hold" | "Dropped";

export type PaymentMethod = "UPI" | "Bank Transfer" | "Credit/Debit Card" | "Cash";

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  duration: string; // e.g. "8 Weeks (160 Hours)"
  fee: number; // in INR
  status: "Active" | "Archived";
  syllabusModules: string[];
  kitIncluded: boolean;
  certification: string;
}

export interface Batch {
  id: string;
  name: string;
  courseId: string;
  courseName: string;
  trainer: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  schedule: string; // e.g. "Mon, Wed, Fri • 10:00 AM - 2:00 PM"
  maxCapacity: number;
  enrolledCount: number;
  enrolledStudentIds: string[];
  status: "Upcoming" | "In Progress" | "Completed";
  locationRoom: string;
}

export interface PaymentRecord {
  id: string;
  receiptNumber: string; // e.g. "RCP-2025-089"
  studentId: string;
  studentName: string;
  courseName: string;
  amount: number;
  date: string; // YYYY-MM-DD
  method: PaymentMethod;
  transactionRef: string;
  status: "Completed" | "Pending Verification" | "Failed";
  notes?: string;
  balanceAfterPayment: number;
}

export interface Admission {
  id: string;
  applicationNumber: string; // e.g. "ADM-2025-042"
  studentName: string;
  phone: string;
  email: string;
  courseId: string;
  courseName: string;
  preferredBatchId?: string;
  preferredBatchName?: string;
  admissionDate: string; // YYYY-MM-DD
  totalCourseFee: number;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  status: AdmissionStatus;
  studentId?: string; // set once converted to student
  createdDate: string;
}

export interface Student {
  id: string; // e.g. "GOM-2025-001"
  admissionId?: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  emergencyContact: string;
  emergencyRelation: string;
  courseId: string;
  courseName: string;
  batchId: string;
  batchName: string;
  admissionDate: string;
  enrollmentStatus: EnrollmentStatus;
  totalFee: number;
  paidAmount: number;
  feeStatus: FeeStatus;
  avatarUrl?: string;
  notes?: string;
  attendanceRate?: number; // e.g. 94%
}

export interface AcademySettings {
  academyName: string;
  subtitle: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  gstNumber: string;
  currency: string;
  currencySymbol: string;
  receiptPrefix: string;
  receiptNotes: string;
}
