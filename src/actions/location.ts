// ----------------------------------------------------------------------

import { useMemo } from "react";
import axiosInstance, { endpoints, fetcher } from "src/lib/axios";
import { ILocationItem } from "src/types/location";
import { ResponsePagi } from "src/types/pagiResponse";
import useSWR, { SWRConfiguration } from "swr";

const swrOptions: SWRConfiguration = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

type Props = {
    pageNumber: number,
    pageSize: number,
    enabled?: boolean,
}
// ----------------------------------------------------------------------

export function useGetLocations({ pageNumber, pageSize, enabled }: Props) {
    let params = '';

    if (pageNumber || pageSize) params = `?page=${pageNumber}&size=${pageSize}`;

    const url = enabled ? endpoints.locationManagement.root(params) : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR<ResponsePagi<ILocationItem>>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => {
            const filteredItems = data?.data.items ?? [];
            return {
                locations: filteredItems,
                pagination: {
                    pageNumber: data?.data.pageNumber ?? 1,
                    pageSize: data?.data.pageSize ?? pageSize,
                    totalPages: data?.data.totalPages ?? 0,
                    totalRecord: data?.data.totalRecord ?? 0,
                },
                locationsLoading: isLoading,
                locationsError: error,
                locationsValidating: isValidating,
                locationsEmpty: !isLoading && !isValidating && filteredItems.length === 0,
                mutation: mutate
            }
        },
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetLocation(id: number) {
    const url = endpoints.locationManagement.getById(id);

    const { data, isLoading, error, isValidating, mutate } = useSWR<ILocationItem>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            location: data,
            locationLoading: isLoading,
            locationError: error,
            locationValidating: isValidating,
            mutateTour: mutate,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export async function createLocation(name: string) {
    try {
        const { data } = await axiosInstance.post(endpoints.locationManagement.createLocation, { name });
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function updateLocation(name: string, id: number) {
    try {
        const { data } = await axiosInstance.put(endpoints.locationManagement.updateLocation(id), { name });
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function deleteLocation(id: number) {
    try {
        const { data } = await axiosInstance.delete(endpoints.locationManagement.deleteLocation(id));
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}