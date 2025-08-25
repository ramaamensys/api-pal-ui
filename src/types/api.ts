// API types based on Django backend models

export interface Doctor {
  id: number;
  practitioner_id: string;
  first_name: string;
  last_name: string;
  specialization: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface AvailabilitySlot {
  id: number;
  doctor: number;
  start: string; // ISO datetime string
  end: string;   // ISO datetime string
}

export interface Appointment {
  id: number;
  doctor: number;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  mode: 'AVAILABILITY' | 'ON_DEMAND';
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  availability_slot?: number | null;
  start: string; // ISO datetime string
  end: string;   // ISO datetime string
  notes: string;
  created_at: string; // ISO datetime string
}

export interface CreateAppointmentRequest {
  doctor: number;
  patient_name: string;
  patient_email?: string;
  patient_phone?: string;
  mode: 'AVAILABILITY' | 'ON_DEMAND';
  availability_slot?: number | null;
  start?: string;
  end?: string;
  notes?: string;
}

export interface DoctorFilters {
  specialization?: string;
  state?: string;
  search?: string;
}

export interface AppointmentFilters {
  doctor?: number;
  status?: string;
  mode?: string;
  search?: string;
}