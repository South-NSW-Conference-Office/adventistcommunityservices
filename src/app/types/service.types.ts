// Service Location Types
export interface ServiceAddress {
  street?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
}

export interface ServiceCoordinates {
  lat: number;
  lng: number;
}

export interface ServiceLocation {
  label?: string;
  address?: ServiceAddress;
  coordinates?: ServiceCoordinates;
  isMobile?: boolean;
}

// Service Contact Types
export interface ServiceContactInfo {
  phone?: string;
  email?: string;
  website?: string;
}

// Service Eligibility Types
export interface ServiceEligibility {
  requirements?: string[];
  restrictions?: string[];
  ageRequirements?: {
    min?: number;
    max?: number;
  };
}

// Service Capacity Types
export interface ServiceCapacity {
  maxParticipants?: number;
  currentParticipants?: number;
}

// Service Image Types
export interface ServiceImage {
  url: string;
  key?: string;
  alt?: string;
}

export interface GalleryImage extends ServiceImage {
  thumbnailUrl?: string;
  thumbnailKey?: string;
  caption?: string;
  type?: 'image' | 'video';
}

// Service Scheduling Types
export interface ServiceTimeSlot {
  startTime: string;
  endTime: string;
}

export interface ServiceScheduleDay {
  dayOfWeek: number;
  timeSlots: ServiceTimeSlot[];
  isEnabled: boolean;
}

export interface ServiceWeeklySchedule {
  timezone?: string;
  schedule: ServiceScheduleDay[];
}

export interface ServiceScheduling {
  weeklySchedule?: ServiceWeeklySchedule;
  lastUpdated?: string;
}

// Service Related Entities
export interface ServiceTeam {
  _id: string;
  name: string;
  type?: string;
  category?: string;
}

export interface ServiceChurch {
  _id: string;
  name: string;
}

// Main Service Interface
export interface Service {
  _id: string;
  name: string;
  teamId?: ServiceTeam;
  churchId?: ServiceChurch;
  type?: string;
  descriptionShort?: string;
  descriptionLong?: string;
  status: 'active' | 'inactive' | 'archived';
  tags?: string[];
  locations?: ServiceLocation[];
  contactInfo?: ServiceContactInfo;
  eligibility?: ServiceEligibility;
  capacity?: ServiceCapacity;
  primaryImage?: ServiceImage;
  gallery?: GalleryImage[];
  availability?: 'always_open' | 'set_times' | 'set_events' | null;
  scheduling?: ServiceScheduling;
  hierarchyPath?: string;
  createdAt?: string;
  updatedAt?: string;
}

// API Response Types
export interface ServicesListResponse {
  success: boolean;
  count?: number;
  data: Service[];
}

export interface ServiceDetailResponse {
  success: boolean;
  data: Service;
}

export interface ServiceImagesResponse {
  success: boolean;
  banner: ServiceImage | null;
  gallery: GalleryImage[];
}

// Filter Parameters
export interface ServiceFilters {
  type?: string;
  church?: string;
  search?: string;
  lat?: number;
  lng?: number;
  radius?: number;
}
