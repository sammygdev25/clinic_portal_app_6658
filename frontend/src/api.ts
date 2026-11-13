import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { z } from 'zod';
import { User, DoctorProfile, PatientProfile, Service, ClinicHour, Appointment, VisitNote, Prescription, Bill, Document, UserSchema, DoctorProfileSchema, PatientProfileSchema, ServiceSchema, ClinicHourSchema, AppointmentSchema, VisitNoteSchema, PrescriptionSchema, BillSchema, DocumentSchema, PaginatedResponseSchema } from './types';

const API_BASE_URL = '/api';

// Auto-detect K8s preview proxy and rewrite API URLs
const isProxied = window.location.pathname.includes('/preview/proxy');
const proxyBase = isProxied
  ? window.location.pathname.replace(/\/preview\/proxy.*/, '/preview/proxy')
  : '';

const api: AxiosInstance = axios.create({
  baseURL: proxyBase + API_BASE_URL,
});

// A body holding a picked file goes as multipart, so the file reaches the API (P1b.6 R2): the other fields go
// alongside it as text, a list item by item, and axios sets the multipart header itself.
const asUpload = (data: unknown): unknown => {
  if (!data || typeof data !== 'object' || data instanceof FormData || data instanceof Blob) return data;
  const entries = Object.entries(data as Record<string, unknown>);
  if (!entries.some(([, value]) => value instanceof Blob)) return data;
  const form = new FormData();
  for (const [key, value] of entries) {
    if (value === undefined || value === null) continue;
    if (value instanceof Blob) form.append(key, value);
    else if (Array.isArray(value)) value.forEach((item) => form.append(key, String(item)));
    else form.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
  }
  return form;
};

api.interceptors.request.use((config) => {
  config.data = asUpload(config.data);
  return config;
});

// Auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// On a 401 with a stored refresh token (the Express track issues one), refresh once and retry.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;
    const refreshToken = localStorage.getItem('refreshToken');
    if (error.response?.status === 401 && refreshToken && original && !original._retried) {
      original._retried = true;
      try {
        const res = await axios.post(proxyBase + API_BASE_URL + '/auth/refresh/', { refreshToken });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        return api(original);
      } catch {
        localStorage.removeItem('refreshToken');
      }
    }
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      localStorage.removeItem('token');
      if (originalRequest.method === 'get') {
        originalRequest._retry = true;
        delete originalRequest.headers.Authorization;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

// Response validation is advisory: a schema mismatch must never blank a page.
const parseOr = <S extends z.ZodTypeAny>(schema: S, data: unknown): z.output<S> => {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.warn('[api] response did not match schema, using raw data:', result.error.issues.slice(0, 3));
    return data as z.output<S>;
  }
  return result.data;
};

// Auth API
export const login = (credentials: { username: string; password: string }) =>
  api.post('/auth/login/', credentials);
export const register = (data: { username: string; email: string; password: string }) =>
  api.post('/auth/register/', data);
export const logout = () => api.post('/auth/logout/');
export const getProfile = () => api.get('/auth/profile/');

// ── User API ──
export const getUserList = async (params?: Record<string, unknown>): Promise<User[]> => {
  const res = await api.get('/users/', params ? { params } : undefined);
  const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? res.data?.data ?? res.data?.items ?? res.data?.users ?? res.data?.users ?? []);
  // The interface is the strict type: a field name the API does not send is a compile error, not an unknown.
  return parseOr(z.array(UserSchema), data) as User[];
};

export const getUser = async (id: number | string | Record<string, unknown>): Promise<User> => {
  // Pages sometimes call the detail getter with a filter object; route that to the list endpoint.
  if (typeof id === 'object' && id !== null) return getUserList(id) as unknown as Promise<User>;
  const res = await api.get(`/users/${id}/`);
  return parseOr(UserSchema, res.data) as User;
};

// Create sends the fields a form holds; the server sets owner, status, totals and times, and validates.
export const createUser = async (data: Partial<Omit<User, 'id'>>): Promise<User> => {
  const res = await api.post('/users/', data);
  return parseOr(UserSchema, res.data) as User;
};

export const updateUser = async (id: number, data: Partial<User>): Promise<User> => {
  const res = await api.patch(`/users/${id}/`, data);
  return parseOr(UserSchema, res.data) as User;
};

export const deleteUser = async (id: number) => {
  await api.delete(`/users/${id}/`);
};

// ── DoctorProfile API ──
export const getDoctorProfileList = async (params?: Record<string, unknown>): Promise<DoctorProfile[]> => {
  const res = await api.get('/doctor_profiles/', params ? { params } : undefined);
  const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? res.data?.data ?? res.data?.items ?? res.data?.doctor_profiles ?? res.data?.doctorProfiles ?? []);
  // The interface is the strict type: a field name the API does not send is a compile error, not an unknown.
  return parseOr(z.array(DoctorProfileSchema), data) as DoctorProfile[];
};

