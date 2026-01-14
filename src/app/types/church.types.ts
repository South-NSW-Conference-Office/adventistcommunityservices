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
