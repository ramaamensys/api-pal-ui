import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DoctorLayout } from "@/components/DoctorLayout";
import { 
  Calendar, 
  Search, 
  Filter,
  Phone,
  Mail,
  FileText,
  Eye,
  MoreVertical,
  CalendarDays
} from "lucide-react";
import { format } from "date-fns";

export default function DoctorAppointments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");

  // Mock appointments data - replace with real API call
  const appointments = [
    {
      id: 1,
      patient_name: "John Davis",
      patient_email: "john.davis@email.com", 
      patient_phone: "+1 (555) 123-4567",
      mode: "AVAILABILITY",
      status: "CONFIRMED",
      start: "2024-01-15T09:00:00Z",
      end: "2024-01-15T09:30:00Z",
      notes: "Follow-up appointment for cardiology consultation",
      created_at: "2024-01-10T14:30:00Z"
    },
    {
      id: 2,
      patient_name: "Sarah Wilson",
      patient_email: "sarah.w@email.com",
      patient_phone: "+1 (555) 987-6543",
      mode: "ON_DEMAND", 
      status: "PENDING",
      start: "2024-01-15T10:30:00Z",
      end: "2024-01-15T11:00:00Z",
      notes: "Urgent consultation requested",
      created_at: "2024-01-14T09:15:00Z"
    },
    {
      id: 3,
      patient_name: "Michael Brown",
      patient_email: "m.brown@email.com",
      patient_phone: "+1 (555) 456-7890",
      mode: "AVAILABILITY",
      status: "CONFIRMED",
      start: "2024-01-15T14:00:00Z", 
      end: "2024-01-15T14:30:00Z",
      notes: "",
      created_at: "2024-01-12T16:20:00Z"
    },
    {
      id: 4,
      patient_name: "Emma Johnson",
      patient_email: "emma.johnson@email.com",
      patient_phone: "+1 (555) 321-0987",
      mode: "AVAILABILITY",
      status: "CANCELLED",
      start: "2024-01-14T11:00:00Z",
      end: "2024-01-14T11:30:00Z", 
      notes: "Patient requested cancellation",
      created_at: "2024-01-10T10:45:00Z"
    }
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'success';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'destructive';
      default: return 'secondary';
    }
  };

  const getModeColor = (mode: string) => {
    return mode === 'ON_DEMAND' ? 'text-accent' : 'text-primary';
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.patient_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesMode = modeFilter === 'all' || appointment.mode === modeFilter;
    
    return matchesSearch && matchesStatus && matchesMode;
  });

  const handleStatusUpdate = (appointmentId: number, newStatus: string) => {
    // TODO: Implement status update API call
    console.log('Update appointment', appointmentId, 'to status', newStatus);
  };

  return (
    <DoctorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
            <p className="text-muted-foreground mt-2">
              Manage and view your patient appointments
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Export Schedule
            </Button>
            <Button variant="medical">
              <CalendarDays className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="shadow-soft border-0">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="lg:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              {/* Mode Filter */}
              <Select value={modeFilter} onValueChange={setModeFilter}>
                <SelectTrigger className="lg:w-48">
                  <SelectValue placeholder="Filter by mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="AVAILABILITY">Available Slots</SelectItem>
                  <SelectItem value="ON_DEMAND">On Demand</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card className="shadow-soft border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {filteredAppointments.length} Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredAppointments.length > 0 ? (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-6 hover:shadow-soft transition-shadow">
                    <div className="flex items-start justify-between">
                      {/* Appointment Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">
                              {appointment.patient_name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={getStatusVariant(appointment.status) as any}>
                                {appointment.status}
                              </Badge>
                              <Badge variant="outline" className={getModeColor(appointment.mode)}>
                                {appointment.mode}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Date & Time */}
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="font-medium">
                              {format(new Date(appointment.start), 'EEEE, MMM dd, yyyy')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {format(new Date(appointment.start), 'h:mm a')} - {format(new Date(appointment.end), 'h:mm a')}
                            </span>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          {appointment.patient_email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <span>{appointment.patient_email}</span>
                            </div>
                          )}
                          {appointment.patient_phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span>{appointment.patient_phone}</span>
                            </div>
                          )}
                        </div>

                        {/* Notes */}
                        {appointment.notes && (
                          <div className="flex items-start gap-2 text-sm">
                            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <span className="text-muted-foreground">{appointment.notes}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {appointment.status === 'PENDING' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="success"
                              onClick={() => handleStatusUpdate(appointment.id, 'CONFIRMED')}
                            >
                              Confirm
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleStatusUpdate(appointment.id, 'CANCELLED')}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Appointments Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== 'all' || modeFilter !== 'all' 
                    ? "No appointments match your current filters."
                    : "You don't have any appointments scheduled yet."
                  }
                </p>
                {(searchTerm || statusFilter !== 'all' || modeFilter !== 'all') && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setModeFilter("all");
                    }}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DoctorLayout>
  );
}