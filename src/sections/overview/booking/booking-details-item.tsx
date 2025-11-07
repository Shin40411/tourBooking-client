import { Avatar, Box, Button, CardProps, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Drawer, IconButton, ListItemText, MenuItem, MenuList, Table, TableBody, TableCell, TableRow, Typography, useColorScheme } from "@mui/material";
import { useBoolean, usePopover } from "minimal-shared/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { deleteBooking, useGetContactInfo } from "src/actions/booking";
import { useGetTour } from "src/actions/tour";
import { useAuthContext } from "src/auth/hooks";
import { CustomPopover } from "src/components/custom-popover";
import { Iconify } from "src/components/iconify";
import { Label } from "src/components/label";
import { TableHeadCellProps } from "src/components/table";
import { IBookingList } from "src/types/booking";
import { fDate } from "src/utils/format-time-vi";

type Props = CardProps & {
    title?: string;
    subheader?: string;
    headCells: TableHeadCellProps[];
    tableData: IBookingList[];
};

type RowItemProps = {
    row: Props['tableData'][number];
};

export function BookingDetailsItem({ row }: RowItemProps) {
    const { user } = useAuthContext();
    const openDeleteState = useBoolean();

    const { contactInfo, contactInfoLoading } = useGetContactInfo({
        contactInfoId: row.contactInfoId,
        enabled: !!row
    });

    const { tour, tourLoading } = useGetTour(row.tourId);

    const locationOptions = tour?.locations.flatMap((l) => `${l.name} `);

    const menuActions = usePopover();

    const { mode } = useColorScheme();
    const lightMode = mode === 'light';

    const [open, setOpen] = useState(false);

    const handleClose = () => setOpen(false);

    const handleViewInvoice = () => {
        menuActions.onClose();
        setOpen(true);
    };

    const handleDelete = async () => {
        try {
            menuActions.onClose();
            await deleteBooking(row.id);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const deleteDialog = () => (
        <Dialog open={openDeleteState.value} onClose={openDeleteState.onFalse}>
            <DialogTitle>Xác nhận xóa thông tin đặt tour này?</DialogTitle>
            <DialogContent>
                <Typography variant="caption" color="warning">Thông tin đặt tour là dữ liệu quan trọng, khi xóa rồi sẽ không thể hoàn tác!</Typography>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="warning" onClick={handleDelete}>Có, tôi muốn xóa</Button>
                <Button variant="outlined" onClick={openDeleteState.onFalse}>Hủy</Button>
            </DialogActions>
        </Dialog>
    );

    const renderMenuActions = () => (
        <CustomPopover
            open={menuActions.open}
            anchorEl={menuActions.anchorEl}
            onClose={menuActions.onClose}
            slotProps={{ arrow: { placement: 'right-top' } }}
        >
            <MenuList>
                <MenuItem onClick={handleViewInvoice}>
                    <Iconify icon="eva:cloud-download-fill" />
                    Xem hóa đơn
                </MenuItem>


                {user?.role === "ROLE_ADMIN" &&
                    <>
                        <Divider sx={{ borderStyle: 'dashed' }} />
                        <MenuItem onClick={() => { openDeleteState.onTrue(); menuActions.onClose(); }} sx={{ color: 'error.main' }}>
                            <Iconify icon="solar:trash-bin-trash-bold" />
                            Xóa
                        </MenuItem>
                    </>
                }
            </MenuList>
        </CustomPopover>
    );

    const renderInvoice = () => (
        <Drawer anchor="right" open={open} onClose={handleClose} PaperProps={{ sx: { width: 480 } }}>
            <Box sx={{ p: 3 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 3,
                        px: 2,
                        py: 1.5,
                        borderRadius: 1.5,
                        background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
                        color: 'common.white',
                    }}
                >
                    <Box display="flex" alignItems="center" gap={1}>
                        <Iconify icon="solar:bill-list-bold-duotone" width={28} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Chi tiết hóa đơn
                        </Typography>
                    </Box>

                    <IconButton onClick={handleClose} sx={{ color: 'common.white' }}>
                        <Iconify icon="eva:close-fill" />
                    </IconButton>
                </Box>

                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Thông tin tour
                </Typography>
                <Table size="small">
                    <TableBody>
                        <TableRow>
                            <TableCell width="40%">Mã tour</TableCell>
                            <TableCell>{tour?.tourCode ?? '-'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Tên tour</TableCell>
                            <TableCell>{tour?.title ?? '-'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Giá</TableCell>
                            <TableCell>{tour?.price?.toLocaleString('vi-VN')}₫</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Số lượt đặt còn lại</TableCell>
                            <TableCell>{tour?.slots ?? '-'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Thời lượng</TableCell>
                            <TableCell>{tour?.duration ?? '-'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Địa điểm</TableCell>
                            <TableCell>{locationOptions}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                    Thông tin liên hệ
                </Typography>
                <Table size="small">
                    <TableBody>
                        <TableRow>
                            <TableCell width="40%">Họ tên</TableCell>
                            <TableCell>{contactInfo?.fullName ?? '-'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>{contactInfo?.email ?? '-'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Số điện thoại</TableCell>
                            <TableCell>{contactInfo?.phone ?? '-'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Ghi chú</TableCell>
                            <TableCell>
                                {contactInfo?.note ? (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                            color: 'text.secondary',
                                        }}
                                    >
                                        {contactInfo.note}
                                    </Typography>
                                ) : (
                                    '-'
                                )}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                    Thông tin đặt chỗ
                </Typography>
                <Table size="small">
                    <TableBody>
                        <TableRow>
                            <TableCell width="40%">Mã đặt chỗ</TableCell>
                            <TableCell>{tour?.tourCode}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Khách đăng ký</TableCell>
                            <TableCell>{row.quantity ? `${row.quantity} người` : '-'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Ngày khởi hành</TableCell>
                            <TableCell>{tour?.date ? fDate(tour.date) : '-'}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Box>
        </Drawer>
    );

    return (
        <>
            <TableRow>
                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                            variant="rounded"
                            alt={tour?.image}
                            src={tour?.image}
                            sx={{ width: 48, height: 48 }}
                        />
                        {locationOptions}
                    </Box>
                </TableCell>

                <TableCell>
                    <ListItemText
                        primary={contactInfo?.fullName}
                        secondary={contactInfo?.phone}
                        slotProps={{
                            primary: {
                                noWrap: true,
                                sx: { typography: 'body2' },
                            },
                            secondary: {
                                sx: { mt: 0.5, typography: 'caption' },
                            },
                        }}
                    />
                </TableCell>

                <TableCell>
                    <ListItemText
                        primary={fDate(row.bookingDate)}
                        slotProps={{
                            primary: {
                                noWrap: true,
                                sx: { typography: 'body2' },
                            }
                        }}
                    />
                </TableCell>

                <TableCell>
                    <ListItemText
                        primary={fDate(tour?.date)}
                        slotProps={{
                            primary: {
                                noWrap: true,
                                sx: { typography: 'body2' },
                            }
                        }}
                    />
                </TableCell>

                <TableCell>
                    <Label
                        variant={lightMode ? 'soft' : 'filled'}
                        color={
                            (row.paymentStatus === 'PAID' && 'success') ||
                            (row.status === 'PENDING' && 'warning') ||
                            'error'
                        }
                    >
                        {row.paymentStatus === 'PAID' ? 'Đã thanh toán' : row.paymentStatus === 'PENDING' ? 'Đang chờ' : 'Không rõ'}
                    </Label>
                </TableCell>

                <TableCell align="right" sx={{ pr: 1 }}>
                    <IconButton color={menuActions.open ? 'inherit' : 'default'} onClick={menuActions.onOpen}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            {renderMenuActions()}
            {deleteDialog()}

            {open && renderInvoice()}
        </>
    );
}
