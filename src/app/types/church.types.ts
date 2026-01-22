// Church Image Types
export interface ChurchImage {
  url: string;
  key?: string;
  alt?: string;
  thumbnailUrl?: string;
}

// Church Leader Types
export interface ChurchLeader {
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  responsibilities?: string[];
}

// Church Address Types
export interface ChurchAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

// Church Coordinates
export interface ChurchCoordinates {
  latitude: number;
  longitude: number;
}

// Church Location
export interface ChurchLocation {
  address: ChurchAddress;
  coordinates?: ChurchCoordinates;
  timezone?: string;
}

// Church Contact Info
export interface ChurchContact {
  email?: string;
  phone?: string;
  website?: string;
  mailingAddress?: ChurchAddress;
}

// Church Leadership
export interface ChurchLeadership {
  associatePastors: ChurchLeader[];
  acsCoordinator?: ChurchLeader;
  firstElder?: ChurchLeader;
  clerk?: ChurchLeader;
  treasurer?: ChurchLeader;
}

// Church Facilities
export interface ChurchSanctuary {
  capacity?: number;
  hasAV?: boolean;
  hasAccessibility?: boolean;
}

export interface ChurchClassroom {
  name?: string;
  capacity?: number;
  purpose?: string;
}

export interface ChurchKitchen {
  available?: boolean;
  capacity?: number;
  equipment?: string[];
}

export interface ChurchParking {
  spaces?: number;
  handicapSpaces?: number;
}

export interface ChurchFacilities {
  sanctuary?: ChurchSanctuary;
  classrooms?: ChurchClassroom[];
  kitchen?: ChurchKitchen;
  parking?: ChurchParking;
  other?: string[];
}

// Church Service Schedule
export interface ChurchServiceTime {
  time?: string;
  description?: string;
  day?: string;
}

export interface ChurchSpecialService {
  name?: string;
  schedule?: string;
  description?: string;
}

export interface ChurchServices {
  sabbathSchool?: ChurchServiceTime;
  worship?: ChurchServiceTime;
  prayerMeeting?: ChurchServiceTime;
  vespers?: ChurchServiceTime;
  special?: ChurchSpecialService[];
}

// Church Outreach
export type OutreachFocusType =
  | 'food_assistance'
  | 'clothing'
  | 'health_services'
  | 'education'
  | 'disaster_relief'
  | 'community_development'
  | 'family_services';

export interface ChurchServiceArea {
  radius?: number;
  communities?: string[];
  specialPopulations?: string[];
}

export interface ChurchPartnership {
  organization?: string;
  type?: string;
  contactPerson?: string;
  relationship?: string;
}

export interface ChurchOutreach {
  primaryFocus?: OutreachFocusType[];
  serviceArea?: ChurchServiceArea;
  partnerships?: ChurchPartnership[];
}

// Church Settings
export interface ChurchServiceLanguage {
  language?: string;
  isPrimary?: boolean;
  serviceTypes?: string[];
}

export interface ChurchACSOperatingHours {
  day?: string;
  open?: string;
  close?: string;
}

export interface ChurchACSSettings {
  operatingHours?: ChurchACSOperatingHours[];
  specialRequirements?: string[];
  volunteerCoordinator?: string;
}

export interface ChurchSettings {
  serviceLanguages?: ChurchServiceLanguage[];
  acsSettings?: ChurchACSSettings;
}

// Church Metadata
export interface ChurchMetadata {
  teamCount: number;
  serviceCount: number;
  lastReport?: string;
  lastVisit?: string;
  lastUpdated?: string;
}

// Conference Reference
export interface ChurchConference {
  _id: string;
  name: string;
  code?: string;
}

// Main Church Interface
export interface Church {
  _id: string;
  name: string;
  code?: string;
  conferenceId: string | ChurchConference;
  hierarchyPath: string;
  hierarchyLevel: number;
  location: ChurchLocation;
  contact: ChurchContact;
  leadership: ChurchLeadership;
  primaryImage?: ChurchImage;
  facilities?: ChurchFacilities;
  services?: ChurchServices;
  outreach?: ChurchOutreach;
  settings?: ChurchSettings;
  organizedDate?: string;
  isActive: boolean;
  metadata: ChurchMetadata;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ChurchesListResponse {
  success: boolean;
  count?: number;
  data: Church[];
}

export interface ChurchDetailResponse {
  success: boolean;
  data: Church;
}

// Filter Parameters
export interface ChurchFilters {
  conferenceId?: string;
  city?: string;
  state?: string;
  search?: string;
  includeInactive?: boolean;
}
