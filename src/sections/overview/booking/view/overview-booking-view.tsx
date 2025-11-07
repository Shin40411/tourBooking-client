import Grid from '@mui/material/Grid';

import { DashboardContent } from 'src/layouts/dashboard';
import { _bookings, _bookingNew, _bookingReview, _bookingsOverview } from 'src/_mock';

import { BookingNewest } from '../booking-newest';
import { BookingDetails } from '../booking-details';
import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';
import { useGetBooked, useGetBookedList } from 'src/actions/booking';
import { ChangeEvent, useMemo, useState } from 'react';
import { Typography } from '@mui/material';
import { getUserInfoFromSession } from 'src/utils/get-data-session';

// ----------------------------------------------------------------------

export function OverviewBookingView() {
  const { user } = useAuthContext();
  const parsedData = getUserInfoFromSession();
  const userId = parsedData?.id ?? null;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const {
    bookings = [],
    bookingsLoading = false,
    pagination: adminLstPagi = { totalRecord: 0 },
    bookingsEmpty
  } = useGetBookedList({
    pageNumber: page + 1,
    pageSize: rowsPerPage,
    enabled: user?.role === "ROLE_ADMIN"
  }) ?? {};

  const {
    booked = [],
    bookedLoading = false,
    pagination: userLstPagi = { totalRecord: 0 },
    bookedEmpty
  } = useGetBooked({
    userId,
    pageNumber: page + 1,
    pageSize: rowsPerPage,
    enabled: user?.role === "ROLE_USER" && !!userId
  }) ?? {};

  const currentBookingList = useMemo(() => {
    if (user?.role === "ROLE_ADMIN") {
      return {
        list: bookings || [],
        loading: bookingsLoading,
        totalRecord: adminLstPagi?.totalRecord || 0,
        isEmpty: bookingsEmpty
      };
    } else if (user?.role === "ROLE_USER") {
      return {
        list: booked || [],
        loading: bookedLoading,
        totalRecord: userLstPagi?.totalRecord || 0,
        isEmpty: bookedEmpty
      };
    }
    return { list: [], loading: false, totalRecord: 0, isEmpty: false };
  }, [
    user?.role,
    bookings,
    bookingsLoading,
    booked,
    bookedLoading,
    adminLstPagi?.totalRecord,
    userLstPagi?.totalRecord
  ]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (!user) {
    return (
      <DashboardContent maxWidth="xl" sx={{ py: 10 }}>
        <Typography variant="h6" align="center">
          Bạn cần đăng nhập để xem danh sách đặt tour.
        </Typography>
      </DashboardContent>
    );
  }

  return (
    <RoleBasedGuard hasContent currentRole={user?.role} allowedRoles={[user?.role]} sx={{ py: 10 }}>
      <DashboardContent maxWidth="xl">
        <Grid container spacing={3}>
          {user?.role === "ROLE_ADMIN" &&
            <Grid size={12}>
              <BookingNewest
                title="Khách mới book"
                subheader={`${currentBookingList?.totalRecord} đơn đặt`}
                list={currentBookingList?.list || []}
                loading={currentBookingList?.loading || false}
              />
            </Grid>
          }

          <Grid size={12}>
            <BookingDetails
              title={`Thông tin tour ${user?.role === "ROLE_ADMIN" ? 'khách' : 'bạn'} đã đặt`}
              tableData={currentBookingList?.list || []}
              headCells={[
                { id: 'destination', label: 'Điểm đến' },
                { id: 'customer', label: 'Tên khách hàng' },
                { id: 'checkIn', label: 'Ngày đặt' },
                { id: 'date', label: 'Ngày khởi hành' },
                { id: 'paymentStatus', label: 'Trạng thái thanh toán' },
                { id: '' },
              ]}
              page={page}
              rowsPerPage={rowsPerPage}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              totalRecord={currentBookingList?.totalRecord || 0}
              isEmpty={currentBookingList.isEmpty}
            />
          </Grid>
        </Grid>
      </DashboardContent>
    </RoleBasedGuard>
  );
}
