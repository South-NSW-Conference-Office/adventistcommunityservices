import { api } from './api';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface VolunteerApplicationData {
  name: string;
  email: string;
  phone: string;
  availability: 'weekdays' | 'weekends' | 'flexible';
  interests: 'foodbank' | 'clothing' | 'counseling' | 'emergency' | 'admin';
  experience?: string;
  motivation: string;
}

export const contactApi = {
  /**
   * Submit contact form
   */
  submitContactForm: async (data: ContactFormData) => {
    return api.post<{ message: string }, ContactFormData>('/contact/submit', data, false);
  },

  /**
   * Submit volunteer application
   */
  submitVolunteerApplication: async (data: VolunteerApplicationData) => {
    return api.post<{ message: string }, VolunteerApplicationData>('/contact/volunteer', data, false);
  },
};
