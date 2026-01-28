import { api } from './api';

export interface Testimony {
  _id: string;
  name: string;
  location: string;
  review: string;
  image: {
    url: string;
    alt?: string;
  };
}

interface TestimoniesResponse {
  testimonies: Testimony[];
}

export const testimoniesApi = {
  /**
   * Get all approved testimonies (public endpoint)
   */
  getAllApproved: async () => {
    return api.get<TestimoniesResponse>('/testimonies', false);
  },

  /**
   * Get featured testimonies for homepage display (public endpoint)
   */
  getFeatured: async (limit: number = 8) => {
    return api.get<TestimoniesResponse>(`/testimonies/featured?limit=${limit}`, false);
  },
};
