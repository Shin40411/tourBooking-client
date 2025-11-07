import type { BoxProps } from '@mui/material/Box';
import type { CardProps } from '@mui/material/Card';

import { varAlpha } from 'minimal-shared/utils';
import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import FormHelperText from '@mui/material/FormHelperText';

import { Iconify } from 'src/components/iconify';
import { Grid, TextField, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


// ----------------------------------------------------------------------

type Props = {
  name: string;
  options: {
    payments: {
      value: string;
      label: string;
      description: string;
    }[];
  };
} & CardProps;
export function CheckoutPaymentMethods({ name, options, sx, ...other }: Props) {
  const { control, watch } = useFormContext();
  const selectedPayment = watch(name);
  return (
    <Card sx={sx} {...other}>
      <CardHeader title="Phương thức thanh toán" />

      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <Box
            sx={{
              p: 3,
              gap: 2.5,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {options.payments.map((option) => {
              const isSelected = value === option.value;

              return (
                <OptionItem
                  key={option.value}
                  option={option}
                  selected={isSelected}
                  onClick={() => onChange(option.value)}
                />
              );
            })}

            {!!error && (
              <FormHelperText error sx={{ mt: 0, px: 2 }}>
                {error.message}
              </FormHelperText>
            )}
          </Box>
        )}
      />
      {selectedPayment === 'BANKING' && (
        <Box
          sx={{
            bgcolor: 'red',
            borderTop: (theme) => `1px dashed ${theme.palette.divider}`,
            p: 3,
          }}
        >
          <Typography variant="subtitle1" color='warning' gutterBottom>
            Thông tin chuyển khoản
          </Typography>

          <Typography variant="body2" color='success'>
            STK:{' '}
            <Box component="span" sx={{ color: '#fff', fontWeight: 'bold' }}>
              07001012563988
            </Box>{' '}
            tại ngân hàng MSB BANK
          </Typography>
        </Box>
      )}
      {selectedPayment === 'VISA' && (
        <Box sx={{ mt: 2, p: 3, borderRadius: 1, bgcolor: 'background.paper', boxShadow: 0 }}>
          <Typography variant="subtitle1" gutterBottom>
            Thông tin thẻ
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="visa.cardholderName"
                control={control}
                rules={{ required: 'Tên chủ thẻ là bắt buộc' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Tên chủ thẻ"
                    placeholder="Nguyễn Văn A"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="visa.cardNumber"
                control={control}
                rules={{
                  required: 'Số thẻ là bắt buộc',
                  pattern: {
                    value: /^[0-9]{13,19}$/,
                    message: 'Số thẻ phải gồm 13-19 chữ số',
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Số thẻ"
                    placeholder="4242 4242 4242 4242"
                    inputProps={{ inputMode: 'numeric', maxLength: 19 }}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Controller
                name="visa.cvv"
                control={control}
                rules={{
                  required: 'CVV là bắt buộc',
                  pattern: { value: /^[0-9]{3,4}$/, message: 'CVV phải là 3 hoặc 4 chữ số' },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="CVV"
                    placeholder="123"
                    inputProps={{ inputMode: 'numeric', maxLength: 4 }}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="visa.expiry"
                  control={control}
                  rules={{ required: 'Ngày hết hạn là bắt buộc' }}
                  render={({ field, fieldState }) => (
                    <DatePicker
                      views={['year', 'month']}
                      label="Hạn dùng (MM/YYYY)"
                      format="MM/YYYY"
                      value={field.value ? dayjs(field.value, 'MM/YYYY') : null}
                      onChange={(date) => field.onChange(date ? date.format('MM/YYYY') : '')}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!fieldState.error,
                          helperText: fieldState.error?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Box>
      )
      }
    </Card >
  );
}

// ----------------------------------------------------------------------

type OptionItemProps = BoxProps & {
  selected: boolean;
  option: {
    value: string;
    label: string;
    description: string;
  };
};

function OptionItem({ sx, option, selected, ...other }: OptionItemProps) {
  return (
    <Box
      sx={[
        (theme) => ({
          borderRadius: 1.5,
          border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.24)}`,
          transition: theme.transitions.create(['box-shadow'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shortest,
          }),
          ...(selected && { boxShadow: `0 0 0 2px ${theme.vars.palette.text.primary}` }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          cursor: 'pointer',
          alignItems: 'flex-start',
        }}
      >
        <Box
          sx={{
            gap: 0.5,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            typography: 'subtitle1',
          }}
        >
          {option.label}
          <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
            {option.description}
          </Box>
        </Box>

        <Box sx={{ gap: 1, display: 'flex', alignItems: 'center' }}>
          {option.value === 'VISA' && (
            <>
              <Iconify icon="payments:mastercard" width={36} height="auto" />
              <Iconify icon="payments:visa" width={36} height="auto" />
            </>
          )}
          {option.value === 'BANKING' && <Iconify icon="streamline-sharp:investing-and-banking" width={24} />}
          {option.value === 'CASH' && <Iconify icon="solar:wad-of-money-bold" width={32} />}
        </Box>
      </Box>
    </Box>
  );
}
