import { AuthService } from './auth';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface MediaFile {
  _id: string;
  originalName: string;
  fileName: string;
  url: string;
  mimeType: string;
  formattedSize: string;
  dimensions?: {
    width: number;
    height: number;
  };
  alt: string;
  caption: string;
  createdAt: string;
}

export interface MediaListResponse {
  success: boolean;
  data: {
    files: MediaFile[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalFiles: number;
      hasNextPage: boolean;
    };
  };
}

function getAuthHeaders(): HeadersInit {
  const token = AuthService.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getMediaFiles(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<MediaListResponse> {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);

  const url = `${API_BASE}/api/media${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  const response = await fetch(url, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch media: ${response.status}`);
  }

  return response.json();
}
