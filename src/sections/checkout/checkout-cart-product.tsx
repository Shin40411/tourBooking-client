import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { NumberInput } from 'src/components/number-input';
import { ITourCheckoutItem, TourCheckoutContextValue } from 'src/types/booking';
import { fCurrencyVN } from 'src/utils/format-number';
import { Button } from '@mui/material';
import { fDate } from 'src/utils/format-time-vi';

// ----------------------------------------------------------------------

type Props = {
  row: ITourCheckoutItem;
  onDelete: TourCheckoutContextValue['onDeleteTour'];
  onChangeQuantity: TourCheckoutContextValue['onChangeTourQuantity'];
};

export function CheckoutCartProduct({ row, onDelete, onChangeQuantity }: Props) {

  const total = row.subtotal ?? row.price * row.quantity;

  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{
        px: 2,
        overflow: 'hidden',
      }}
    >
      <Avatar
        variant="rounded"
        alt={row.title}
        src={row.image}
        sx={{
          width: '100%',
          height: 300,
          objectFit: 'cover',
          borderRadius: 2,
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
            {row.locations.map((loc) => (
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
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pt: 1, borderTop: (theme) => `1px dashed ${theme.palette.divider}` }}
      >
        <Stack spacing={0.5}>
          <Box display="flex" gap={2}>
            <Box display="flex" flexDirection="row" gap={1}>
              <Iconify icon="heroicons:user-group-20-solid" />
              <Typography variant="body2" color="text.secondary">
                Hành khách tham gia:
              </Typography>
            </Box>
            <Box width={100}>
              <NumberInput
                hideDivider
                value={row.quantity}
                min={1}
                max={row.slots}
                onChange={(event, quantity) => onChangeQuantity(row.id, quantity)}
              />
              <Typography variant="caption" color="text.secondary">
                Còn lại: {row.slots - row.quantity} chỗ
              </Typography>
            </Box>
          </Box>

        </Stack>

        <Stack alignItems="flex-end" spacing={1}>
          <Box>
            <Button color="error" onClick={() => onDelete(row.id)} startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}>
              Gỡ bỏ tour này
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}
