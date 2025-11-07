import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import axiosInstance, { endpoints, fetcher } from "src/lib/axios";
import { IDateValue } from "src/types/common";
import { ResponsePagi } from "src/types/pagiResponse";
import { TourDto, TourFilterParams, TourItem } from "src/types/tour";
import useSWR, { SWRConfiguration } from "swr";

const swrOptions: SWRConfiguration = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------
export function useGetTours(filters?: TourFilterParams, pageNumber?: number, pageSize?: number) {
    const searchParams = new URLSearchParams();

    if (pageNumber !== undefined) searchParams.append('page', String(pageNumber));

    if (pageSize !== undefined) searchParams.append('size', String(pageSize));

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

    const { data, isLoading, error, isValidating, mutate } = useSWR<ResponsePagi<TourItem>>(
        ['tours', queryString, pageNumber, pageSize],
        () => fetcher(url),
        swrOptions
    );

    const memoizedValue = useMemo(
        () => {
            const filteredItems = data?.data.items ?? [];
            return {
                tours: filteredItems,
                pagination: {
                    pageNumber: data?.data.pageNumber ?? 1,
                    pageSize: data?.data.pageSize ?? pageSize,
                    totalPages: data?.data.totalPages ?? 0,
                    totalRecord: data?.data.totalRecord ?? 0,
                },
                toursLoading: isLoading,
                toursError: error,
                toursValidating: isValidating,
                toursEmpty: !isLoading && !isValidating && filteredItems.length === 0,
                mutateTours: mutate,
            }
        },
        [data, error, isLoading, isValidating, pageNumber, pageSize]
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

    const { data, isLoading, error, isValidating, mutate } = useSWR<TourItem>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            tour: data,
            tourLoading: isLoading,
            tourError: error,
            tourValidating: isValidating,
            mutateTour: mutate,
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

export async function deleteTour(id: number) {
    try {
        const { data } = await axiosInstance.delete(endpoints.tourManagement.deleteTour(id));
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function uploadImage(file: File) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await axiosInstance.post(endpoints.tourManagement.upload, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export function useCountdown(targetDate: Date | null) {
    const [countDown, setCountDown] = useState(
        targetDate ? targetDate.getTime() - Date.now() : 0
    );

    useEffect(() => {
        if (!targetDate) return;

        const interval = setInterval(() => {
            setCountDown(targetDate.getTime() - Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    if (!targetDate) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isExpired: countDown <= 0 };
}
