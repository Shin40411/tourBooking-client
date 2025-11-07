import type { TableHeadCellProps } from 'src/components/table';
import type { IUserItem, IUserTableFilters } from 'src/types/user';

import { useState, useCallback, ChangeEvent, useMemo, SyntheticEvent } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import { _roles, _userList, USER_STATUS_OPTIONS } from 'src/_mock';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { UserTableRow } from '../user-table-row';
import { UserTableToolbar } from '../user-table-toolbar';
import { UserTableFiltersResult } from '../user-table-filters-result';
import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';
import { deleteUser, useGetUsers } from 'src/actions/user';
import { TablePagination } from '@mui/material';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'index', label: '#', width: 80, align: "center" },
  { id: 'username', label: 'Tên tài khoản' },
  { id: 'email', label: 'Địa chỉ email' },
  { id: 'phone', label: 'Số điện thoại' },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function UserListView() {
  const table = useTable();
  const { user } = useAuthContext();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [roleTab, setRoleTab] = useState<'ROLE_ADMIN' | 'ROLE_USER'>('ROLE_USER');

  const handleChangeTab = (_: SyntheticEvent, newValue: 'ROLE_ADMIN' | 'ROLE_USER') => {
    setRoleTab(newValue);
    setPage(0);
  };

  const { users: CurrentList, usersEmpty, pagination, usersLoading, mutation } = useGetUsers({
    pageNumber: page + 1,
    pageSize: rowsPerPage,
    enabled: !!roleTab,
    role: roleTab
  });

  const handleDeleteRow = useCallback(
    async (id: number) => {
      try {
        await deleteUser(id);
        toast.success('Xóa người dùng thành công!');
        mutation();
      } catch (error: any) {
        console.error(error);
        toast.error(error || "Đã có lỗi xảy ra!");
      }
    },
    []
  );

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <RoleBasedGuard hasContent currentRole={user?.role} allowedRoles={['ROLE_ADMIN']} sx={{ py: 10 }}>
        <DashboardContent>
          <CustomBreadcrumbs
            heading="Danh sách tài khoản"
            links={[
              { name: 'Tổng quan', href: paths.dashboard.root },
              { name: 'Tài khoản người dùng', href: paths.dashboard.user.root },
              { name: 'Danh sách' },
            ]}
            action={
              <Button
                component={RouterLink}
                href={paths.dashboard.user.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Tạo mới
              </Button>
            }
            sx={{ mb: { xs: 3, md: 5 } }}
          />

          <Card
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Tabs
              value={roleTab}
              onChange={handleChangeTab}
              sx={{ borderBottom: 1, borderColor: 'divider', p: 2 }}
            >
              <Tab value="ROLE_USER"
                label={
                  <Label variant='inverted' startIcon={<Iconify icon="mdi:user" />}>Người dùng</Label>
                } />
              <Tab value="ROLE_ADMIN" label={
                <Label variant='inverted' startIcon={<Iconify icon="eos-icons:admin" />}>Quản trị viên</Label>
              } />
            </Tabs>

            <Box sx={{ position: 'relative', flex: 1 }}>
              <Scrollbar>
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headCells={TABLE_HEAD}
                    rowCount={pagination.totalRecord}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                  />

                  <TableBody>
                    {usersLoading ? (
                      <TableEmptyRows
                        height={table.dense ? 56 : 76}
                        emptyRows={table.rowsPerPage}
                      />
                    ) : (
                      CurrentList
                        .map((row, index) => (
                          <UserTableRow
                            key={row.id}
                            index={table.page * table.rowsPerPage + index + 1}
                            row={row}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            editHref={paths.dashboard.user.edit(String(row.id))}
                          />
                        ))
                    )}

                    <TableEmptyRows
                      height={table.dense ? 56 : 56 + 20}
                      emptyRows={emptyRows(
                        table.page,
                        table.rowsPerPage,
                        pagination.totalRecord
                      )}
                    />

                    <TableNoData notFound={usersEmpty} />
                  </TableBody>
                </Table>
              </Scrollbar>
            </Box>

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
              sx={{
                borderTop: '1px solid #e0e0e0',
                mt: 'auto',
              }}
            />
          </Card>
        </DashboardContent>
      </RoleBasedGuard>
    </>
  );
}