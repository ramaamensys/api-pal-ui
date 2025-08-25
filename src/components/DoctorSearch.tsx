import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MapPin, Stethoscope } from "lucide-react";
import type { DoctorFilters } from "@/types/api";

interface DoctorSearchProps {
  filters: DoctorFilters;
  onFiltersChange: (filters: DoctorFilters) => void;
  isLoading?: boolean;
}

const SPECIALIZATIONS = [
  "Cardiology",
  "Dermatology", 
  "Emergency Medicine",
  "Family Medicine",
  "Internal Medicine",
  "Neurology",
  "Obstetrics & Gynecology",
  "Orthopedic Surgery",
  "Pediatrics",
  "Psychiatry",
  "Radiology",
  "Surgery"
];

const STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

export function DoctorSearch({ filters, onFiltersChange, isLoading }: DoctorSearchProps) {
  const [localSearch, setLocalSearch] = useState(filters.search || "");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, search: localSearch || undefined });
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch]);

  const handleSpecializationChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      specialization: value === "all" ? undefined : value 
    });
  };

  const handleStateChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      state: value === "all" ? undefined : value 
    });
  };

  const clearFilters = () => {
    setLocalSearch("");
    onFiltersChange({});
  };

  const hasActiveFilters = filters.search || filters.specialization || filters.state;

  return (
    <div className="bg-card rounded-xl p-6 shadow-soft border-0">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search doctors by name..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
        </div>

        {/* Specialization Filter */}
        <div className="lg:w-64">
          <Select 
            value={filters.specialization || "all"} 
            onValueChange={handleSpecializationChange}
            disabled={isLoading}
          >
            <SelectTrigger>
              <Stethoscope className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Specialization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>
              {SPECIALIZATIONS.map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* State Filter */}
        <div className="lg:w-48">
          <Select 
            value={filters.state || "all"} 
            onValueChange={handleStateChange}
            disabled={isLoading}
          >
            <SelectTrigger>
              <MapPin className="h-4 w-4 mr-2" />
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {STATES.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            onClick={clearFilters}
            disabled={isLoading}
            className="lg:w-auto"
          >
            <Filter className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}