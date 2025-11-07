import { useMemo } from "react";
import axiosInstance, { endpoints, fetcher } from "src/lib/axios";
import { BookingDto, IBookingList, IContactInfo, IPaymentMethod } from "src/types/booking";
import { ResponseNoPagi, ResponsePagi } from "src/types/pagiResponse";
import useSWR, { SWRConfiguration } from "swr";

const swrOptions: SWRConfiguration = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

type Props = {
    pageNumber?: number,
    pageSize?: number,
    enabled?: boolean,
    userId?: number,
    tourId?: number,
    contactInfoId?: number,
    paymentInfoId?: number
}

export function useGetBookedList({ pageNumber, pageSize, enabled }: Props) {
    let params = '';

    if (pageNumber || pageSize) params = `?page=${pageNumber}&size=${pageSize}`;

    const url = enabled ? endpoints.bookingManagement.root(params) : null;

    const { data, isLoading, error, isValidating } = useSWR<ResponsePagi<IBookingList>>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => {
            const filteredItems = data?.data.items ?? [];
            return {
                bookings: filteredItems,
                pagination: {
                    pageNumber: data?.data.pageNumber ?? 1,
                    pageSize: data?.data.pageSize ?? pageSize,
                    totalPages: data?.data.totalPages ?? 0,
                    totalRecord: data?.data.totalRecord ?? 0,
                },
                bookingsLoading: isLoading,
                bookingsError: error,
                bookingsValidating: isValidating,
                bookingsEmpty: !isLoading && !isValidating && filteredItems.length === 0,
            }
        },
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetBooked({ userId, pageNumber, pageSize, enabled }: Props) {
    if (!userId || !enabled) {
        return {
            booked: [],
            pagination: {
                pageNumber: 1,
                pageSize,
                totalPages: 0,
                totalRecord: 0,
            },
            bookedLoading: false,
            bookedError: null,
            bookedValidating: false,
            bookedEmpty: true,
        };
    }

    let params = `?userId=${userId}`;
    if (pageNumber || pageSize) params += `&page=${pageNumber}&size=${pageSize}`;

    const url = endpoints.bookingManagement.bookedTours(params);

    const { data, isLoading, error, isValidating } = useSWR<ResponsePagi<IBookingList>>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(() => {
        const filteredItems = data?.data.items ?? [];
        return {
            booked: filteredItems,
            pagination: {
                pageNumber: data?.data.pageNumber ?? 1,
                pageSize: data?.data.pageSize ?? pageSize,
                totalPages: data?.data.totalPages ?? 0,
                totalRecord: data?.data.totalRecord ?? 0,
            },
            bookedLoading: isLoading,
            bookedError: error,
            bookedValidating: isValidating,
            bookedEmpty: !isLoading && !isValidating && filteredItems.length === 0,
        };
    }, [data, error, isLoading, isValidating, pageSize]);

    return memoizedValue;
}

export function useGetBookedByTour({ tourId, pageNumber, pageSize, enabled }: Props) {
    if (!tourId || !enabled) {
        return {
            booked: [],
            pagination: {
                pageNumber: 1,
                pageSize,
                totalPages: 0,
                totalRecord: 0,
            },
            bookedLoading: false,
            bookedError: null,
            bookedValidating: false,
            bookedEmpty: true,
            mutation: () => { }
        };
    }

    let params = `${tourId}`;
    if (pageNumber || pageSize) params += `?page=${pageNumber}&size=${pageSize}`;

    const url = endpoints.bookingManagement.byTour(params);

    const { data, isLoading, error, isValidating, mutate } = useSWR<ResponsePagi<IBookingList>>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(() => {
        const filteredItems = data?.data.items ?? [];
        return {
            booked: filteredItems,
            pagination: {
                pageNumber: data?.data.pageNumber ?? 1,
                pageSize: data?.data.pageSize ?? pageSize,
                totalPages: data?.data.totalPages ?? 0,
                totalRecord: data?.data.totalRecord ?? 0,
            },
            bookedLoading: isLoading,
            bookedError: error,
            bookedValidating: isValidating,
            bookedEmpty: !isLoading && !isValidating && filteredItems.length === 0,
            mutation: mutate
        };
    }, [data, error, isLoading, isValidating, pageSize]);

    return memoizedValue;
}

export async function createBooking(dto: BookingDto) {
    try {
        const { data } = await axiosInstance.post(endpoints.bookingManagement.booking, dto);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function payBooking(id: number, status: boolean) {
    try {
        const { data } = await axiosInstance.post(endpoints.bookingManagement.pay(id, status));
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export function useGetContactInfo({ contactInfoId, enabled }: Props) {
    if (!contactInfoId || !enabled) {
        return {
            contactInfo: null,
            contactInfoLoading: false,
            contactInfoError: null,
            contactInfoValidating: false,
            contactInfoEmpty: true,
            mutation: () => { }
        };
    }

    const url = endpoints.bookingManagement.contactInfo(contactInfoId);

    const { data, isLoading, error, isValidating, mutate } = useSWR<ResponseNoPagi<IContactInfo>>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(() => {
        const filteredItem = data?.data ?? null;
        return {
            contactInfo: filteredItem,
            contactInfoLoading: isLoading,
            contactInfoError: error,
            contactInfoValidating: isValidating,
            contactInfoEmpty: !isLoading && !isValidating && filteredItem === null,
            mutation: mutate
        };
    }, [data, error, isLoading, isValidating]);

    return memoizedValue;
}

export function useGetPaymentInfo({ paymentInfoId, enabled }: Props) {
    if (!paymentInfoId || !enabled) {
        return {
            paymentInfo: null,
            paymentInfoLoading: false,
            paymentInfoError: null,
            paymentInfoValidating: false,
            paymentInfoEmpty: true,
            mutation: () => { }
        };
    }

    const url = endpoints.bookingManagement.paymentInfo(paymentInfoId);

    const { data, isLoading, error, isValidating, mutate } = useSWR<IPaymentMethod>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(() => {
        const filteredItems = data ?? null;
        return {
            paymentInfo: filteredItems,
            paymentInfoLoading: isLoading,
            paymentInfoError: error,
            paymentInfoValidating: isValidating,
            paymentInfoEmpty: !isLoading && !isValidating && filteredItems === null,
            mutation: mutate
        };
    }, [data, error, isLoading, isValidating]);

    return memoizedValue;
}

export async function deleteBooking(id: number) {
    try {
        const { data } = await axiosInstance.delete(endpoints.bookingManagement.delete(id));
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}