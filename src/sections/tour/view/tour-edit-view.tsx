import type { ITourItem, TourItem } from 'src/types/tour';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { TourNewEditForm } from '../tour-new-edit-form';
import { Button } from '@mui/material';
import { RouterLink } from 'src/routes/components';
import { Iconify } from 'src/components/iconify';
import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

type Props = {
  tour?: TourItem;
  mutateTour: () => void;
};

export function TourEditView({ tour, mutateTour }: Props) {
  const { user } = useAuthContext();
  return (
    <RoleBasedGuard hasContent currentRole={user?.role} allowedRoles={['ROLE_ADMIN']} sx={{ py: 10 }}>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Đang chỉnh sửa tour..."
          links={[
            { name: 'Tổng quan', href: paths.dashboard.root },
            { name: 'Quản lý tour', href: paths.dashboard.tour.root },
            { name: tour?.title },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.tour.root}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
            >
              Quay lại
            </Button>
          }
        />

        <TourNewEditForm currentTour={tour} mutateTour={mutateTour} />
      </DashboardContent>
    </RoleBasedGuard>
  );
}