export const getDoctorProfile = async (id: number | string | Record<string, unknown>): Promise<DoctorProfile> => {
  // Pages sometimes call the detail getter with a filter object; route that to the list endpoint.
  if (typeof id === 'object' && id !== null) return getDoctorProfileList(id) as unknown as Promise<DoctorProfile>;
  const res = await api.get(`/doctor_profiles/${id}/`);
  return parseOr(DoctorProfileSchema, res.data) as DoctorProfile;
};

// Create sends the fields a form holds; the server sets owner, status, totals and times, and validates.
export const createDoctorProfile = async (data: Partial<Omit<DoctorProfile, 'id'>>): Promise<DoctorProfile> => {
  const res = await api.post('/doctor_profiles/', data);
  return parseOr(DoctorProfileSchema, res.data) as DoctorProfile;
};

export const updateDoctorProfile = async (id: number, data: Partial<DoctorProfile>): Promise<DoctorProfile> => {
  const res = await api.patch(`/doctor_profiles/${id}/`, data);
  return parseOr(DoctorProfileSchema, res.data) as DoctorProfile;
};

export const deleteDoctorProfile = async (id: number) => {
  await api.delete(`/doctor_profiles/${id}/`);
};

// ── PatientProfile API ──
export const getPatientProfileList = async (params?: Record<string, unknown>): Promise<PatientProfile[]> => {
  const res = await api.get('/patient_profiles/', params ? { params } : undefined);
  const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? res.data?.data ?? res.data?.items ?? res.data?.patient_profiles ?? res.data?.patientProfiles ?? []);
  // The interface is the strict type: a field name the API does not send is a compile error, not an unknown.
  return parseOr(z.array(PatientProfileSchema), data) as PatientProfile[];
};

export const getPatientProfile = async (id: number | string | Record<string, unknown>): Promise<PatientProfile> => {
  // Pages sometimes call the detail getter with a filter object; route that to the list endpoint.
  if (typeof id === 'object' && id !== null) return getPatientProfileList(id) as unknown as Promise<PatientProfile>;
  const res = await api.get(`/patient_profiles/${id}/`);
  return parseOr(PatientProfileSchema, res.data) as PatientProfile;
};

// Create sends the fields a form holds; the server sets owner, status, totals and times, and validates.
export const createPatientProfile = async (data: Partial<Omit<PatientProfile, 'id'>>): Promise<PatientProfile> => {
  const res = await api.post('/patient_profiles/', data);
  return parseOr(PatientProfileSchema, res.data) as PatientProfile;
};

export const updatePatientProfile = async (id: number, data: Partial<PatientProfile>): Promise<PatientProfile> => {
  const res = await api.patch(`/patient_profiles/${id}/`, data);
  return parseOr(PatientProfileSchema, res.data) as PatientProfile;
};

export const deletePatientProfile = async (id: number) => {
  await api.delete(`/patient_profiles/${id}/`);
};

// ── Service API ──
export const getServiceList = async (params?: Record<string, unknown>): Promise<Service[]> => {
  const res = await api.get('/services/', params ? { params } : undefined);
  const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? res.data?.data ?? res.data?.items ?? res.data?.services ?? res.data?.services ?? []);
  // The interface is the strict type: a field name the API does not send is a compile error, not an unknown.
  return parseOr(z.array(ServiceSchema), data) as Service[];
};

export const getService = async (id: number | string | Record<string, unknown>): Promise<Service> => {
  // Pages sometimes call the detail getter with a filter object; route that to the list endpoint.
  if (typeof id === 'object' && id !== null) return getServiceList(id) as unknown as Promise<Service>;
  const res = await api.get(`/services/${id}/`);
  return parseOr(ServiceSchema, res.data) as Service;
};

// Create sends the fields a form holds; the server sets owner, status, totals and times, and validates.
export const createService = async (data: Partial<Omit<Service, 'id'>>): Promise<Service> => {
  const res = await api.post('/services/', data);
  return parseOr(ServiceSchema, res.data) as Service;
};

export const updateService = async (id: number, data: Partial<Service>): Promise<Service> => {
  const res = await api.patch(`/services/${id}/`, data);
  return parseOr(ServiceSchema, res.data) as Service;
};

export const deleteService = async (id: number) => {
  await api.delete(`/services/${id}/`);
};

