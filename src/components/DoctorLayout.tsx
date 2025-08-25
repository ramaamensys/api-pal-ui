import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Stethoscope, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  Home,
  Clock
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDoctorAuthContext } from "@/hooks/useDoctorAuth";

interface DoctorLayoutProps {
  children: React.ReactNode;
}

export function DoctorLayout({ children }: DoctorLayoutProps) {
  const { doctor, logout } = useDoctorAuthContext();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/doctor/login');
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/doctor/dashboard',
      icon: Home,
    },
    {
      name: 'Appointments', 
      href: '/doctor/appointments',
      icon: Calendar,
    },
    {
      name: 'Availability',
      href: '/doctor/availability', 
      icon: Clock,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/doctor/dashboard" className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Doctor Portal</h1>
                <p className="text-xs text-muted-foreground">HealthCare Connect</p>
              </div>
            </Link>

            {/* Doctor Info & Actions */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  Dr. {doctor?.first_name} {doctor?.last_name}
                </p>
                <p className="text-xs text-muted-foreground">{doctor?.specialization}</p>
              </div>
              
              <Separator orientation="vertical" className="h-8" />
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Patient Site
                  </Link>
                </Button>
                
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-card border-r min-h-[calc(100vh-64px)]">
          <div className="p-6">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-soft'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-background">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}