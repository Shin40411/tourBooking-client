import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { TourNewEditForm } from '../tour-new-edit-form';
import { Box, Button } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

export function TourCreateView() {
  const { user } = useAuthContext();
  return (
    <RoleBasedGuard hasContent currentRole={user?.role} allowedRoles={['ROLE_ADMIN']} sx={{ py: 10 }}>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Đang tạo tour mới..."
          links={[
            { name: 'Tổng quan', href: paths.dashboard.root },
            { name: 'Quản lý tour', href: paths.dashboard.tour.root },
            { name: 'Tạo mới' },
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
        <TourNewEditForm />
      </DashboardContent>
    </RoleBasedGuard>
  );
}
