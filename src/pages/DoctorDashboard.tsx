import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DoctorLayout } from "@/components/DoctorLayout";
import { 
  Calendar, 
  Users, 
  Clock, 
  TrendingUp,
  CalendarCheck,
  CalendarX,
  CalendarPlus
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDoctorAuth } from "@/hooks/useDoctorAuth";

export default function DoctorDashboard() {
  const { doctor } = useDoctorAuth();

  // Mock data - replace with real API calls
  const stats = [
    {
      title: "Today's Appointments",
      value: "8",
      change: "+2 from yesterday",
      icon: Calendar,
      variant: "primary" as const
    },
    {
      title: "This Week",
      value: "32",
      change: "+12% from last week", 
      icon: CalendarCheck,
      variant: "success" as const
    },
    {
      title: "Available Slots",
      value: "15",
      change: "Next 7 days",
      icon: Clock,
      variant: "warning" as const
    },
    {
      title: "Total Patients",
      value: "156",
      change: "+8 this month",
      icon: Users,
      variant: "accent" as const
    }
  ];

  const todayAppointments = [
    {
      id: 1,
      time: "09:00 AM",
      patient: "John Davis",
      type: "AVAILABILITY",
      status: "CONFIRMED"
    },
    {
      id: 2, 
      time: "10:30 AM",
      patient: "Sarah Wilson",
      type: "ON_DEMAND",
      status: "PENDING"
    },
    {
      id: 3,
      time: "02:00 PM", 
      patient: "Michael Brown",
      type: "AVAILABILITY",
      status: "CONFIRMED"
    },
    {
      id: 4,
      time: "03:30 PM",
      patient: "Emma Johnson",
      type: "AVAILABILITY", 
      status: "CONFIRMED"
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

  return (
    <DoctorLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, Dr. {doctor?.last_name}!
            </h1>
            <p className="text-muted-foreground mt-2">
              Here's what's happening with your practice today
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/doctor/availability">
                <CalendarPlus className="h-4 w-4 mr-2" />
                Add Availability
              </Link>
            </Button>
            <Button variant="medical" asChild>
              <Link to="/doctor/appointments">
                <Calendar className="h-4 w-4 mr-2" />
                View All Appointments
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-soft border-0 bg-gradient-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <div className="flex items-baseline gap-2 mt-2">
                        <p className="text-2xl font-bold text-foreground">
                          {stat.value}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full bg-${stat.variant}/10`}>
                      <Icon className={`h-6 w-6 text-${stat.variant}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Today's Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appointments List */}
          <div className="lg:col-span-2">
            <Card className="shadow-soft border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {todayAppointments.length > 0 ? (
                  todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-sm font-medium text-foreground">
                            {appointment.time}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {appointment.patient}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {appointment.type}
                            </Badge>
                            <Badge variant={getStatusVariant(appointment.status) as any} className="text-xs">
                              {appointment.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarX className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No appointments scheduled for today</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="shadow-soft border-0">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/doctor/availability">
                    <Clock className="h-4 w-4 mr-2" />
                    Manage Availability
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/doctor/appointments">
                    <Users className="h-4 w-4 mr-2" />
                    View Appointments
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Profile Summary */}
            <Card className="shadow-soft border-0 mt-6">
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Specialization:</span>
                    <p className="text-muted-foreground">{doctor?.specialization}</p>
                  </div>
                  <div>
                    <span className="font-medium">Practitioner ID:</span>
                    <p className="text-muted-foreground">{doctor?.practitioner_id}</p>
                  </div>
                  <Button variant="link" size="sm" className="p-0 h-auto mt-3">
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}