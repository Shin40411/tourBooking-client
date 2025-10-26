/* eslint-disable import/no-duplicates */
import { format, getTime, formatDistanceToNow, add } from 'date-fns';
import { vi } from 'date-fns/locale/vi';
// ----------------------------------------------------------------------

type InputValue = Date | string | number | null | undefined;

export function fDate(date: InputValue, newFormat?: string) {
    const fm = newFormat || 'dd/MM/yyyy';

    return date ? format(new Date(date), fm, { locale: vi }) : '';
}

export function fDateTime(date: InputValue, newFormat?: string) {
    const fm = newFormat || 'p dd/MM/yyyy';

    return date ? format(new Date(date), fm, { locale: vi }) : '';
}

export function fTimestamp(date: InputValue) {
    return date ? getTime(new Date(date)) : '';
}

export function fToNow(date: InputValue) {
    return date
        ? formatDistanceToNow(new Date(date), {
            addSuffix: false,
            locale: vi,
        })
        : '';
}

export function fToNowUTC0(date: InputValue) {
    return date
        ? formatDistanceToNow(
            add(new Date(date as any), {
                days: 1,
            }),
            {
                addSuffix: false,
                locale: vi,
            }
        )
        : '';
}


export function formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
}