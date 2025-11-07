import axios from "axios";
import { useMemo } from "react";
import axiosInstance, { endpoints, fetcher } from "src/lib/axios";
import { ResponsePagi } from "src/types/pagiResponse";
import { UserDto, UserItem } from "src/types/user";
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
    role?: "ROLE_USER" | "ROLE_ADMIN"
}

export function useGetUsers({ pageNumber, pageSize, enabled, role }: Props) {
    let params = '';

    if (pageNumber || pageSize) params = `?page=${pageNumber}&size=${pageSize}`;

    if (role) params += `&role=${role}`;

    const url = enabled ? endpoints.userManagement.users(params) : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR<ResponsePagi<UserItem>>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => {
            const filteredItems = data?.data.items ?? [];
            return {
                users: filteredItems,
                pagination: {
                    pageNumber: data?.data.pageNumber ?? 1,
                    pageSize: data?.data.pageSize ?? pageSize,
                    totalPages: data?.data.totalPages ?? 0,
                    totalRecord: data?.data.totalRecord ?? 0,
                },
                usersLoading: isLoading,
                usersError: error,
                usersValidating: isValidating,
                usersEmpty: !isLoading && !isValidating && filteredItems.length === 0,
                mutation: mutate
            }
        },
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export async function createUser(dto: UserDto) {
    try {
        const { data } = await axiosInstance.post(endpoints.userManagement.createUser, dto);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function updateUser(dto: UserDto, id: number) {
    try {
        const { data } = await axiosInstance.put(endpoints.userManagement.updateUser(id), dto);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function deleteUser(id: number) {
    try {
        const { data } = await axiosInstance.delete(endpoints.userManagement.deleteUser(id));
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function fetchUserInfo(id: number) {
    if (!id) throw new Error('User ID không hợp lệ');

    const url = endpoints.auth.me(id);

    try {
        const res = await axiosInstance.get<UserItem>(url);
        return res.data;
    } catch (error: any) {
        console.error('Lỗi khi fetch user info:', error);
        throw error;
    }
}