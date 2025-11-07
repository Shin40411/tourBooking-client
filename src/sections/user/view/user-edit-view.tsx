import type { IUserItem, UserItem } from 'src/types/user';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserNewEditForm } from '../user-new-edit-form';
import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

type Props = {
  user?: UserItem;
};

export function UserEditView({ user: currentUser }: Props) {
  const { user } = useAuthContext();

  return (
    <RoleBasedGuard hasContent currentRole={user?.role} allowedRoles={['ROLE_ADMIN']} sx={{ py: 10 }}>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Đang chỉnh sửa tài khoản..."
          backHref={paths.dashboard.user.list}
          links={[
            { name: 'Tổng quan', href: paths.dashboard.root },
            { name: 'Tài khoản người dùng', href: paths.dashboard.user.root },
            { name: currentUser?.username },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <UserNewEditForm currentUser={currentUser} />
      </DashboardContent>
    </RoleBasedGuard>
  );
}
