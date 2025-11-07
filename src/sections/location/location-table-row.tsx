import { Box, Button, IconButton, MenuItem, MenuList, TableCell, TableRow } from "@mui/material";
import { useBoolean, UseBooleanReturn, usePopover } from "minimal-shared/hooks";
import { ConfirmDialog } from "src/components/custom-dialog";
import { CustomPopover } from "src/components/custom-popover";
import { Iconify } from "src/components/iconify";
import { RouterLink } from "src/routes/components";
import { ILocationItem } from "src/types/location";

type Props = {
    row: ILocationItem;
    index: number;
    onDeleteRow: () => void;
    setEditData: (val: any) => void;
    formDialog: UseBooleanReturn;
};

export function LocationTableRow({ row, index, onDeleteRow, setEditData, formDialog }: Props) {
    const menuActions = usePopover();
    const confirmDialog = useBoolean();
    const renderMenuActions = () => (
        <CustomPopover
            open={menuActions.open}
            anchorEl={menuActions.anchorEl}
            onClose={menuActions.onClose}
            slotProps={{ arrow: { placement: 'right-top' } }}
        >
            <MenuList>
                <MenuItem onClick={() => {
                    menuActions.onClose();
                    setEditData({ id: row.id, name: row.name });
                    formDialog.onTrue();
                }
                }>
                    <Iconify icon="solar:pen-bold" />
                    Sửa
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        confirmDialog.onTrue();
                        menuActions.onClose();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Xóa
                </MenuItem>
            </MenuList>
        </CustomPopover>
    );

    const renderConfirmDialog = () => (
        <ConfirmDialog
            open={confirmDialog.value}
            onClose={confirmDialog.onFalse}
            title="Xác nhận xóa địa điểm này"
            content="Dữ liệu địa điểm là dữ liệu quan trọng bạn có chắc chắn muốn xóa?"
            action={
                <Button variant="contained" color="error" onClick={onDeleteRow}>
                    Có, tôi muốn xóa
                </Button>
            }
        />
    );
    return (
        <>
            <TableRow>
                <TableCell align="center" sx={{ width: 80 }}>
                    {index}
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.name}</TableCell>
                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            color={menuActions.open ? 'inherit' : 'default'}
                            onClick={menuActions.onOpen}
                        >
                            <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                    </Box>
                </TableCell>
            </TableRow>
            {renderMenuActions()}
            {renderConfirmDialog()}
        </>
    );
}