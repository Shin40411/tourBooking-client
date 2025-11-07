import type { ITourBooker } from 'src/types/tour';
import type { BoxProps } from '@mui/material/Box';

import { useState, useCallback, ChangeEvent, useEffect } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Pagination from '@mui/material/Pagination';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { Iconify } from 'src/components/iconify';
import { payBooking, useGetBookedByTour } from 'src/actions/booking';
import { IBookingList } from 'src/types/booking';
import { BookerItem } from './tour-booker-item';
import { Skeleton, Stack, TablePagination, Typography } from '@mui/material';
import { toast } from 'sonner';

// ----------------------------------------------------------------------

type Props = BoxProps & {
  tourId: number;
};

export function TourDetailsBookers({ tourId, sx, ...other }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { booked: currentBookedList, mutation, bookedEmpty, bookedLoading, pagination } = useGetBookedByTour({
    pageNumber: page + 1,
    pageSize: rowsPerPage,
    enabled: !!tourId,
    tourId: tourId,
  });

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const handleClick = useCallback(
    async (itemId: string, newStatus: string) => {
      try {
        setLoadingId(itemId);
        let status = true;
        if (newStatus === 'PAID') {
          status = false;
        }

        await payBooking(Number(itemId), status);
        await mutation();

        if (newStatus === 'PAID')
          toast.info(`Cập nhật trạng thái thanh toán thành chưa thanh toán`);
        else
          toast.success(`Cập nhật trạng thái thanh toán thành đã thanh toán`);

      } catch (error) {
        console.error('Lỗi khi thanh toán booking:', error);
        toast.error('Lỗi khi cập nhật trạng thái thanh toán');
      } finally {
        setLoadingId(null);
      }
    },
    [mutation]
  );

  return (
    <>
      {bookedLoading ? (
        <Box
          sx={{
            gap: 3,
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
          }}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} sx={{ p: 3, gap: 2, display: 'flex' }}>
              <Skeleton variant="circular" width={48} height={48} />
              <Box sx={{ flex: '1 1 auto' }}>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="50%" />
              </Box>
              <Skeleton variant="rounded" width={120} height={32} />
            </Card>
          ))}
        </Box>
      ) : bookedEmpty ? (
        <Stack alignItems="center" justifyContent="center" height="50vh">
          <Stack alignItems="center" justifyContent="center" >
            <Iconify icon="mdi:clipboard-remove-outline" width={48} sx={{ color: 'text.disabled', mb: 1 }} />
            <Typography variant="body1" color="text.secondary">
              Tour này chưa có khách.
            </Typography>
          </Stack>
        </Stack>
      ) : (
        <>
          <Box
            sx={[
              {
                gap: 3,
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
              },
              ...(Array.isArray(sx) ? sx : [sx]),
            ]}
            {...other}
          >
            {currentBookedList?.map((booker) => (
              <BookerItem
                key={booker.id}
                booker={booker}
                loadingId={loadingId}
                onSelected={() => handleClick(String(booker.id), booker.paymentStatus)}
              />
            ))}
          </Box>

          {pagination?.totalRecord && pagination.totalRecord > 0 && (
            <Box
              sx={{
                mt: { xs: 5, md: 8 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <TablePagination
                component="div"
                count={pagination.totalRecord}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 20]}
                labelRowsPerPage="Số dòng mỗi trang:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}–${to} trên ${count !== -1 ? count : `nhiều hơn ${to}`}`
                }
              />
            </Box>
          )}
        </>
      )}
    </>
  );
}

// ----------------------------------------------------------------------