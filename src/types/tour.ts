import { Dayjs } from 'dayjs';
import type { IDateValue, IDatePickerControl } from './common';
import { ILocationItem } from './location';

// ----------------------------------------------------------------------

export type ITourFilters = {
  services: string[];
  destination: string[];
  tourGuides: ITourGuide[];
  endDate: IDatePickerControl;
  startDate: IDatePickerControl;
};

export type ITourGuide = {
  id: string;
  name: string;
  avatarUrl: string;
  phoneNumber: string;
};

export type ITourBooker = {
  id: string;
  name: string;
  guests: number;
  avatarUrl: string;
};

export type ITourItem = {
  id: string;
  name: string;
  price: number;
  tags: string[];
  content: string;
  publish: string;
  images: string[];
  durations: string;
  priceSale: number;
  totalViews: number;
  services: string[];
  destination: string;
  ratingNumber: number;
  createdAt: IDateValue;
  bookers: ITourBooker[];
  tourGuides: ITourGuide[];
  available: {
    endDate: IDateValue;
    startDate: IDateValue;
  };
};

export type TourFilterValues = {
  title?: string;
  locations?: string[],
  includes?: string[];
  extras?: string[];
  priceRange?: [number, number];
  startDate: IDateValue | null;
  endDate: IDateValue | null;
};

export type TourFilterParams = {
  locationIds?: number[];
  extras?: string[];
  includes?: string[];
  title?: string;
  fromDate?: IDateValue;
  toDate?: IDateValue;
  priceRange?: [number, number];
}

export type TourItem = {
  id: number;
  title: string;
  price: number;
  description: string;
  slots: number;
  date: IDateValue;
  image: string;
  includes: string[];
  extras: string[];
  locations: ILocationItem[];
}

export type TourDto = {
  title: string;
  price: number;
  description: string;
  slots: number;
  date: IDateValue;
  image: string;
  includes: string[];
  extras: string[];
  locationIds: number[];
}