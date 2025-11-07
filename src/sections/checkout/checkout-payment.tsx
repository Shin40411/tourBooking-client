
import { z, z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

import { useTourCheckoutContext } from './context';
import { CheckoutSummary } from './checkout-summary';
import { CheckoutPaymentMethods } from './checkout-payment-methods';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { BookingDto, IPaymentMethod, ITourCheckoutState, ITourPaymentOption, UserAuthenticated } from 'src/types/booking';
import { IDateValue } from 'src/types/common';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CheckoutOrderComplete } from './checkout-order-complete';
import { CheckoutInvoicePDFViewer } from './checkout-pdf-export';
import { useBoolean } from 'minimal-shared/hooks';
import { JWT_USER_INFO } from 'src/auth/context/jwt';
import { createBooking } from 'src/actions/booking';
import { UserItem } from 'src/types/user';
import { BuildPayment, BuildVisaPayment } from './helper/checkout-builder';

// ----------------------------------------------------------------------
export const TourPaymentSchema = z.object({
  payment: z.string().min(1, 'Vui lòng chọn phương thức thanh toán'),
  visa: z.object({
    cardholderName: z.string().optional(),
    cardNumber: z.string().optional(),
    cvv: z.string().optional(),
    expiry: z.custom<IDateValue>().optional(),
  }).optional(),
}).superRefine((data, ctx) => {
  if (data.payment === 'VISA') {
    if (!data.visa?.cardholderName) {
      ctx.addIssue({
        path: ['visa', 'cardholderName'],
        message: 'Tên chủ thẻ là bắt buộc',
        code: z.ZodIssueCode.custom,
      });
    }
    if (!data.visa?.cardNumber) {
      ctx.addIssue({
        path: ['visa', 'cardNumber'],
        message: 'Số thẻ là bắt buộc',
        code: z.ZodIssueCode.custom,
      });
    }
    if (!data.visa?.cvv) {
      ctx.addIssue({
        path: ['visa', 'cvv'],
        message: 'Mã CVV là bắt buộc',
        code: z.ZodIssueCode.custom,
      });
    }
    if (!data.visa?.expiry) {
      ctx.addIssue({
        path: ['visa', 'expiry'],
        message: 'Ngày hết hạn là bắt buộc',
        code: z.ZodIssueCode.custom,
      });
    }
  }
});

export type TourPaymentSchemaType = zod.infer<typeof TourPaymentSchema>;

// ----------------------------------------------------------------------

const TOUR_PAYMENT_OPTIONS = [
  {
    value: 'VISA',
    label: 'Thanh toán bằng thẻ tín dụng',
    description: 'Thanh toán qua thẻ tín dụng của bạn',
  },
  {
    value: 'BANKING',
    label: 'Thanh toán chuyển khoản',
    description: 'Thanh toán qua số tài khoản của chúng tôi',
  },
  {
    value: 'CASH',
    label: 'Thanh toán tiền mặt',
    description: 'Thanh toán trực tiếp tại quầy hoặc khi tham gia tour.',
  },
];

// ----------------------------------------------------------------------


