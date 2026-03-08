/**
 * church.types.ts
 *
 * These types mirror exactly what the backend returns from formatChurchResponse()
 * and formatChurchListItem().  The frontend never derives or transforms data —
 * it renders what it receives.
 */

// ---------------------------------------------------------------------------
// Sub-types
// ---------------------------------------------------------------------------

export interface ChurchConference {
  _id:  string;
  name: string | null;
  code: string | null;
}

export interface ChurchAddress {
  street:     string | null;
  city:       string | null;
  state:      string | null;
  postalCode: string | null;
  country?:   string | null;
}

export interface ChurchCoordinates {
  latitude:  number;
  longitude: number;
}

export interface ChurchLocation {
  address:     ChurchAddress | null;
  coordinates: ChurchCoordinates | null;
}

export interface ChurchContact {
  phone:          string | null;
  email:          string | null;
  website:        string | null;
  /** UI-safe fallback: "Contact for details" if phone is null */
  phoneDisplay:   string;
  /** Normalised URL (always has https://) or null */
  websiteDisplay: string | null;
}

export interface ChurchLeader {
  name:             string | null;
  title?:           string | null;
  phone:            string | null;
  email?:           string | null;
  responsibilities?: string[];
  isPrimary?:       boolean;
}

export interface ChurchLeadership {
  /** First entry in associatePastors, pre-extracted by the backend */
  primaryPastor:    ChurchLeader | null;
  associatePastors: ChurchLeader[];
  firstElder:       ChurchLeader | null;
  acsCoordinator:   ChurchLeader | null;
  clerk:            ChurchLeader | null;
  treasurer:        ChurchLeader | null;
}

export interface ChurchServiceTime {
  time?:        string;
  description?: string;
  day?:         string;
}

export interface ChurchSpecialService {
  name?:        string;
  schedule?:    string;
  description?: string;
}

export interface ChurchServices {
  sabbathSchool: ChurchServiceTime | null;
  worship:       ChurchServiceTime | null;
  prayerMeeting: ChurchServiceTime | null;
  vespers:       ChurchServiceTime | null;
  special:       ChurchSpecialService[];
}

export interface ChurchSanctuary {
  capacity?:        number;
  hasAV?:           boolean;
  hasAccessibility?: boolean;
}

export interface ChurchClassroom {
  name?:     string;
  capacity?: number;
  purpose?:  string;
}

export interface ChurchKitchen {
  available?: boolean;
  capacity?:  number;
  equipment?: string[];
}

export interface ChurchParking {
  spaces?:         number;
  handicapSpaces?: number;
}

export interface ChurchFacilities {
  sanctuary:  ChurchSanctuary | null;
  classrooms: ChurchClassroom[];
  kitchen:    ChurchKitchen | null;
  parking:    ChurchParking | null;
  other:      string[];
}

export interface OutreachFocusItem {
  /** The raw enum key stored in the DB */
  key:   string;
  /** Human-readable label, resolved by the backend */
  label: string;
}

export interface ChurchServiceArea {
  radius?:             number;
  communities?:        string[];
  specialPopulations?: string[];
}

export interface ChurchOutreach {
  primaryFocus: OutreachFocusItem[];
  serviceArea:  ChurchServiceArea | null;
  partnerships: unknown[];
}

export interface ChurchImage {
  url:          string;
  key?:         string;
  alt?:         string;
  thumbnailUrl?: string;
}

/** Section presence flags — computed by the backend */
export interface ChurchSections {
  hasServiceTimes: boolean;
  hasFacilities:   boolean;
  hasLeadership:   boolean;
  hasOutreach:     boolean;
}

/** Stats — always numbers, never null */
export interface ChurchStats {
  teamCount:    number;
  serviceCount: number;
}

// ---------------------------------------------------------------------------
// Full church detail response
// ---------------------------------------------------------------------------
export interface Church {
  _id:            string;
  name:           string | null;
  code:           string | null;
  isActive:       boolean;
  organizedDate:  string | null;
  hierarchyPath:  string | null;
  hierarchyLevel: number;

  /** Always a consistent object shape, never a raw ObjectId string */
  conference: ChurchConference | null;

  location:         ChurchLocation;
  formattedAddress: string;   // e.g. "805 David Street, Albury, NSW 2640"
  locationShort:    string;   // e.g. "Albury, NSW"

  contact:   ChurchContact;
  /** Google Maps directions URL, computed by backend */
  directionsUrl: string | null;

  leadership:  ChurchLeadership;
  services:    ChurchServices;
  facilities:  ChurchFacilities;
  outreach:    ChurchOutreach;
  primaryImage: ChurchImage | null;
  settings:    unknown | null;

  /** Section presence flags — render conditionally on these */
  sections: ChurchSections;
  /** Stats — always numbers */
  stats:    ChurchStats;

  createdAt: string | null;
  updatedAt: string | null;
}

// ---------------------------------------------------------------------------
// List item — lighter shape returned by GET /churches
// ---------------------------------------------------------------------------
export interface ChurchListItem {
  _id:           string;
  name:          string | null;
  code:          string | null;
  isActive:      boolean;
  conference:    ChurchConference | null;
  locationShort: string | null;
  location: {
    address: Omit<ChurchAddress, 'country'> | null;
  };
  contact: {
    phone:   string | null;
    email:   string | null;
    website: string | null;
  };
  stats: ChurchStats;
}

// ---------------------------------------------------------------------------
// API response wrappers
// ---------------------------------------------------------------------------
export interface ChurchPagination {
  page:       number;
  limit:      number;
  total:      number;
  totalPages: number;
}

export interface ChurchesListResponse {
  success:    boolean;
  message:    string;
  data:       ChurchListItem[];
  pagination: ChurchPagination;
}

export interface ChurchDetailResponse {
  success: boolean;
  message: string;
  data:    Church;
}

// ---------------------------------------------------------------------------
// Query params
// ---------------------------------------------------------------------------
export interface ChurchFilters {
  conferenceId?:   string;
  city?:           string;
  state?:          string;
  search?:         string;
  includeInactive?: boolean;
  page?:           number;
  limit?:          number;
}
