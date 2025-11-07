import type { IAddressItem } from 'src/types/common';

import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { _addressBooks } from 'src/_mock';

import { Iconify } from 'src/components/iconify';

import { useTourCheckoutContext } from './context';
import { CheckoutSummary } from './checkout-summary';
import { AddressItem, AddressNewForm } from '../address';

// ----------------------------------------------------------------------

export function CheckoutBillingAddress() {
  const { onChangeStep, onSetContactInfo, state: checkoutState } = useTourCheckoutContext();
  const savedInfo = checkoutState.contactInfo;
  return (
    <>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <AddressNewForm
            onSetContactInfo={onSetContactInfo}
            onChangeStep={onChangeStep}
            savedInfo={savedInfo}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <CheckoutSummary checkoutState={checkoutState} />
        </Grid>
      </Grid >
    </>
  );
}
