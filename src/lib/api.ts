import type { 
  Doctor, 
  AvailabilitySlot, 
  Appointment, 
  CreateAppointmentRequest,
  DoctorFilters,
  AppointmentFilters 
} from '@/types/api';

const BASE_URL = 'http://localhost:8000/api'; // Update with your Django backend URL

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Doctor endpoints
  async getDoctors(filters?: DoctorFilters): Promise<Doctor[]> {
    const params = new URLSearchParams();
    if (filters?.specialization) params.append('specialization', filters.specialization);
    if (filters?.state) params.append('state', filters.state);
    if (filters?.search) params.append('search', filters.search);
    
    const query = params.toString();
    return this.request<Doctor[]>(`/doctors/${query ? `?${query}` : ''}`);
  }

  async getDoctor(id: number): Promise<Doctor> {
    return this.request<Doctor>(`/doctors/${id}/`);
  }

  async getDoctorAvailability(doctorId: number, date: string): Promise<AvailabilitySlot[]> {
    return this.request<AvailabilitySlot[]>(`/doctors/${doctorId}/availability/?date=${date}`);
  }

  // Appointment endpoints
  async getAppointments(filters?: AppointmentFilters): Promise<Appointment[]> {
    const params = new URLSearchParams();
    if (filters?.doctor) params.append('doctor', filters.doctor.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.mode) params.append('mode', filters.mode);
    if (filters?.search) params.append('search', filters.search);
    
    const query = params.toString();
    return this.request<Appointment[]>(`/appointments/${query ? `?${query}` : ''}`);
  }

  async createAppointment(data: CreateAppointmentRequest): Promise<Appointment> {
    return this.request<Appointment>('/appointments/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAppointment(id: number): Promise<Appointment> {
    return this.request<Appointment>(`/appointments/${id}/`);
  }

  async updateAppointment(id: number, data: Partial<CreateAppointmentRequest>): Promise<Appointment> {
    return this.request<Appointment>(`/appointments/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteAppointment(id: number): Promise<void> {
    return this.request<void>(`/appointments/${id}/`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();