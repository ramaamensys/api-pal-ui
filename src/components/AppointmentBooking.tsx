import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Mail, Phone, FileText, CheckCircle } from "lucide-react";
import type { Doctor, AvailabilitySlot, CreateAppointmentRequest } from "@/types/api";
import { format } from "date-fns";

interface AppointmentBookingProps {
  doctor: Doctor;
  availableSlots?: AvailabilitySlot[];
  onSubmit: (appointment: CreateAppointmentRequest) => void;
  isSubmitting?: boolean;
}

export function AppointmentBooking({ 
  doctor, 
  availableSlots = [], 
  onSubmit, 
  isSubmitting = false 
}: AppointmentBookingProps) {
  const [mode, setMode] = useState<'AVAILABILITY' | 'ON_DEMAND'>('AVAILABILITY');
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_email: '',
    patient_phone: '',
    notes: ''
  });

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSlotSelect = (slot: AvailabilitySlot) => {
    setSelectedSlot(selectedSlot?.id === slot.id ? null : slot);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patient_name.trim()) return;
    
    if (mode === 'AVAILABILITY' && !selectedSlot) return;
    if (mode === 'ON_DEMAND' && (!customStart || !customEnd)) return;

    const appointmentData: CreateAppointmentRequest = {
      doctor: doctor.id,
      patient_name: formData.patient_name.trim(),
      patient_email: formData.patient_email.trim() || undefined,
      patient_phone: formData.patient_phone.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      mode,
      ...(mode === 'AVAILABILITY' && selectedSlot 
        ? { availability_slot: selectedSlot.id }
        : { start: customStart, end: customEnd }
      )
    };

    onSubmit(appointmentData);
  };

  const formatSlotTime = (slot: AvailabilitySlot) => {
    const start = new Date(slot.start);
    const end = new Date(slot.end);
    return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
  };

  const isFormValid = formData.patient_name.trim() && 
    ((mode === 'AVAILABILITY' && selectedSlot) || 
     (mode === 'ON_DEMAND' && customStart && customEnd));

  return (
    <Card className="shadow-medical border-0">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          Book Appointment with Dr. {doctor.first_name} {doctor.last_name}
        </CardTitle>
        <Badge variant="secondary" className="w-fit">
          {doctor.specialization}
        </Badge>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Booking Mode Selection */}
          <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="AVAILABILITY" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Available Slots
              </TabsTrigger>
              <TabsTrigger value="ON_DEMAND" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Custom Time
              </TabsTrigger>
            </TabsList>

            <TabsContent value="AVAILABILITY" className="space-y-4">
              <div>
                <Label className="text-base font-medium">Select an available time slot:</Label>
                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot.id}
                        type="button"
                        variant={selectedSlot?.id === slot.id ? "medical" : "outline"}
                        className="p-4 h-auto flex flex-col items-start"
                        onClick={() => handleSlotSelect(slot)}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">{formatSlotTime(slot)}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(slot.start), 'EEEE, MMM dd')}
                        </span>
                        {selectedSlot?.id === slot.id && (
                          <CheckCircle className="h-4 w-4 text-primary-foreground ml-auto" />
                        )}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No available slots found for this doctor.</p>
                    <p className="text-sm">Try selecting a different date or use custom time.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="ON_DEMAND" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input
                    id="start-time"
                    type="datetime-local"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="end-time">End Time</Label>
                  <Input
                    id="end-time"
                    type="datetime-local"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Patient Information */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Patient Information</Label>
            
            <div>
              <Label htmlFor="patient-name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name *
              </Label>
              <Input
                id="patient-name"
                type="text"
                value={formData.patient_name}
                onChange={(e) => handleFormChange('patient_name', e.target.value)}
                placeholder="Enter your full name"
                className="mt-1"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patient-email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="patient-email"
                  type="email"
                  value={formData.patient_email}
                  onChange={(e) => handleFormChange('patient_email', e.target.value)}
                  placeholder="your.email@example.com"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="patient-phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone
                </Label>
                <Input
                  id="patient-phone"
                  type="tel"
                  value={formData.patient_phone}
                  onChange={(e) => handleFormChange('patient_phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Additional Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
                placeholder="Any additional information or special requests..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              variant="medical" 
              size="lg"
              disabled={!isFormValid || isSubmitting}
              className="min-w-[200px]"
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Book Appointment
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}