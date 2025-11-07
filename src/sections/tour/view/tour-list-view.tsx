import type { ITourItem, ITourFilters, TourFilterParams } from 'src/types/tour';

import { orderBy } from 'es-toolkit';
import { ChangeEvent, useEffect, useState } from 'react';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { _tours, _tourGuides } from 'src/_mock';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { TourList } from '../tour-list';
import { TourSearch } from '../tour-search';
import { TourFiltersResult } from '../tour-filters-result';
import { useGetTours } from 'src/actions/tour';
import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard';
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export function TourListView() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { user } = useAuthContext();
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'popular'>('latest');

  const filters = useSetState<TourFilterParams>({
    locationIds: [],
    extras: [],
    includes: [],
    title: '',
    fromDate: null,
    toDate: null,
    priceRange: undefined,
  });

  const { state: currentFilters } = filters;

  const { tours, toursLoading, toursEmpty, pagination, mutateTours } = useGetTours(currentFilters, page + 1, rowsPerPage);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    mutateTours();
  }, [router]);

  const canReset =
    (currentFilters.locationIds && currentFilters.locationIds.length > 0) ||
    (currentFilters.extras && currentFilters.extras.length > 0) ||
    (currentFilters.includes && currentFilters.includes.length > 0) ||
    currentFilters.title ||
    currentFilters.fromDate ||
    currentFilters.toDate ||
    currentFilters.priceRange;

  const notFound = toursEmpty && canReset;

  const renderFilters = () => (
    <Box
      sx={{
        gap: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-end', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
      }}
    >
      <TourSearch redirectPath={(id) => paths.dashboard.tour.details(String(id))} />
    </Box>
  );

  const renderResults = () => (
    <TourFiltersResult filters={filters} totalResults={tours.length} />
  );

  return (
    <RoleBasedGuard hasContent currentRole={user?.role} allowedRoles={['ROLE_ADMIN']} sx={{ py: 10 }}>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Danh sách tour"
          links={[
            { name: 'Tổng quan', href: paths.dashboard.root },
            { name: 'Quản lý tour', href: paths.dashboard.tour.root },
            { name: 'Danh sách' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.tour.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Tạo mới
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
          {renderFilters()}
          {canReset && renderResults()}
        </Stack>

        {notFound && <EmptyContent filled sx={{ py: 10 }} />}

        <TourList
          tours={tours}
          onMutate={mutateTours}
          page={page}
          rowsPerPage={rowsPerPage}
          pagination={pagination}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </DashboardContent>
    </RoleBasedGuard>
  );
}
