import { Box, Button, Card, IconButton, Menu, MenuItem, MenuList, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { useBoolean } from "minimal-shared/hooks";
import { ChangeEvent, MouseEvent, useState } from "react";
import { toast } from "sonner";
import { createCategory, deleteCategory, updateCategory, useGetCategories } from "src/actions/category";
import { RoleBasedGuard } from "src/auth/guard";
import { useAuthContext } from "src/auth/hooks";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { Iconify } from "src/components/iconify";
import { DashboardContent } from "src/layouts/dashboard";
import { paths } from "src/routes/paths";
import { ICategoryDto, ICategoryItem } from "src/types/category";
import { CategoryNewEditForm } from "../category-new-edit-form";
import { EmptyContent } from "src/components/empty-content";
import { Label } from "src/components/label";
import { ConfirmDialog } from "src/components/custom-dialog";
import { CustomPopover } from "src/components/custom-popover";

export function CategoryListView() {
    const { user } = useAuthContext();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [confirmDialog, setConfirmDialog] = useState(false);

    const handleMenuOpen = (event: MouseEvent<HTMLElement>, id: number) => {
        setAnchorEl(event.currentTarget);
        setSelectedId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleOpenConfirmDelete = () => {
        setConfirmDialog(true);
        handleMenuClose();
    };

    const handleCloseConfirm = () => {
        setConfirmDialog(false);
        setSelectedId(null);
    };

    const { categories, pagination, categoriesLoading, categoriesEmpty, mutation } = useGetCategories({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        enabled: true,
    });

    const dialog = useBoolean();
    const [editingCategory, setEditingCategory] = useState<ICategoryItem | null>(null);

    const handleOpenCreate = () => {
        setEditingCategory(null);
        dialog.onTrue();
    };

    const handleOpenEdit = (item: ICategoryItem) => {
        setEditingCategory(item);
        dialog.onTrue();
    };

    const handleCloseDialog = () => {
        dialog.onFalse();
        setEditingCategory(null);
    };

    const handleDelete = async () => {
        if (!selectedId) return;
        try {
            await deleteCategory(selectedId);
            toast.success('Xóa danh mục thành công!');
            mutation();
        } catch (error) {
            toast.error('Xóa thất bại!');
            console.error(error);
        } finally {
            handleCloseConfirm();
        }
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <RoleBasedGuard hasContent currentRole={user?.role} allowedRoles={['ROLE_ADMIN']} sx={{ py: 10 }}>
            <DashboardContent>
                <CustomBreadcrumbs
                    heading="Danh sách danh mục"
                    links={[
                        { name: 'Tổng quan', href: paths.dashboard.root },
                        { name: 'Danh mục', href: paths.dashboard.category.root },
                        { name: 'Danh sách' },
                    ]}
                    action={
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                            onClick={handleOpenCreate}
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
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Tên danh mục</TableCell>
                                    <TableCell>Quốc gia</TableCell>
                                    <TableCell>Địa điểm</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {categoriesLoading && (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            <Typography>Đang tải dữ liệu...</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}

                                {categoriesEmpty && (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            <EmptyContent />
                                        </TableCell>
                                    </TableRow>
                                )}

                                {!categoriesLoading &&
                                    categories?.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.country}</TableCell>
                                            <TableCell>
                                                {item.locations.map((l) => (
                                                    <Label key={String(l.id)} variant="filled" sx={{ mr: 1 }}>{l.name}</Label>
                                                ))}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                    <IconButton onClick={(e) => handleMenuOpen(e, item.id)}>
                                                        <Iconify icon="eva:more-vertical-fill" />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

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

                <CategoryNewEditForm
                    open={dialog.value}
                    editingCategory={editingCategory}
                    onClose={handleCloseDialog}
                    mutation={mutation}
                />

                <CustomPopover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={handleMenuClose}
                    slotProps={{ arrow: { placement: 'right-top' } }}
                >
                    <MenuList>
                        <MenuItem
                            onClick={() => {
                                const category = categories.find((x) => x.id === selectedId);
                                if (category) handleOpenEdit(category);
                                handleMenuClose();
                            }}
                        >
                            <Iconify icon="solar:pen-bold" sx={{ mr: 1 }} /> Sửa
                        </MenuItem>

                        <MenuItem onClick={handleOpenConfirmDelete} sx={{ color: 'error.main' }}>
                            <Iconify icon="solar:trash-bin-trash-bold" sx={{ mr: 1 }} /> Xóa
                        </MenuItem>
                    </MenuList>
                </CustomPopover>

                <ConfirmDialog
                    open={confirmDialog}
                    onClose={handleCloseConfirm}
                    title="Xác nhận xóa danh mục"
                    content="Bạn có chắc chắn muốn xóa dữ liệu danh mục này?"
                    action={
                        <Button variant="contained" color="error" onClick={handleDelete}>
                            Có, tôi muốn xóa
                        </Button>
                    }
                />

            </DashboardContent>
        </RoleBasedGuard>
    );
}