import dayjs from "dayjs";
import { useMemo } from "react";
import axiosInstance, { endpoints, fetcher } from "src/lib/axios";
import { IDateValue } from "src/types/common";
import { TourDto, TourFilterParams, TourItem } from "src/types/tour";
import useSWR, { SWRConfiguration } from "swr";

const swrOptions: SWRConfiguration = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------
export function useGetTours(filters?: TourFilterParams) {
    const searchParams = new URLSearchParams();

    if (filters?.locationIds?.length) {
        filters.locationIds.forEach((id) => searchParams.append('locationIds', String(id)));
    }
    if (filters?.extras?.length) {
        filters.extras.forEach((item) => searchParams.append('extras', item));
    }
    if (filters?.includes?.length) {
        filters.includes.forEach((item) => searchParams.append('includes', item));
    }
    if (filters?.title) {
        searchParams.append('title', filters.title);
    }
    if (filters?.fromDate) {
        searchParams.append('fromDate', dayjs(filters.fromDate).format('YYYY-MM-DD'));
    }
    if (filters?.toDate) {
        searchParams.append('toDate', dayjs(filters.toDate).format('YYYY-MM-DD'));
    }
    if (filters?.priceRange) {
        searchParams.append('priceMin', String(filters.priceRange[0]));
    }
    if (filters?.priceRange) {
        searchParams.append('priceMax', String(filters.priceRange[1]));
    }

    const queryString = searchParams.toString();
    const url = endpoints.tourManagement.root(queryString ? `?${queryString}` : '');

    const { data, isLoading, error, isValidating } = useSWR<TourItem[]>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            tours: data || [],
            toursLoading: isLoading,
            toursError: error,
            toursValidating: isValidating,
            toursEmpty: !isLoading && (!data || data.length === 0),
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetToursExtras() {
    const url = endpoints.tourManagement.extras;

    const { data, isLoading, error, isValidating } = useSWR<string[]>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            toursExtras: data || [],
            toursExtrasLoading: isLoading,
            toursExtrasError: error,
            toursExtrasValidating: isValidating,
            toursExtrasEmpty: !isLoading && (!data || data.length === 0),
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetToursIncludes() {
    const url = endpoints.tourManagement.includes;

    const { data, isLoading, error, isValidating } = useSWR<string[]>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            toursIncludes: data || [],
            toursIncludesLoading: isLoading,
            toursIncludesError: error,
            toursIncludesValidating: isValidating,
            toursIncludesEmpty: !isLoading && (!data || data.length === 0),
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetTour(id: number) {
    const url = endpoints.tourManagement.tour(id);

    const { data, isLoading, error, isValidating } = useSWR<TourItem>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            tour: data,
            tourLoading: isLoading,
            tourError: error,
            tourValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export async function createTour(dto: TourDto) {
    try {
        const { data } = await axiosInstance.post(endpoints.tourManagement.createTour, dto);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function updateTour(dto: TourDto, id: number) {
    try {
        const { data } = await axiosInstance.put(endpoints.tourManagement.updateTour(id), dto);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}