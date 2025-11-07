import type { TableHeadCellProps } from 'src/components/table';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import { CheckoutCartProduct } from './checkout-cart-product';
import { TourCheckoutContextValue } from 'src/types/booking';
import { Paper, Stack } from '@mui/material';

// ----------------------------------------------------------------------

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'tour', label: 'Tour đã đặt' },
  { id: 'price', label: 'Giá' },
  { id: 'quantity', label: 'Số lượng khách' },
  { id: 'totalAmount', label: 'Tổng tiền', align: 'right' },
  { id: '' },
];

// ----------------------------------------------------------------------

type Props = {
  checkoutState: TourCheckoutContextValue['state'];
  onDeleteItem: TourCheckoutContextValue['onDeleteTour'];
  onChangeQuantity: TourCheckoutContextValue['onChangeTourQuantity'];
};


export function CheckoutCartProductList({
  checkoutState,
  onDeleteItem,
  onChangeQuantity,
}: Props) {
  return (
    <Scrollbar>
      <Stack spacing={2} sx={{ px: 1 }}>
        {checkoutState.items.map((item) => (
          <Paper
            key={item.id}
            variant="elevation"
            sx={{
              px: 2,
              pb: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <CheckoutCartProduct
              row={item}
              onDelete={onDeleteItem}
              onChangeQuantity={onChangeQuantity}
            />
          </Paper>
        ))}
      </Stack>
    </Scrollbar>
  );
}
