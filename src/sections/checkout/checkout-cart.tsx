import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { useCheckoutContext, useTourCheckoutContext } from './context';
import { CheckoutSummary } from './checkout-summary';
import { CheckoutCartProductList } from './checkout-cart-product-list';
import { useAuthContext } from 'src/auth/hooks';
import { Alert } from '@mui/material';

// ----------------------------------------------------------------------

export function CheckoutCart() {
  const {
    loading,
    onChangeStep,
    onDeleteTour,
    onChangeTourQuantity,
    onApplyDiscount,
    state: tourCheckoutState,
  } = useTourCheckoutContext();
  const { user } = useAuthContext();
  const isCartEmpty = !tourCheckoutState.items.length;

  // -------------------------------
  const renderLoading = () => (
    <Box
      sx={{
        height: 340,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <LinearProgress color="inherit" sx={{ width: 1, maxWidth: 320 }} />
    </Box>
  );

  const renderEmpty = () => (
    <EmptyContent
      title="Chưa có tour nào!"
      description="Có vẻ bạn chưa chọn tour nào để đặt."
      sx={{ height: 340 }}
    />
  );

  // -------------------------------
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6">
                {`Tóm tắt chuyến đi`}
              </Typography>
            }
          />

          {!user ?
            <Box p={4}>
              <Alert variant="standard" severity="info" style={{ width: '100%' }}>
                Đăng nhập để quản lý đơn hàng dễ dàng hơn!
              </Alert>
            </Box>
            :
            <Box mt={2} />
          }

          {loading ? (
            renderLoading()
          ) : isCartEmpty ? (
            renderEmpty()
          ) : (
            <CheckoutCartProductList
              checkoutState={tourCheckoutState}
              onDeleteItem={onDeleteTour}
              onChangeQuantity={onChangeTourQuantity}
            />
          )}
        </Card>

        <Button
          component={RouterLink}
          href={paths.homeTour.root}
          color="inherit"
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Tiếp tục xem tour
        </Button>
      </Grid>

      {/* Tổng kết đơn tour */}
      <Grid size={{ xs: 12, md: 4 }}>
        <CheckoutSummary
          checkoutState={tourCheckoutState}
        />

        <Box py={4}>
          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            disabled={isCartEmpty}
            onClick={() => onChangeStep('next')}
          >
            Xác nhận đặt tour
          </Button>
        </Box>
      </Grid>
    </Grid >
  );
}
