import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { CheckoutCart } from '../checkout-cart';
import { useCheckoutContext, useTourCheckoutContext } from '../context';
import { CheckoutSteps } from '../checkout-steps';
import { CheckoutPayment } from '../checkout-payment';
import { CheckoutOrderComplete } from '../checkout-order-complete';
import { CheckoutBillingAddress } from '../checkout-billing-address';
// ----------------------------------------------------------------------

export function CheckoutView() {
  const { steps, activeStep, completed } = useTourCheckoutContext();

  return (
    <Container maxWidth="xl" sx={{ minHeight: '100vh', mb: 10 }}>
      <Grid container justifyContent={completed ? 'center' : 'flex-start'}>
        <Grid size={12} pt={10}>
          <CheckoutSteps steps={steps} activeStep={activeStep ?? 0} />
        </Grid>
      </Grid>

      <>
        {activeStep === 0 && <CheckoutCart />}

        {activeStep === 1 && <CheckoutBillingAddress />}

        {activeStep === 2 && <CheckoutPayment />}
      </>
    </Container>
  );
}
