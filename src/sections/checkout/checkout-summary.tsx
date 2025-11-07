import type { Theme, SxProps } from '@mui/material/styles';
import type { CheckoutContextValue } from 'src/types/checkout';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { TourCheckoutContextValue } from 'src/types/booking';
import { fCurrencyVN } from 'src/utils/format-number';
import { Avatar, CardContent } from '@mui/material';
import { fDate } from 'src/utils/format-time-vi';
import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

type Props = {
  onEdit?: () => void;
  checkoutState: TourCheckoutContextValue['state'];
};

export function CheckoutSummary({ onEdit, checkoutState }: Props) {
  const { subtotal, total, items, contactInfo } = checkoutState;

  const rowStyles: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <Stack spacing={3}>
      {/* Tóm tắt giá tiền */}
      <Card>
        <CardHeader
          title="Tóm tắt đơn tour"
          action={
            onEdit && (
              <Button
                size="small"
                onClick={onEdit}
                startIcon={<Iconify icon="solar:pen-bold" />}
              >
                Chỉnh sửa lại thông tin
              </Button>
            )
          }
          sx={{ mb: 3 }}
        />

        {!!items?.length && (
          <>
            <CardContent>
              <Stack spacing={3}>
                {items.map((row) => (
                  <Box key={row.id}>
                    <Avatar
                      variant="rounded"
                      alt={row.title}
                      src={row.image}
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                        borderRadius: 2,
                        mb: 2,
                      }}
                    />

                    <Stack spacing={0.75}>
                      <Typography variant="h6" noWrap>
                        {row.title}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Mã tour: <strong>{row.tourCode}</strong>
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Thời lượng: {row.duration}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Ngày khởi hành: {fDate(row.date) ?? '-'}
                      </Typography>

                      {!!row.locations?.length && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                        >
                          Địa điểm:
                          {row.locations.map((loc: any) => (
                            <Label
                              key={loc.id}
                              color="default"
                              sx={{
                                ml: 0.5,
                                fontSize: '0.75rem',
                                px: 0.75,
                                py: 0.25,
                              }}
                            >
                              {loc.name}
                            </Label>
                          ))}
                        </Typography>
                      )}

                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography variant="body2" color="text.secondary">
                          Hành khách tham gia:
                        </Typography>
                        <Typography variant="body2">
                          <strong>{row.quantity}</strong> người
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </>
        )}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {contactInfo && (
          <>
            <CardHeader title="Thông tin liên hệ" />
            <CardContent>
              <Stack spacing={1.5}>
                <Typography variant="body2">
                  <strong>Họ và tên:</strong> {contactInfo.fullName || '-'}
                </Typography>
                <Typography variant="body2">
                  <strong>Email:</strong> {contactInfo.email || '-'}
                </Typography>
                <Typography variant="body2">
                  <strong>Số điện thoại:</strong> {contactInfo.phone || '-'}
                </Typography>
                {contactInfo.note && (
                  <Typography variant="body2">
                    <strong>Ghi chú:</strong> {contactInfo.note}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </>
        )}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack spacing={2} sx={{ p: 3 }}>
          <Box sx={{ ...rowStyles }}>
            <Typography component="span" variant="subtitle1" sx={{ flexGrow: 1 }}>
              Tổng cộng
            </Typography>

            <Box sx={{ textAlign: 'right' }}>
              <Typography
                component="span"
                variant="subtitle1"
                sx={{ display: 'block', color: 'error.main' }}
              >
                {fCurrencyVN(total)}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Card>
    </Stack>
  );
}