export function CheckoutPayment() {
  const {
    loading,
    onChangeStep,
    onSetPaymentMethod,
    onResetBooking,
    state: checkoutState,
  } = useTourCheckoutContext();

  const userInfo = sessionStorage.getItem(JWT_USER_INFO);
  const [userAuthenticated, setUserAuthenticated] = useState<UserAuthenticated | null>(null);

  const defaultValues: TourPaymentSchemaType = {
    payment: checkoutState.paymentMethod?.value || '',
    visa: {
      cardholderName: '',
      cardNumber: '',
      cvv: '',
      expiry: '',
    },
  };

  const methods = useForm<TourPaymentSchemaType>({
    resolver: zodResolver(TourPaymentSchema),
    defaultValues,
  });

  const [storeTourCode, setStoreTourCode] = useState('');
  const [storeCheckoutState, setStoreCheckoutState] = useState<ITourCheckoutState>();
  const openPDF = useBoolean();
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpInput, setOtpInput] = useState('');

  const generateOtp = () => {
    setOtpLoading(true);
    setOtpCode('');
    setOtpInput('');

    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setOtpCode(code);
      setOtpInput(code);
      setOtpLoading(false);
    }, 5000);
  };

  const handleCloseDialog = () => {
    setOtpDialogOpen(false);
  };

  const handleConfirmOtp = async () => {
    handleCloseDialog();

    if (!checkoutState.items?.length) {
      toast.error('Thiếu thông tin tour để đặt.');
      return;
    }

    if (!checkoutState.contactInfo) {
      toast.error('Thiếu thông tin liên hệ.');
      return;
    }

    try {
      const paymentData = BuildPayment(checkoutState);

      const booking: BookingDto = {
        userId: userAuthenticated?.id ?? null,
        tourId: checkoutState.items[0].id,
        quantity: checkoutState.items[0].quantity,
        contact: checkoutState.contactInfo!,
        payment: paymentData,
      };

      await createBooking(booking);

      setStoreCheckoutState(checkoutState);
      setStoreTourCode(checkoutState.items[0].tourCode);
      toast.success('Đặt tour thành công!');
      onResetBooking();
    } catch (error: any) {
      console.error(error);
      toast.error('Đã có lỗi xảy ra trong quá trình đặt tour, vui lòng thử lại');
    }
  };

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (!userInfo) return;
    const parsedUserInfo = JSON.parse(userInfo);
    setUserAuthenticated(parsedUserInfo);
  }, [userInfo, methods]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const selected = TOUR_PAYMENT_OPTIONS.find((opt) => opt.value === data.payment);
      if (!selected) return;

      if (selected.value === 'VISA') {
        onSetPaymentMethod({ ...selected, visa: BuildVisaPayment(data.visa, checkoutState.total) });
        generateOtp();
        setOtpDialogOpen(true);
        return;
      }

      if (!checkoutState.items?.length) return toast.error('Thiếu thông tin tour để đặt.');

      if (!checkoutState.contactInfo) return toast.error('Thiếu thông tin liên hệ.');

      onSetPaymentMethod(selected);
      const booking: BookingDto = {
        userId: userAuthenticated?.id ?? null,
        tourId: checkoutState.items[0].id,
        quantity: checkoutState.items[0].quantity,
        contact: checkoutState.contactInfo!,
        payment: BuildPayment(checkoutState),
      };

      await createBooking(booking);

      setStoreCheckoutState(checkoutState);
      onResetBooking();
      toast.success('Đặt tour thành công!');
      setStoreTourCode(checkoutState.items[0].tourCode);

    } catch (error: any) {
      console.error(error);
      toast.error('Đã có lỗi xảy ra trong quá trình đặt tour, vui lòng kiểm tra lại');
    }
  });

  const renderDetailsDialog = () => (
    <Dialog fullScreen open={openPDF.value}>
      <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
        <DialogActions sx={{ p: 1.5 }}>
          <Button color="inherit" variant="contained" onClick={openPDF.onFalse}>
            Đóng
          </Button>
        </DialogActions>
        <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
          {(storeCheckoutState && storeTourCode) && <CheckoutInvoicePDFViewer checkoutState={storeCheckoutState} />}
        </Box>
      </Box>
    </Dialog>
  );

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <CheckoutPaymentMethods
              name="payment"
              options={{ payments: TOUR_PAYMENT_OPTIONS }}
              sx={{ my: 3 }}
            />

            <Button
              size="small"
              color="inherit"
              disabled={isSubmitting}
              onClick={() => onChangeStep('back')}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            >
              Quay lại
            </Button>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <CheckoutSummary
              checkoutState={checkoutState}
              onEdit={() => onChangeStep('go', 0)}
            />

            <Box py={3}>
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Hoàn tất đặt tour
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Form>
      <Dialog open={otpDialogOpen} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Xác thực OTP</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {otpLoading ? (
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              Đang gửi mã OTP... Vui lòng đợi trong giây lát
            </Typography>
          ) : (
            <>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Vui lòng xác nhận mã OTP để hoàn tất thanh toán.
              </Typography>
              <TextField
                fullWidth
                label="Mã OTP"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
              />
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={otpLoading}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmOtp}
            disabled={otpLoading || otpInput !== otpCode}
          >
            {otpLoading ? 'Đang gửi...' : 'Xác nhận'}
          </Button>
        </DialogActions>
      </Dialog>

      {storeTourCode && (
        <CheckoutOrderComplete tourCode={storeTourCode} resetTourCode={setStoreTourCode} open onDownloadPDF={openPDF.onTrue} />
      )}
      {renderDetailsDialog()}
    </>
  );
}
