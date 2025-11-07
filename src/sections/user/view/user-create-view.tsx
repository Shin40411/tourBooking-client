import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserNewEditForm } from '../user-new-edit-form';
import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export function UserCreateView() {
  const { user } = useAuthContext();

  return (
    <RoleBasedGuard hasContent currentRole={user?.role} allowedRoles={['ROLE_ADMIN']} sx={{ py: 10 }}>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Đang tạo tài khoản mới..."
          links={[
            { name: 'Tổng quan', href: paths.dashboard.root },
            { name: 'Tài khoản người dùng', href: paths.dashboard.user.root },
            { name: 'Tạo mới' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <UserNewEditForm />
      </DashboardContent>
    </RoleBasedGuard>
  );
}
