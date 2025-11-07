
// -----------------------------
// Tour Item

import { IDateValue } from "./common";
import { ILocationItem } from "./location";

// -----------------------------
export type ITourCheckoutItem = {
    id: number;
    tourCode: string;
    title: string;
    price: number;
    duration: string;
    date: IDateValue;
    image: string;
    quantity: number;
    slots: number;
    subtotal?: number;
    includes: string[];
    extras: string[];
    locations: ILocationItem[];
};

// -----------------------------
export type ITourContactOption = {
    label: string;
    value: string;
    description: string;
};

// -----------------------------
export type ITourPaymentOption = {
    value: string;
    label: string;
    description: string;
    visa?: IPaymentMethod;
};

// -----------------------------
export type ITourCheckoutState = {
    total: number;
    subtotal: number;
    discount: number;
    totalItems: number;
    items: ITourCheckoutItem[];
    contactInfo: IContactInfo | null;
    paymentMethod: ITourPaymentOption | null;
};

// -----------------------------
export type IContactInfo = {
    fullName: string;
    email: string;
    phone: string;
    note?: string;
};

// -----------------------------
export type TourCheckoutContextValue = {
    loading: boolean;
    completed: boolean;
    canReset: boolean;
    state: ITourCheckoutState;
    setState: (updateValue: Partial<ITourCheckoutState>) => void;
    setField: (
        name: keyof ITourCheckoutState,
        updateValue: ITourCheckoutState[keyof ITourCheckoutState]
    ) => void;
    steps: string[];
    activeStep: number | null;
    onChangeStep: (type: 'back' | 'next' | 'go', step?: number) => void;
    onAddTour: (newItem: ITourCheckoutItem) => void;
    onDeleteTour: (id: number) => void;
    onChangeTourQuantity: (id: number, quantity: number) => void;
    onApplyDiscount: (discount: number) => void;
    onSetContactInfo: (info: IContactInfo) => void;
    onSetPaymentMethod: (method: ITourPaymentOption) => void;
    onResetBooking: () => void;
};

export type IPaymentMethod = {
    method: string;
    amount: number;
    cardNumber: string;
    bankName: string;
    expiryDate: IDateValue;
    cvv: string;
}

export type BookingDto = {
    userId: number | null;
    tourId: number;
    quantity: number;
    contact: IContactInfo;
    payment: IPaymentMethod;
}

export type UserAuthenticated = {
    id: number;
    role: string;
    token: string;
    username: string;
}

export type IBookingList = {
    id: number;
    userId: number;
    tourId: number;
    quantity: number;
    status: string;
    paymentStatus: string;
    bookingDate: IDateValue;
    contactInfoId: number;
    paymentInfoId: number;
}