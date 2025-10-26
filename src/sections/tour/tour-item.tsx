import { Box, Card, CardProps, IconButton, Link, ListItemText, MenuItem, MenuList } from '@mui/material';
import { RouterLink } from 'src/routes/components';
import { CustomPopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import { Image } from 'src/components/image';
import { fCurrencyVN } from 'src/utils/format-number';
import type { TourItem as ITourItem } from 'src/types/tour';
import { usePopover } from 'minimal-shared/hooks';
import { fDateTime } from 'src/utils/format-time-vi';

type Props = CardProps & {
  tour: ITourItem;
  editHref: string;
  detailsHref: string;
  onDelete: () => void;
};

export function TourItem({ tour, editHref, detailsHref, onDelete, sx, ...other }: Props) {
  const menuActions = usePopover();

  const renderPrice = () => (
    <Box
      sx={{
        top: 8,
        left: 8,
        zIndex: 9,
        display: 'flex',
        borderRadius: 1,
        bgcolor: 'grey.800',
        alignItems: 'center',
        position: 'absolute',
        p: '2px 6px 2px 4px',
        color: 'common.white',
        typography: 'subtitle2',
      }}
    >
      {fCurrencyVN(tour.price)}
    </Box>
  );

  const renderImage = () => (
    <Box sx={{ p: 1, position: 'relative' }}>
      {renderPrice()}
      <Image alt={tour.title} src={tour.image} sx={{ width: 1, height: 200, borderRadius: 1 }} />
    </Box>
  );

  const renderTexts = () => (
    <ListItemText
      sx={(theme) => ({ p: theme.spacing(2.5, 2.5, 2, 2.5) })}
      primary={`Lượt đặt tour: ${tour.slots}`}
      secondary={
        <Link component={RouterLink} href={detailsHref} color="inherit">
          {tour.title}
        </Link>
      }
      slotProps={{
        primary: {
          sx: { typography: 'caption', color: 'text.disabled' },
        },
        secondary: {
          noWrap: true,
          component: 'h6',
          sx: { mt: 1, color: 'text.primary', typography: 'subtitle1' },
        },
      }}
    />
  );

  const renderInfo = () => (
    <Box
      sx={(theme) => ({
        gap: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        p: theme.spacing(0, 2.5, 2.5, 2.5),
      })}
    >
      <IconButton onClick={menuActions.onOpen} sx={{ position: 'absolute', bottom: 8, right: 8 }}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, typography: 'body2' }}>
        <Iconify icon="solar:calendar-bold" sx={{ color: 'info.main' }} />
        {fDateTime(tour.date)}
      </Box>

      {tour.locations.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, typography: 'body2' }}>
          <Iconify icon="mingcute:location-fill" sx={{ color: 'error.main' }} />
          {tour.locations.map((loc) => loc.name).join(', ')}
        </Box>
      )}
    </Box>
  );

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <li>
          <MenuItem component={RouterLink} href={detailsHref} onClick={() => menuActions.onClose()}>
            <Iconify icon="solar:eye-bold" />
            Xem
          </MenuItem>
        </li>
        <li>
          <MenuItem component={RouterLink} href={editHref} onClick={() => menuActions.onClose()}>
            <Iconify icon="solar:pen-bold" />
            Sửa
          </MenuItem>
        </li>
        <MenuItem
          onClick={() => {
            menuActions.onClose();
            onDelete();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Xóa
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <Card sx={sx} {...other}>
        {renderImage()}
        {renderTexts()}
        {renderInfo()}
      </Card>

      {renderMenuActions()}
    </>
  );
}
