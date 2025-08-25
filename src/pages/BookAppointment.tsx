import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppointmentBooking } from "@/components/AppointmentBooking";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api";
import type { CreateAppointmentRequest } from "@/types/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function BookAppointment() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const {
    data: doctor,
    isLoading: doctorLoading,
    error: doctorError
  } = useQuery({
    queryKey: ['doctor', doctorId],
    queryFn: () => apiClient.getDoctor(Number(doctorId)),
    enabled: !!doctorId,
  });

  const {
    data: availableSlots = [],
    isLoading: slotsLoading,
    error: slotsError
  } = useQuery({
    queryKey: ['doctor-availability', doctorId, selectedDate],
    queryFn: () => apiClient.getDoctorAvailability(Number(doctorId), selectedDate),
    enabled: !!doctorId,
  });

  const createAppointmentMutation = useMutation({
    mutationFn: (data: CreateAppointmentRequest) => apiClient.createAppointment(data),
    onSuccess: (appointment) => {
      toast({
        title: "Appointment Booked Successfully!",
        description: `Your appointment with Dr. ${doctor?.first_name} ${doctor?.last_name} has been confirmed.`,
        duration: 5000,
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['doctor-availability'] });
      
      // Navigate to appointment confirmation or list
      navigate('/appointments', { 
        state: { newAppointment: appointment }
      });
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book appointment. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  });

  const handleAppointmentSubmit = (appointmentData: CreateAppointmentRequest) => {
    createAppointmentMutation.mutate(appointmentData);
  };

  if (doctorError || slotsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load doctor information. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (doctorLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-4">Doctor Not Found</h2>
          <Button onClick={() => navigate('/doctors')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Doctors
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/doctors')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Doctors
            </Button>
          </div>

          {/* Date Selection */}
          <Card className="shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Select Date for Available Slots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="px-3 py-2 border border-input rounded-md bg-background"
                />
                {slotsLoading && (
                  <span className="text-sm text-muted-foreground">Loading slots...</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <AppointmentBooking
            doctor={doctor}
            availableSlots={availableSlots}
            onSubmit={handleAppointmentSubmit}
            isSubmitting={createAppointmentMutation.isPending}
          />

          {/* Success State */}
          {createAppointmentMutation.isSuccess && (
            <Alert className="border-success bg-success/10">
              <CheckCircle className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">
                Your appointment has been successfully booked! You will receive a confirmation shortly.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}