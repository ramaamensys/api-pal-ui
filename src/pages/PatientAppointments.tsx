import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { format } from "date-fns";
import type { Appointment, Doctor } from "@/types/api";

export default function PatientAppointments() {
  const navigate = useNavigate();
  const location = useLocation();
  const newAppointment = location.state?.newAppointment as Appointment | undefined;

  const {
    data: appointments = [],
    isLoading: appointmentsLoading,
    error: appointmentsError
  } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => apiClient.getAppointments(),
  });

  // Get unique doctor IDs from appointments
  const doctorIds = [...new Set(appointments.map(apt => apt.doctor))];

  const {
    data: doctors = [],
    isLoading: doctorsLoading,
    error: doctorsError
  } = useQuery({
    queryKey: ['doctors-batch', doctorIds],
    queryFn: async () => {
      const doctorPromises = doctorIds.map(id => apiClient.getDoctor(id));
      return Promise.all(doctorPromises);
    },
    enabled: doctorIds.length > 0,
  });

  // Create a map of doctor ID to doctor object for easy lookup
  const doctorMap = doctors.reduce((acc: Record<number, Doctor>, doctor) => {
    acc[doctor.id] = doctor;
    return acc;
  }, {});

  const isLoading = appointmentsLoading || doctorsLoading;
  const error = appointmentsError || doctorsError;

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load appointments. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/doctors')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Doctors
              </Button>
              <h1 className="text-3xl font-bold">My Appointments</h1>
            </div>
          </div>

          {/* New Appointment Success Alert */}
          {newAppointment && (
            <Alert className="border-success bg-success/10">
              <CheckCircle className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">
                <strong>Appointment booked successfully!</strong> Your appointment has been added to the list below.
              </AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          )}

          {/* Appointments List */}
          {!isLoading && appointments.length === 0 && (
            <Card className="shadow-soft border-0">
              <CardContent className="text-center py-16">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No Appointments Yet</h2>
                <p className="text-muted-foreground mb-6">
                  You haven't booked any appointments yet. Find a doctor to get started.
                </p>
                <Button onClick={() => navigate('/doctors')}>
                  Browse Doctors
                </Button>
              </CardContent>
            </Card>
          )}

          {appointments.map((appointment) => {
            const doctor = doctorMap[appointment.doctor];
            if (!doctor) return null;
            
            return (
            <Card key={appointment.id} className="shadow-soft border-0">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Dr. {doctor.first_name} {doctor.last_name}
                  </CardTitle>
                  <Badge variant={getStatusVariant(appointment.status)} className="flex items-center gap-1">
                    {getStatusIcon(appointment.status)}
                    {appointment.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {doctor.specialization}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {format(new Date(appointment.start), 'EEEE, MMMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {format(new Date(appointment.start), 'h:mm a')} - {format(new Date(appointment.end), 'h:mm a')}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{appointment.patient_name}</span>
                    </div>
                    {appointment.patient_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{appointment.patient_phone}</span>
                      </div>
                    )}
                    {appointment.patient_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{appointment.patient_email}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {appointment.notes && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">
                      <strong>Notes:</strong> {appointment.notes}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    Mode: {appointment.mode === 'AVAILABILITY' ? 'Scheduled Slot' : 'Custom Time'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Booked: {format(new Date(appointment.created_at), 'MMM d, yyyy')}
                  </div>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}