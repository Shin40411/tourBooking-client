import { Box, Button, Card, Table, TableBody, TablePagination } from "@mui/material";
import { useBoolean } from "minimal-shared/hooks";
import { RoleBasedGuard } from "src/auth/guard";
import { useAuthContext } from "src/auth/hooks";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { emptyRows, TableEmptyRows, TableHeadCellProps, TableHeadCustom, TableNoData, TablePaginationCustom, useTable } from "src/components/table";
import { DashboardContent } from "src/layouts/dashboard";
import { RouterLink } from "src/routes/components";
import { paths } from "src/routes/paths";
import { LocationTableRow } from "../location-table-row";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { deleteLocation, useGetLocations } from "src/actions/location";
import { LocationNewEditForm } from "../location-new-edit-form";

const TABLE_HEAD: TableHeadCellProps[] = [
    { id: 'index', label: '#', width: 80, align: "center" },
    { id: 'name', label: 'Tên địa điểm' },
    { id: '', width: 88 },
];

export function LocationListView() {
    const table = useTable();
    const { user } = useAuthContext();
    const formDialog = useBoolean();
    const [editData, setEditData] = useState<{ id: number; name: string } | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const {
        locations = [],
        locationsEmpty,
        locationsLoading,
        pagination,
        mutation: refetchLocations
    } = useGetLocations({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        enabled: user?.role === "ROLE_ADMIN"
    });

    const handleDeleteRow = useCallback(
        async (id: number) => {
            try {
                await deleteLocation(id);
                refetchLocations();
                toast.success('Xóa địa điểm thành công!');
            } catch (error: any) {
                console.error(error);
                toast.error(error || 'Xóa địa điểm thất bại, vui lòng thử lại!');
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
        <RoleBasedGuard hasContent currentRole={user?.role} allowedRoles={['ROLE_ADMIN']} sx={{ py: 10 }}>
            <DashboardContent>
                <CustomBreadcrumbs
                    heading="Danh sách địa điểm"
                    links={[
                        { name: 'Tổng quan', href: paths.dashboard.root },
                        { name: 'Địa điểm', href: paths.dashboard.location.root },
                        { name: 'Danh sách' },
                    ]}
                    action={
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                            onClick={() => {
                                setEditData(null);
                                formDialog.onTrue();
                            }}
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
                    <Box sx={{ position: 'relative' }}>
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
                                    {locationsLoading ? (
                                        <TableEmptyRows
                                            height={table.dense ? 56 : 76}
                                            emptyRows={rowsPerPage} // Use rowsPerPage instead of table.rowsPerPage
                                        />
                                    ) : (
                                        locations.map((row, index) => (
                                            <LocationTableRow
                                                key={row.id}
                                                row={row}
                                                index={page * rowsPerPage + index + 1}
                                                onDeleteRow={() => handleDeleteRow(row.id)}
                                                setEditData={setEditData}
                                                formDialog={formDialog}
                                            />
                                        ))
                                    )}

                                    <TableEmptyRows
                                        height={table.dense ? 56 : 76}
                                        emptyRows={emptyRows(
                                            table.page,
                                            table.rowsPerPage,
                                            pagination.totalRecord
                                        )}
                                    />

                                    <TableNoData notFound={locationsEmpty} />
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
                <LocationNewEditForm
                    open={formDialog.value}
                    onClose={formDialog.onFalse}
                    editData={editData}
                    refetch={refetchLocations}
                />
            </DashboardContent>
        </RoleBasedGuard>
    );
}