import { use } from 'react';

import { CheckoutContext } from './checkout-context';
import { TourCheckoutContext } from './tourcheckout-context';

// ----------------------------------------------------------------------

export function useCheckoutContext() {
  const context = use(CheckoutContext);

  if (!context) throw new Error('useCheckoutContext must be use inside CheckoutProvider');

  return context;
}

export function useTourCheckoutContext() {
  const context = use(TourCheckoutContext);
  if (!context) throw new Error('useTourCheckoutContext must be used inside TourCheckoutProvider');
  return context;
}