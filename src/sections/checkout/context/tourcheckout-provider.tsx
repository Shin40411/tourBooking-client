'use client';

import { isEqual } from 'es-toolkit';
import { useLocalStorage } from 'minimal-shared/hooks';
import { getStorage } from 'minimal-shared/utils';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'src/routes/hooks';

import { paths } from 'src/routes/paths';
import { IContactInfo, ITourCheckoutItem, ITourCheckoutState, ITourPaymentOption, TourCheckoutContextValue } from 'src/types/booking';
import { TourCheckoutContext } from './tourcheckout-context';



// ----------------------------------------------------------------------

const TOUR_CHECKOUT_STORAGE_KEY = 'tour-checkout';
const TOUR_CHECKOUT_STEPS = ['Tour', 'Contact info', 'Payment'];

const initialState: ITourCheckoutState = {
    items: [],
    subtotal: 0,
    total: 0,
    discount: 0,
    totalItems: 0,
    contactInfo: null,
    paymentMethod: null,
};

// ----------------------------------------------------------------------

type TourCheckoutProviderProps = {
    children: React.ReactNode;
};

export function TourCheckoutProvider({ children }: TourCheckoutProviderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const activeStep = pathname.includes(paths.homeTour.checkOut)
        ? Number(searchParams.get('step'))
        : null;

    const [loading, setLoading] = useState(true);

    const { state, setState, setField, resetState } = useLocalStorage<ITourCheckoutState>(
        TOUR_CHECKOUT_STORAGE_KEY,
        initialState,
        { initializeWithValue: false }
    );

    const canReset = !isEqual(state, initialState);
    const completed = activeStep === TOUR_CHECKOUT_STEPS.length;

    const updateTotals = useCallback(() => {
        const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = state.items.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0
        );

        setField('subtotal', subtotal);
        setField('totalItems', totalItems);
        setField('total', subtotal - state.discount);
    }, [state.items, state.discount, setField]);

    useEffect(() => {
        const init = () => {
            setLoading(true);
            const restored = getStorage(TOUR_CHECKOUT_STORAGE_KEY);
            if (restored) updateTotals();
            setLoading(false);
        };
        init();
    }, [updateTotals]);

    const onChangeStep = useCallback(
        (type: 'back' | 'next' | 'go', step?: number) => {
            const stepMap = {
                back: (activeStep ?? 0) - 1,
                next: (activeStep ?? 0) + 1,
                go: step ?? 0,
            };

            const targetStep = stepMap[type];
            const queryString = new URLSearchParams({ step: `${targetStep}` }).toString();
            const redirectPath =
                targetStep === 0 ? paths.homeTour.checkOut : `${paths.homeTour.checkOut}?${queryString}`;

            router.push(redirectPath);
        },
        [activeStep, router]
    );

    const onAddTour = useCallback(
        (newItem: ITourCheckoutItem) => {
            const updatedItems = [newItem];
            setState({
                ...initialState,
                items: updatedItems,
                subtotal: newItem.price * newItem.quantity,
                total: newItem.price * newItem.quantity,
                totalItems: newItem.quantity,
            });
        },
        [setState]
    );

    const onDeleteTour = useCallback(
        (id: number) => {
            const updatedItems = state.items.filter((item) => item.id !== id);
            setField('items', updatedItems);
            setField('contactInfo', null);
        },
        [state.items, setField]
    );

    const onChangeTourQuantity = useCallback(
        (id: number, quantity: number) => {
            const updatedItems = state.items.map((item) => {
                if (item.id === id) {
                    const newSubtotal = item.price * quantity;
                    return { ...item, quantity, subtotal: newSubtotal };
                }
                return item;
            });

            setField('items', updatedItems);
        },
        [state.items, setField]
    );

    const onApplyDiscount = useCallback(
        (discount: number) => setField('discount', discount),
        [setField]
    );

    const onSetContactInfo = useCallback(
        (info: IContactInfo) => setField('contactInfo', info),
        [setField]
    );

    const onSetPaymentMethod = useCallback(
        (method: ITourPaymentOption) => setField('paymentMethod', method),
        [setField]
    );

    // const onResetBooking = useCallback(() => {
    //     if (completed) {
    //         resetState(initialState);
    //     }
    // }, [completed, resetState]);
    const onResetBooking = useCallback(() => {
        resetState(initialState);
    }, [resetState]);

    const memoizedValue = useMemo<TourCheckoutContextValue>(
        () => ({
            state,
            setState,
            setField,
            activeStep,
            steps: TOUR_CHECKOUT_STEPS,
            loading,
            completed,
            canReset,
            onChangeStep,
            onAddTour,
            onDeleteTour,
            onChangeTourQuantity,
            onApplyDiscount,
            onSetContactInfo,
            onSetPaymentMethod,
            onResetBooking,
        }),
        [
            state,
            setState,
            setField,
            activeStep,
            loading,
            completed,
            canReset,
            onChangeStep,
            onAddTour,
            onDeleteTour,
            onChangeTourQuantity,
            onApplyDiscount,
            onSetContactInfo,
            onSetPaymentMethod,
            onResetBooking,
        ]
    );

    return <TourCheckoutContext value={memoizedValue}>{children}</TourCheckoutContext>;
}
