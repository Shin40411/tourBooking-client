import type { IUserItem, UserItem } from 'src/types/user';

import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { RouterLink } from 'src/routes/components';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

import { UserQuickEditForm } from './user-quick-edit-form';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { UserChangePassword } from './user-change-password';
import { JWT_STORAGE_KEY, JWT_USER_INFO } from 'src/auth/context/jwt';
import { getUserInfoFromSession } from 'src/utils/get-data-session';

// ----------------------------------------------------------------------

type Props = {
  row: UserItem;
  editHref: string;
  index: number;
  onDeleteRow: () => void;
};

export function UserTableRow({ row, editHref, index, onDeleteRow }: Props) {
  const me = getUserInfoFromSession();

  const menuActions = usePopover();
  const confirmDialog = useBoolean();
  const confirmChangePass = useBoolean();

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <li>
          <MenuItem component={RouterLink} href={editHref} onClick={() => menuActions.onClose()}>
            <Iconify icon="solar:pen-bold" />
            Sửa
          </MenuItem>
        </li>
        <MenuItem onClick={confirmChangePass.onTrue}>
          <Iconify icon="solar:lock-password-outline" />
          Đổi mật khẩu
        </MenuItem>
        {(me && row.id !== me.id) &&
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
        }
      </MenuList>
    </CustomPopover >
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Xác nhận xóa tài khoản này"
      content="Dữ liệu tài khoản là dữ liệu quan trọng bạn có chắc chắn muốn xóa?"
      action={
        <Button variant="contained" color="error" onClick={onDeleteRow}>
          Có, tôi muốn xóa
        </Button>
      }
    />
  );

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell align="center" sx={{ width: 80 }}>
          {index}
        </TableCell>
        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt={row.username} src={row.username} />

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link
                component={RouterLink}
                href={editHref}
                color="inherit"
                sx={{ cursor: 'pointer' }}
              >
                {row.username}
              </Link>
            </Stack>
          </Box>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Box component="span" sx={{ color: 'text.disabled' }}>
            {row.email}
          </Box>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.phone}</TableCell>
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
      <UserChangePassword confirmChangePass={confirmChangePass} selectedId={row.id} />
    </>
  );
}
