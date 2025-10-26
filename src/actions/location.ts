// ----------------------------------------------------------------------

import { useMemo } from "react";
import { endpoints, fetcher } from "src/lib/axios";
import { ILocationItem } from "src/types/location";
import useSWR, { SWRConfiguration } from "swr";

const swrOptions: SWRConfiguration = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

export function useGetLocations() {
    const url = endpoints.locationManagement.root;

    const { data, isLoading, error, isValidating } = useSWR<ILocationItem[]>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            locations: data || [],
            locationsLoading: isLoading,
            locationsError: error,
            locationsValidating: isValidating,
            locationsEmpty: !isLoading && (!data || data.length === 0),
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}