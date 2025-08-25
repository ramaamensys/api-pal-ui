import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DoctorLayout } from "@/components/DoctorLayout";
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2,
  Save,
  CalendarPlus,
  CalendarX
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function DoctorAvailability() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [newSlot, setNewSlot] = useState({
    start: '',
    end: ''
  });

  // Mock availability data - replace with real API calls
  const [availableSlots, setAvailableSlots] = useState([
    {
      id: 1,
      start: "2024-01-15T09:00:00Z",
      end: "2024-01-15T09:30:00Z",
      isBooked: false
    },
    {
      id: 2, 
      start: "2024-01-15T10:00:00Z",
      end: "2024-01-15T10:30:00Z", 
      isBooked: true
    },
    {
      id: 3,
      start: "2024-01-15T11:00:00Z",
      end: "2024-01-15T11:30:00Z",
      isBooked: false
    },
    {
      id: 4,
      start: "2024-01-15T14:00:00Z", 
      end: "2024-01-15T14:30:00Z",
      isBooked: false
    }
  ]);

  const handleAddSlot = () => {
    if (!newSlot.start || !newSlot.end) {
      toast({
        title: "Invalid Time Slot",
        description: "Please select both start and end times.",
        variant: "destructive"
      });
      return;
    }

    if (newSlot.start >= newSlot.end) {
      toast({
        title: "Invalid Time Range", 
        description: "End time must be after start time.",
        variant: "destructive"
      });
      return;
    }

    // Create new slot with selected date
    const startDateTime = `${selectedDate}T${newSlot.start}:00Z`;
    const endDateTime = `${selectedDate}T${newSlot.end}:00Z`;

    const slot = {
      id: Date.now(), // Temporary ID
      start: startDateTime,
      end: endDateTime,
      isBooked: false
    };

    setAvailableSlots(prev => [...prev, slot].sort((a, b) => 
      new Date(a.start).getTime() - new Date(b.start).getTime()
    ));

    setNewSlot({ start: '', end: '' });

    toast({
      title: "Availability Added",
      description: "New time slot has been added successfully.",
    });

    // TODO: Make API call to save slot
    // apiClient.createAvailabilitySlot(slot)
  };

  const handleDeleteSlot = (slotId: number) => {
    const slot = availableSlots.find(s => s.id === slotId);
    
    if (slot?.isBooked) {
      toast({
        title: "Cannot Delete",
        description: "This slot has a confirmed appointment.",
        variant: "destructive"
      });
      return;
    }

    setAvailableSlots(prev => prev.filter(s => s.id !== slotId));
    
    toast({
      title: "Slot Deleted",
      description: "Availability slot has been removed.",
    });

    // TODO: Make API call to delete slot
    // apiClient.deleteAvailabilitySlot(slotId)
  };

  const generateQuickSlots = () => {
    const date = selectedDate;
    const slots = [];
    
    // Generate 30-minute slots from 9 AM to 5 PM
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const start = `${date}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00Z`;
        const endHour = minute === 30 ? hour + 1 : hour;
        const endMinute = minute === 30 ? 0 : 30;
        const end = `${date}T${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}:00Z`;
        
        slots.push({
          id: Date.now() + slots.length,
          start,
          end,
          isBooked: false
        });
      }
    }

    setAvailableSlots(prev => {
      const existingTimes = new Set(prev.map(s => s.start));
      const newSlots = slots.filter(s => !existingTimes.has(s.start));
      return [...prev, ...newSlots].sort((a, b) => 
        new Date(a.start).getTime() - new Date(b.start).getTime()
      );
    });

    toast({
      title: "Quick Slots Generated", 
      description: `Added ${slots.length} time slots for the selected day.`,
    });
  };

  const formatTime = (datetime: string) => {
    return format(new Date(datetime), 'h:mm a');
  };

  const filteredSlots = availableSlots.filter(slot => 
    slot.start.startsWith(selectedDate)
  );

  return (
    <DoctorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Availability</h1>
            <p className="text-muted-foreground mt-2">
              Set your available time slots for patient appointments
            </p>
          </div>
          <Button variant="medical" onClick={generateQuickSlots}>
            <CalendarPlus className="h-4 w-4 mr-2" />
            Generate Daily Slots
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add New Slot */}
          <div className="lg:col-span-1">
            <Card className="shadow-soft border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Add Time Slot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date Selection */}
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="mt-1"
                  />
                </div>

                {/* Start Time */}
                <div>
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={newSlot.start}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, start: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                {/* End Time */}
                <div>
                  <Label htmlFor="end-time">End Time</Label>
                  <Input
                    id="end-time"
                    type="time" 
                    value={newSlot.end}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, end: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <Button 
                  onClick={handleAddSlot} 
                  className="w-full" 
                  variant="medical"
                  disabled={!newSlot.start || !newSlot.end}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Add Slot
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Available Slots */}
          <div className="lg:col-span-2">
            <Card className="shadow-soft border-0">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Slots for {format(new Date(selectedDate), 'EEEE, MMM dd, yyyy')}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {filteredSlots.length} total slots
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredSlots.length > 0 ? (
                  <div className="space-y-3">
                    {filteredSlots.map((slot) => (
                      <div key={slot.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-soft transition-shadow">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="font-medium">
                              {formatTime(slot.start)} - {formatTime(slot.end)}
                            </span>
                          </div>
                          
                          <Badge variant={slot.isBooked ? "destructive" : "secondary"}>
                            {slot.isBooked ? "Booked" : "Available"}
                          </Badge>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSlot(slot.id)}
                          disabled={slot.isBooked}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <CalendarX className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Slots Available</h3>
                    <p className="text-muted-foreground mb-4">
                      No time slots are set for {format(new Date(selectedDate), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Use the form on the left to add individual slots or click "Generate Daily Slots" for quick setup.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}