import { ILocationItem } from "./location";

export type ICategoryItem = {
    id: number;
    name: string;
    country: string;
    locations: ILocationItem[];
}

export type ICategoryDto = {
    name: string;
    country: string;
    locationIds: number[];
}