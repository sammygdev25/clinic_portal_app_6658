/**
 * Auto-generated TypeScript types and Zod schemas from ProjectContract.
 * Model interfaces match the Django backend exactly.
 */
import { z } from 'zod';

// DRF returns a related object either as its pk or nested; parse both to the pk
// so the parsed type matches the number typed FK fields on the interfaces.
const zRelation = z.union([z.coerce.number().int(), z.object({ id: z.coerce.number().int() }).passthrough()]).transform((v) => (typeof v === 'number' ? v : v.id));

// ── User ──
export interface User {
  id: number;
  role: string;
}

export const UserSchema = z.object({
  id: z.coerce.number(),
  role: z.string(),
}).passthrough();

// ── DoctorProfile ──
export interface DoctorProfile {
  id: number;
  user: number;
  specialty: string;
  bio: string;
  photo: string | null;
  created_at: string;
  updated_at: string;
}

export const DoctorProfileSchema = z.object({
  id: z.coerce.number(),
  user: zRelation,
  specialty: z.string(),
  bio: z.string(),
  photo: z.string().nullable().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
}).passthrough();

// ── PatientProfile ──
export interface PatientProfile {
  id: number;
  user: number;
  date_of_birth: string | null;
  phone: string;
  address: string;
  insurance_provider: string;
  insurance_policy_number: string;
  created_at: string;
  updated_at: string;
}

export const PatientProfileSchema = z.object({
  id: z.coerce.number(),
  user: zRelation,
  date_of_birth: z.string().nullable(),
  phone: z.string(),
  address: z.string(),
  insurance_provider: z.string(),
  insurance_policy_number: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
}).passthrough();

// ── Service ──
export interface Service {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export const ServiceSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  description: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
}).passthrough();

// ── ClinicHour ──
export interface ClinicHour {
  id: number;
  day_of_week: string;
  open_time: string;
  close_time: string;
  created_at: string;
  updated_at: string;
}

export const ClinicHourSchema = z.object({
  id: z.coerce.number(),
  day_of_week: z.string(),
  open_time: z.string(),
  close_time: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
}).passthrough();

// ── Appointment ──
export interface Appointment {
  id: number;
  patient: number;
  doctor: number;
  scheduled_at: string;
  status: string;
  reason: string;
  created_at: string;
  updated_at: string;
}

export const AppointmentSchema = z.object({
  id: z.coerce.number(),
  patient: zRelation,
  doctor: zRelation,
  scheduled_at: z.string(),
  status: z.string(),
  reason: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
}).passthrough();

// ── VisitNote ──
export interface VisitNote {
  id: number;
  appointment: number;
  doctor: number;
  patient: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export const VisitNoteSchema = z.object({
  id: z.coerce.number(),
  appointment: zRelation,
  doctor: zRelation,
  patient: zRelation,
  content: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
}).passthrough();

// ── Prescription ──
export interface Prescription {
  id: number;
  appointment: number;
  doctor: number;
  patient: number;
  medication: string;
  dosage: string;
  instructions: string;
  created_at: string;
  updated_at: string;
}

export const PrescriptionSchema = z.object({
  id: z.coerce.number(),
  appointment: zRelation,
  doctor: zRelation,
  patient: zRelation,
  medication: z.string(),
  dosage: z.string(),
  instructions: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
}).passthrough();

// ── Bill ──
export interface Bill {
  id: number;
  patient: number;
  appointment: number;
  amount: number;
  status: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export const BillSchema = z.object({
  id: z.coerce.number(),
  patient: zRelation,
  appointment: zRelation,
  amount: z.coerce.number(),
  status: z.string(),
  due_date: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
}).passthrough();

// ── Document ──
export interface Document {
  id: number;
  patient: number;
  uploaded_by: number;
  doc_type: string;
  file: string;
  uploaded_at: string;
  updated_at: string;
}

export const DocumentSchema = z.object({
  id: z.coerce.number(),
  patient: zRelation,
  uploaded_by: zRelation,
  doc_type: z.string(),
  file: z.string().nullable(),
  uploaded_at: z.string(),
  updated_at: z.string(),
}).passthrough();

// ── Paginated Response ──
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    count: z.coerce.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(itemSchema),
  });

