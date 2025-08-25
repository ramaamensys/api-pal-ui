import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import type { DoctorAuthState, DoctorLoginRequest } from '@/types/doctor-auth';

// Context for doctor authentication
const DoctorAuthContext = createContext<{
  isAuthenticated: boolean;
  doctor: any;
  token: string | null;
  login: (credentials: DoctorLoginRequest) => Promise<boolean>;
  logout: () => void;
} | undefined>(undefined);

// Mock authentication - replace with real API calls
const MOCK_DOCTOR = {
  id: 1,
  practitioner_id: "DOC001",
  first_name: "John",
  last_name: "Smith", 
  email: "doctor@hospital.com",
  specialization: "Cardiology"
};

export function useDoctorAuth() {
  const [authState, setAuthState] = useState<DoctorAuthState>({
    isAuthenticated: false,
    doctor: null,
    token: null
  });

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('doctor_token');
    const doctorData = localStorage.getItem('doctor_data');
    
    if (token && doctorData) {
      try {
        const doctor = JSON.parse(doctorData);
        setAuthState({
          isAuthenticated: true,
          doctor,
          token
        });
      } catch (error) {
        // Invalid data, clear storage
        localStorage.removeItem('doctor_token');
        localStorage.removeItem('doctor_data');
      }
    }
  }, []);

  const login = async (credentials: DoctorLoginRequest): Promise<boolean> => {
    try {
      // Mock login - replace with real API call
      if (credentials.email === 'doctor@hospital.com' && credentials.password === 'password123') {
        const token = 'mock_jwt_token_' + Date.now();
        
        // Store in localStorage
        localStorage.setItem('doctor_token', token);
        localStorage.setItem('doctor_data', JSON.stringify(MOCK_DOCTOR));
        
        setAuthState({
          isAuthenticated: true,
          doctor: MOCK_DOCTOR,
          token
        });
        
        return true;
      }
      
      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('doctor_token');
    localStorage.removeItem('doctor_data');
    
    setAuthState({
      isAuthenticated: false,
      doctor: null,
      token: null
    });
  };

  return {
    ...authState,
    login,
    logout
  };
}

// Provider component
export function DoctorAuthProvider({ children }: { children: ReactNode }) {
  const auth = useDoctorAuth();
  
  return (
    <DoctorAuthContext.Provider value={auth}>
      {children}
    </DoctorAuthContext.Provider>
  );
}

// Hook to use doctor auth context
export function useDoctorAuthContext() {
  const context = useContext(DoctorAuthContext);
  if (context === undefined) {
    throw new Error('useDoctorAuthContext must be used within a DoctorAuthProvider');
  }
  return context;
}