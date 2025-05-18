import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Shelter } from '../types';


export type FilterState = {
  rating: string;
  hours: string;
  distance: string;
  additionalFilters: string[];
};

// context type
type FilterContextType = {
  filters: FilterState;
  setRatingFilter: (rating: string) => void;
  setHoursFilter: (hours: string) => void;
  setDistanceFilter: (distance: string) => void;
  toggleAdditionalFilter: (filter: string) => void;
  applyFilters: (shelters: Shelter[]) => Shelter[];
};

// default context vals
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// filter provider component
export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>({
    rating: 'Any',
    hours: 'Any',
    distance: 'Any',
    additionalFilters: [],
  });

  const setRatingFilter = (rating: string) => {
    setFilters((prev) => ({ ...prev, rating }));
  };

  const setHoursFilter = (hours: string) => {
    setFilters((prev) => ({ ...prev, hours }));
  };

  const setDistanceFilter = (distance: string) => {
    setFilters((prev) => ({ ...prev, distance }));
  };

  const toggleAdditionalFilter = (filter: string) => {
    setFilters((prev) => {
      if (prev.additionalFilters.includes(filter)) {
        return {
          ...prev,
          additionalFilters: prev.additionalFilters.filter((item) => item !== filter),
        };
      } else {
        return {
          ...prev,
          additionalFilters: [...prev.additionalFilters, filter],
        };
      }
    });
  };

  // Function to apply all filters to a list of shelters
  const applyFilters = (shelters: Shelter[]): Shelter[] => {
    return shelters.filter((shelter) => {
      if (filters.rating !== 'Any') {
        const minRating = parseFloat(filters.rating.replace('+', ''));
        if (!shelter.rating || shelter.rating < minRating) {
          return false;
        }
      }

      if (filters.hours === 'Open now') {
        const now = new Date();
        const currentDay = now.getDay();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        const dayOfWeek = currentDay === 0 ? 'Sunday' : 
                         currentDay === 1 ? 'Monday' :
                         currentDay === 2 ? 'Tuesday' :
                         currentDay === 3 ? 'Wednesday' :
                         currentDay === 4 ? 'Thursday' :
                         currentDay === 5 ? 'Friday' : 'Saturday';
        
        const dayHours = shelter.hours[dayOfWeek];
        if (!dayHours) {
          return false;
        }
        
        const [openingHour, openingMinute] = dayHours.opening_time.split(':').map(Number);
        const [closingHour, closingMinute] = dayHours.closing_time.split(':').map(Number);
        
        const openingTimeInMinutes = openingHour * 60 + openingMinute;
        const closingTimeInMinutes = closingHour * 60 + closingMinute;
        
        if (currentTime < openingTimeInMinutes || currentTime > closingTimeInMinutes) {
          return false;
        }
      }

      /* 

      still need to do distance filter


      */


      
      if (filters.additionalFilters.length > 0) {
        const filterToTagMap: Record<string, keyof Shelter['tags']> = {
          'Wheelchair accessible': 'wheelchair_accessible',
          'Pet Friendly': 'pet_friendly',
          'Family Friendly': 'family_friendly',
          'Legal aids available': 'legal_aid',
          'LGBTQ+ focus': 'lgbtq_focused',
          'Mental Health Resources': 'mental_health_resources',
          'Overnight stay': 'overnight_stay',
          'Food Resources': 'food_resources',
          'Clothing Resources': 'clothing_resources',
          'Transportation Resources': 'transportation_resources',
          'Hygiene Facilities': 'hygiene_facilities',
          'Job Assistance': 'job_assistance',
          'Medical Resources': 'medical_resources',
          'Educational Programs': 'educational_programs',
          'Substance Abuse Support': 'substance_abuse_support',
        };
        
        for (const filter of filters.additionalFilters) {
          const tagKey = filterToTagMap[filter];
          if (!tagKey || !shelter.tags[tagKey]) {
            return false;
          }
        }
      }
      
      return true;
    });
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        setRatingFilter,
        setHoursFilter,
        setDistanceFilter,
        toggleAdditionalFilter,
        applyFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

// custom hook to use filters
export const useFilters = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}; 