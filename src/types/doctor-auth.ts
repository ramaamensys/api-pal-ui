// Doctor authentication types

export interface DoctorLoginRequest {
  email: string;
  password: string;
}

export interface DoctorLoginResponse {
  access_token: string;
  refresh_token: string;
  doctor: {
    id: number;
    practitioner_id: string;
    first_name: string;
    last_name: string;
    email: string;
    specialization: string;
  };
}

export interface DoctorAuthState {
  isAuthenticated: boolean;
  doctor: DoctorLoginResponse['doctor'] | null;
  token: string | null;
}

export interface AvailabilitySlotCreate {
  start: string; // ISO datetime
  end: string;   // ISO datetime
}