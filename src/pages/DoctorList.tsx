import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { DoctorCard } from "@/components/DoctorCard";
import { DoctorSearch } from "@/components/DoctorSearch";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, AlertCircle, Stethoscope, MapPin, ArrowLeft, Calendar } from "lucide-react";
import { apiClient } from "@/lib/api";
import type { DoctorFilters } from "@/types/api";

export default function DoctorList() {
  const [filters, setFilters] = useState<DoctorFilters>({});

  const {
    data: doctors = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['doctors', filters],
    queryFn: () => apiClient.getDoctors(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleFiltersChange = (newFilters: DoctorFilters) => {
    setFilters(newFilters);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load doctors. Please check your backend connection.</span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <div className="bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left - Back to Home */}
            <Button 
              variant="ghost" 
              asChild
              className="text-primary-foreground hover:bg-primary-foreground/10 font-semibold"
            >
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            
            {/* Right - My Appointments */}
            <Button 
              variant="outline"
              asChild
              className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold"
            >
              <Link to="/appointments" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                My Appointments
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 pb-12">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Stethoscope className="h-10 w-10" />
              <h1 className="text-4xl font-bold">Find Your Doctor</h1>
            </div>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Search and book appointments with qualified healthcare professionals in your area
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <DoctorSearch 
            filters={filters} 
            onFiltersChange={handleFiltersChange}
            isLoading={isLoading}
          />
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">
                {isLoading ? 'Searching...' : `${doctors.length} Doctors Found`}
              </h2>
            </div>

            {/* Active Filters Display */}
            {(filters.specialization || filters.state || filters.search) && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Filtered by:</span>
                {filters.specialization && (
                  <span className="flex items-center gap-1">
                    <Stethoscope className="h-3 w-3" />
                    {filters.specialization}
                  </span>
                )}
                {filters.state && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {filters.state}
                  </span>
                )}
                {filters.search && (
                  <span className="italic">"{filters.search}"</span>
                )}
              </div>
            )}
          </div>

          {/* Doctors Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4 p-6 border rounded-lg">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 flex-1" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : doctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto space-y-4">
                <Users className="h-16 w-16 mx-auto text-muted-foreground/50" />
                <h3 className="text-xl font-semibold text-foreground">No Doctors Found</h3>
                <p className="text-muted-foreground">
                  No doctors match your current search criteria. Try adjusting your filters or search terms.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setFilters({})}
                  className="mt-4"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}