// ── ClinicHour API ──
export const getClinicHourList = async (params?: Record<string, unknown>): Promise<ClinicHour[]> => {
  const res = await api.get('/clinic-hours/', params ? { params } : undefined);
  const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? res.data?.data ?? res.data?.items ?? res.data?.clinic_hours ?? res.data?.clinicHours ?? []);
  // The interface is the strict type: a field name the API does not send is a compile error, not an unknown.
  return parseOr(z.array(ClinicHourSchema), data) as ClinicHour[];
};

export const getClinicHour = async (id: number | string | Record<string, unknown>): Promise<ClinicHour> => {
  // Pages sometimes call the detail getter with a filter object; route that to the list endpoint.
  if (typeof id === 'object' && id !== null) return getClinicHourList(id) as unknown as Promise<ClinicHour>;
  const res = await api.get(`/clinic-hours/${id}/`);
  return parseOr(ClinicHourSchema, res.data) as ClinicHour;
};

// Create sends the fields a form holds; the server sets owner, status, totals and times, and validates.
export const createClinicHour = async (data: Partial<Omit<ClinicHour, 'id'>>): Promise<ClinicHour> => {
  const res = await api.post('/clinic-hours/', data);
  return parseOr(ClinicHourSchema, res.data) as ClinicHour;
};

export const updateClinicHour = async (id: number, data: Partial<ClinicHour>): Promise<ClinicHour> => {
  const res = await api.patch(`/clinic-hours/${id}/`, data);
  return parseOr(ClinicHourSchema, res.data) as ClinicHour;
};

export const deleteClinicHour = async (id: number) => {
  await api.delete(`/clinic-hours/${id}/`);
};

// ── Appointment API ──
export const getAppointmentList = async (params?: Record<string, unknown>): Promise<Appointment[]> => {
  const res = await api.get('/appointments/', params ? { params } : undefined);
  const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? res.data?.data ?? res.data?.items ?? res.data?.appointments ?? res.data?.appointments ?? []);
  // The interface is the strict type: a field name the API does not send is a compile error, not an unknown.
  return parseOr(z.array(AppointmentSchema), data) as Appointment[];
};

export const getAppointment = async (id: number | string | Record<string, unknown>): Promise<Appointment> => {
  // Pages sometimes call the detail getter with a filter object; route that to the list endpoint.
  if (typeof id === 'object' && id !== null) return getAppointmentList(id) as unknown as Promise<Appointment>;
  const res = await api.get(`/appointments/${id}/`);
  return parseOr(AppointmentSchema, res.data) as Appointment;
};

// Create sends the fields a form holds; the server sets owner, status, totals and times, and validates.
export const createAppointment = async (data: Partial<Omit<Appointment, 'id'>>): Promise<Appointment> => {
  const res = await api.post('/appointments/', data);
  return parseOr(AppointmentSchema, res.data) as Appointment;
};

export const updateAppointment = async (id: number, data: Partial<Appointment>): Promise<Appointment> => {
  const res = await api.patch(`/appointments/${id}/`, data);
  return parseOr(AppointmentSchema, res.data) as Appointment;
};

export const deleteAppointment = async (id: number) => {
  await api.delete(`/appointments/${id}/`);
};

// ── VisitNote API ──
export const getVisitNoteList = async (params?: Record<string, unknown>): Promise<VisitNote[]> => {
  const res = await api.get('/visit-notes/', params ? { params } : undefined);
  const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? res.data?.data ?? res.data?.items ?? res.data?.visit_notes ?? res.data?.visitNotes ?? []);
  // The interface is the strict type: a field name the API does not send is a compile error, not an unknown.
  return parseOr(z.array(VisitNoteSchema), data) as VisitNote[];
};

export const getVisitNote = async (id: number | string | Record<string, unknown>): Promise<VisitNote> => {
  // Pages sometimes call the detail getter with a filter object; route that to the list endpoint.
  if (typeof id === 'object' && id !== null) return getVisitNoteList(id) as unknown as Promise<VisitNote>;
  const res = await api.get(`/visit-notes/${id}/`);
  return parseOr(VisitNoteSchema, res.data) as VisitNote;
};

// Create sends the fields a form holds; the server sets owner, status, totals and times, and validates.
export const createVisitNote = async (data: Partial<Omit<VisitNote, 'id'>>): Promise<VisitNote> => {
  const res = await api.post('/visit-notes/', data);
  return parseOr(VisitNoteSchema, res.data) as VisitNote;
};

export const updateVisitNote = async (id: number, data: Partial<VisitNote>): Promise<VisitNote> => {
  const res = await api.patch(`/visit-notes/${id}/`, data);
  return parseOr(VisitNoteSchema, res.data) as VisitNote;
};

export const deleteVisitNote = async (id: number) => {
  await api.delete(`/visit-notes/${id}/`);
};

