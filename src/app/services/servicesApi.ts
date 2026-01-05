import { api } from './api';
import type {
  Service,
  ServiceFilters,
  GalleryImage,
  ServiceImage,
} from '../types/service.types';

export const servicesApi = {
  /**
   * Get all active services (public endpoint)
   */
  getPublicServices: async (filters?: ServiceFilters) => {
    const params = new URLSearchParams();

    if (filters?.type) params.append('type', filters.type);
    if (filters?.church) params.append('church', filters.church);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.lat !== undefined) params.append('lat', filters.lat.toString());
    if (filters?.lng !== undefined) params.append('lng', filters.lng.toString());
    if (filters?.radius !== undefined) params.append('radius', filters.radius.toString());

    const queryString = params.toString();
    const endpoint = `/services/public${queryString ? `?${queryString}` : ''}`;

    return api.get<Service[]>(endpoint, false);
  },

  /**
   * Get single service by ID (public endpoint)
   */
  getServiceById: async (id: string) => {
    return api.get<Service>(`/services/public/${id}`, false);
  },

  /**
   * Get service images (banner + gallery)
   */
  getServiceImages: async (id: string) => {
    return api.get<{ banner: ServiceImage | null; gallery: GalleryImage[] }>(
      `/services/${id}/images`,
      false
    );
  },
};
