import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: (id: number) => `/api/users/${id}`,
    signIn: '/api/auth/login',
    signUp: '/api/auth/register',
  },
  userManagement: {
    users: (params: string) => `/api/users${params}`,
    createUser: '/api/users/create',
    updateUser: (id: number) => `/api/users/${id}`,
    deleteUser: (id: number) => `/api/users/${id}`,
  },
  categoryManagement: {
    root: (params: string) => `/api/categories${params}`,
    createCategories: '/api/categories',
    updateCategories: (id: number) => `/api/categories/${id}`,
    deleteCategories: (id: number) => `/api/categories/${id}`,
  },
  bookingManagement: {
    root: (params: string) => `/api/bookings${params}`,
    booking: '/api/bookings',
    pay: (bookingId: number, status: boolean) => `/api/bookings/${bookingId}/pay/${status}`,
    bookedTours: (params: string) => `/api/bookings/me${params}`,
    byTour: (params: string) => `/api/bookings/tour/${params}`,
    contactInfo: (id: number) => `/api/bookings/contact-info/${id}`,
    paymentInfo: (id: number) => `/api/bookings/payment-info/${id}`,
    delete: (id: number) => `/api/bookings/${id}`
  },
  locationManagement: {
    root: (params: string) => `/api/locations${params}`,
    getById: (id: number) => `/api/locations/${id}`,
    createLocation: '/api/locations',
    updateLocation: (id: number) => `/api/locations/${id}`,
    deleteLocation: (id: number) => `/api/locations/${id}`,
  },
  tourManagement: {
    root: (params: string) => `/api/tours${params}`,
    extras: '/api/tours/extras',
    includes: '/api/tours/includes',
    tour: (id: number) => `/api/tours/${id}`,
    createTour: '/api/tours',
    updateTour: (id: number) => `/api/tours/${id}`,
    deleteTour: (id: number) => `/api/tours/${id}`,
    upload: '/api/files/upload'
  },
  //unused endpoints
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
};
