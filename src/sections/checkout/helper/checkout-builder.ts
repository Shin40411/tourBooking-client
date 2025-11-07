import { IPaymentMethod, ITourCheckoutState } from "src/types/booking";
import { TourPaymentSchemaType } from "../checkout-payment";

export function BuildVisaPayment(data: TourPaymentSchemaType['visa'], total: number): IPaymentMethod {
    return {
        method: 'VISA',
        amount: total,
        cardNumber: data?.cardNumber ?? '',
        bankName: data?.cardholderName ?? '',
        expiryDate: data?.expiry ?? null,
        cvv: data?.cvv ?? '',
    };
}

export function BuildPayment(checkoutState: ITourCheckoutState): IPaymentMethod {
    return {
        method: checkoutState.paymentMethod?.value ?? 'UNKNOWN',
        amount: checkoutState.total,
        cardNumber: '',
        bankName: '',
        expiryDate: null as any,
        cvv: '',
    };
}