// ── Prescription API ──
export const getPrescriptionList = async (params?: Record<string, unknown>): Promise<Prescription[]> => {
  const res = await api.get('/prescriptions/', params ? { params } : undefined);
  const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? res.data?.data ?? res.data?.items ?? res.data?.prescriptions ?? res.data?.prescriptions ?? []);
  // The interface is the strict type: a field name the API does not send is a compile error, not an unknown.
  return parseOr(z.array(PrescriptionSchema), data) as Prescription[];
};

export const getPrescription = async (id: number | string | Record<string, unknown>): Promise<Prescription> => {
  // Pages sometimes call the detail getter with a filter object; route that to the list endpoint.
  if (typeof id === 'object' && id !== null) return getPrescriptionList(id) as unknown as Promise<Prescription>;
  const res = await api.get(`/prescriptions/${id}/`);
  return parseOr(PrescriptionSchema, res.data) as Prescription;
};

// Create sends the fields a form holds; the server sets owner, status, totals and times, and validates.
export const createPrescription = async (data: Partial<Omit<Prescription, 'id'>>): Promise<Prescription> => {
  const res = await api.post('/prescriptions/', data);
  return parseOr(PrescriptionSchema, res.data) as Prescription;
};

export const updatePrescription = async (id: number, data: Partial<Prescription>): Promise<Prescription> => {
  const res = await api.patch(`/prescriptions/${id}/`, data);
  return parseOr(PrescriptionSchema, res.data) as Prescription;
};

export const deletePrescription = async (id: number) => {
  await api.delete(`/prescriptions/${id}/`);
};

// ── Bill API ──
export const getBillList = async (params?: Record<string, unknown>): Promise<Bill[]> => {
  const res = await api.get('/bills/', params ? { params } : undefined);
  const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? res.data?.data ?? res.data?.items ?? res.data?.bills ?? res.data?.bills ?? []);
  // The interface is the strict type: a field name the API does not send is a compile error, not an unknown.
  return parseOr(z.array(BillSchema), data) as Bill[];
};

export const getBill = async (id: number | string | Record<string, unknown>): Promise<Bill> => {
  // Pages sometimes call the detail getter with a filter object; route that to the list endpoint.
  if (typeof id === 'object' && id !== null) return getBillList(id) as unknown as Promise<Bill>;
  const res = await api.get(`/bills/${id}/`);
  return parseOr(BillSchema, res.data) as Bill;
};

// Create sends the fields a form holds; the server sets owner, status, totals and times, and validates.
export const createBill = async (data: Partial<Omit<Bill, 'id'>>): Promise<Bill> => {
  const res = await api.post('/bills/', data);
  return parseOr(BillSchema, res.data) as Bill;
};

export const updateBill = async (id: number, data: Partial<Bill>): Promise<Bill> => {
  const res = await api.patch(`/bills/${id}/`, data);
  return parseOr(BillSchema, res.data) as Bill;
};

export const deleteBill = async (id: number) => {
  await api.delete(`/bills/${id}/`);
};

// ── Document API ──
export const getDocumentList = async (params?: Record<string, unknown>): Promise<Document[]> => {
  const res = await api.get('/documents/', params ? { params } : undefined);
  const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? res.data?.data ?? res.data?.items ?? res.data?.documents ?? res.data?.documents ?? []);
  // The interface is the strict type: a field name the API does not send is a compile error, not an unknown.
  return parseOr(z.array(DocumentSchema), data) as Document[];
};

export const getDocument = async (id: number | string | Record<string, unknown>): Promise<Document> => {
  // Pages sometimes call the detail getter with a filter object; route that to the list endpoint.
  if (typeof id === 'object' && id !== null) return getDocumentList(id) as unknown as Promise<Document>;
  const res = await api.get(`/documents/${id}/`);
  return parseOr(DocumentSchema, res.data) as Document;
};

// Create sends the fields a form holds; the server sets owner, status, totals and times, and validates.
export const createDocument = async (data: Partial<Omit<Document, 'id'>>): Promise<Document> => {
  const res = await api.post('/documents/', data);
  return parseOr(DocumentSchema, res.data) as Document;
};

export const updateDocument = async (id: number, data: Partial<Document>): Promise<Document> => {
  const res = await api.patch(`/documents/${id}/`, data);
  return parseOr(DocumentSchema, res.data) as Document;
};

export const deleteDocument = async (id: number) => {
  await api.delete(`/documents/${id}/`);
};


// Auth aliases — domain agents use varied naming conventions
export const loginUser = (email: string, password: string) => api.post('/auth/login/', { username: email, password });
export const registerUser = (userData: any) => api.post('/auth/register/', userData);
export const getCurrentUser = getProfile;
export const updateUserProfile = (data: Partial<any>) => api.patch('/auth/profile/', data);

export { api };
export default api;
