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
    me: (id: number) => `/users/${id}`,
    signIn: '/auth/login',
    signUp: '/auth/register',
  },
  userManagement: {
    users: '/users',
    createUser: '/users',
    updateUser: (id: number) => `/users/${id}`,
    deleteUser: (id: number) => `/users/${id}`,
  },
  bookingManagement: {
    root: '/bookings',
    booking: '/bookings',
    pay: (bookingId: number) => `/bookings/${bookingId}/pay`,
    bookedTours: (userId: number) => `/bookings/user/${userId}`,
  },
  locationManagement: {
    root: '/locations',
    createLocation: '/locations',
    updateLocation: (id: number) => `/locations/${id}`,
    deleteLocation: (id: number) => `/locations/${id}`,
  },
  tourManagement: {
    root: (params: string) => `/tours${params}`,
    extras: '/tours/extras',
    includes: 'tours/includes',
    tour: (id: number) => `/tours/${id}`,
    createTour: '/tours',
    updateTour: (id: number) => `/tours/${id}`,
    deleteTour: (id: number) => `/tours/${id}`,
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
