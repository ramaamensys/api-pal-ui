import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Calendar } from "lucide-react";
import type { Doctor } from "@/types/api";
import { useNavigate } from "react-router-dom";

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const navigate = useNavigate();
  
  const fullName = `Dr. ${doctor.first_name} ${doctor.last_name}`;
  const location = [doctor.city, doctor.state].filter(Boolean).join(", ");

  const handleBookAppointment = () => {
    navigate(`/doctors/${doctor.id}/book`);
  };

  const handleViewProfile = () => {
    navigate(`/doctors/${doctor.id}`);
  };

  return (
    <Card className="group hover:shadow-medical transition-all duration-300 bg-gradient-card border-0 overflow-hidden">
      <CardContent className="p-6">
        {/* Doctor Info */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              {fullName}
            </h3>
            <Badge variant="secondary" className="mt-2">
              {doctor.specialization}
            </Badge>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 text-sm text-muted-foreground">
            {location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{location}</span>
              </div>
            )}
            
            {doctor.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>{doctor.phone}</span>
              </div>
            )}
            
            {doctor.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="truncate">{doctor.email}</span>
              </div>
            )}
          </div>

          {/* Address */}
          {doctor.address && (
            <div className="text-sm text-muted-foreground">
              <p className="truncate">{doctor.address}</p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex gap-3">
        <Button 
          variant="medical" 
          size="sm" 
          className="flex-1"
          onClick={handleBookAppointment}
        >
          <Calendar className="h-4 w-4" />
          Book Appointment
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleViewProfile}
        >
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
}