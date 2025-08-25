import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import DoctorList from "./pages/DoctorList";
import BookAppointment from "./pages/BookAppointment";
import PatientAppointments from "./pages/PatientAppointments";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorAvailability from "./pages/DoctorAvailability";
import NotFound from "./pages/NotFound";
import { useDoctorAuth } from "./hooks/useDoctorAuth";

const queryClient = new QueryClient();

// Protected Route Component for Doctor Portal
function ProtectedDoctorRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useDoctorAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/doctor/login" replace />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Patient Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/doctors" element={<DoctorList />} />
            <Route path="/doctors/:doctorId/book" element={<BookAppointment />} />
            <Route path="/appointments" element={<PatientAppointments />} />
            
            {/* Doctor Routes */}
            <Route path="/doctor/login" element={<DoctorLogin />} />
            <Route path="/doctor/dashboard" element={
              <ProtectedDoctorRoute>
                <DoctorDashboard />
              </ProtectedDoctorRoute>
            } />
            <Route path="/doctor/appointments" element={
              <ProtectedDoctorRoute>
                <DoctorAppointments />
              </ProtectedDoctorRoute>
            } />
            <Route path="/doctor/availability" element={
              <ProtectedDoctorRoute>
                <DoctorAvailability />
              </ProtectedDoctorRoute>
            } />
            
            {/* Redirect /doctor to dashboard */}
            <Route path="/doctor" element={<Navigate to="/doctor/dashboard" replace />} />
            
            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </QueryClientProvider>
  );
}

export default App;