import { createContext } from "react";
import { TourCheckoutContextValue } from "src/types/booking";

export const TourCheckoutContext = createContext<TourCheckoutContextValue | undefined>(undefined);