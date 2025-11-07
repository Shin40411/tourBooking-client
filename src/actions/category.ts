import { useMemo } from "react";
import axiosInstance, { endpoints, fetcher } from "src/lib/axios";
import { ICategoryDto, ICategoryItem } from "src/types/category";
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

export function useGetCategories({ pageNumber, pageSize, enabled }: Props) {
    let params = '';

    if (pageNumber || pageSize) params = `?page=${pageNumber}&size=${pageSize}`;

    const url = enabled ? endpoints.categoryManagement.root(params) : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR<ResponsePagi<ICategoryItem>>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => {
            const filteredItems = data?.data.items ?? [];
            return {
                categories: filteredItems,
                pagination: {
                    pageNumber: data?.data.pageNumber ?? 1,
                    pageSize: data?.data.pageSize ?? pageSize,
                    totalPages: data?.data.totalPages ?? 0,
                    totalRecord: data?.data.totalRecord ?? 0,
                },
                categoriesLoading: isLoading,
                categoriesError: error,
                categoriesValidating: isValidating,
                categoriesEmpty: !isLoading && !isValidating && filteredItems.length === 0,
                mutation: mutate
            }
        },
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export async function createCategory(body: ICategoryDto) {
    try {
        const { data } = await axiosInstance.post(endpoints.categoryManagement.createCategories, body);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function updateCategory(body: ICategoryDto, id: number) {
    try {
        const { data } = await axiosInstance.put(endpoints.categoryManagement.updateCategories(id), body);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function deleteCategory(id: number) {
    try {
        const { data } = await axiosInstance.delete(endpoints.categoryManagement.deleteCategories(id));
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}