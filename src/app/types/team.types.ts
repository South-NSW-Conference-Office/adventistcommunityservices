// Team Image Types
export interface TeamImage {
  url: string;
  key?: string;
  alt?: string;
}

// Team Leader Reference
export interface TeamLeader {
  _id: string;
  name: string;
  email?: string;
}

// Team Church Reference
export interface TeamChurch {
  _id: string;
  name: string;
}

// Team Settings (from backend schema)
export interface TeamSettings {
  allowSelfJoin?: boolean;
  requireApproval?: boolean;
  visibility?: 'public' | 'private' | 'church';
  isPubliclyVisible?: boolean;
  allowCrossChurchMembers?: boolean;
  collaborationEnabled?: boolean;
}

// Team Metadata (from backend schema)
export interface TeamMetadata {
  ministry?: string;
  focus?: string[];
  targetAudience?: string[];
  serviceArea?: string;
  meetingSchedule?: string;
}

// Main Team Interface
export interface Team {
  _id: string;
  name: string;
  churchId: string | TeamChurch;
  category?: string;
  type?: string;
  description?: string;
  location?: string;
  leaderId?: TeamLeader;
  profilePhoto?: TeamImage;
  banner?: TeamImage;
  isActive: boolean;
  memberCount?: number;
  hierarchyPath?: string;
  tags?: string[];
  settings?: TeamSettings;
  metadata?: TeamMetadata;
  serviceIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// API Response Types
export interface TeamsListResponse {
  success: boolean;
  count?: number;
  data: Team[];
}

export interface TeamDetailResponse {
  success: boolean;
  data: Team;
}

// Filter Parameters
export interface TeamFilters {
  churchId?: string;
  type?: string;
  search?: string;
  includeInactive?: boolean;
}
