import { Box, Typography, Divider, IconButton, Checkbox, Avatar, Link, ListItemText } from '@mui/material';
import type { TourItem } from 'src/types/tour';
import { Image } from 'src/components/image';
import { Lightbox, useLightBox } from 'src/components/lightbox';
import { Iconify } from 'src/components/iconify';
import { fDate } from 'src/utils/format-time-vi';
import { Markdown } from 'src/components/markdown';

type Props = {
  tour?: TourItem;
};

export function TourDetailsContent({ tour }: Props) {
  if (!tour) return null;

  const slides = tour.image ? [{ src: tour.image }] : [];

  const {
    selected: selectedImage,
    open: openLightbox,
    onOpen: handleOpenLightbox,
    onClose: handleCloseLightbox,
  } = useLightBox(slides);

  const renderGallery = () => (
    slides.length > 0 && (
      <>
        <Box
          sx={{
            mb: { xs: 3, md: 5 },
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Image
            alt={tour.title}
            src={slides[0].src}
            ratio="16/9"
            onClick={() => handleOpenLightbox(slides[0].src)}
            sx={{
              borderRadius: 2,
              cursor: 'pointer',
              maxWidth: 720,
              transition: (theme) => theme.transitions.create('opacity'),
              '&:hover': { opacity: 0.8 },
            }}
          />
        </Box>

        <Lightbox
          index={selectedImage}
          slides={slides}
          open={openLightbox}
          close={handleCloseLightbox}
        />
      </>
    )
  );

  const renderHead = () => (
    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ flexGrow: 1 }}>
        {tour.title}
      </Typography>

      <IconButton>
        <Iconify icon="solar:share-bold" />
      </IconButton>

      <Checkbox
        defaultChecked
        color="error"
        icon={<Iconify icon="solar:heart-outline" />}
        checkedIcon={<Iconify icon="solar:heart-bold" />}
        slotProps={{
          input: {
            id: 'favorite-checkbox',
            'aria-label': 'Favorite checkbox',
          },
        }}
      />
    </Box>
  );

  const renderOverview = () => (
    <Box
      sx={{
        gap: 3,
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
      }}
    >
      {[
        {
          label: 'Ngày khởi hành',
          value: tour.date ? fDate(tour.date) : '—',
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Địa điểm',
          value: tour.locations?.map((l) => l.name).join(', ') || '—',
          icon: <Iconify icon="mingcute:location-fill" />,
        },
        {
          label: 'Số chỗ',
          value: `${tour.slots ?? 0} chỗ`,
          icon: <Iconify icon="solar:users-group-two-rounded-bold" />,
        },
        {
          label: 'Giá',
          value: `${tour.price?.toLocaleString('vi-VN')}₫`,
          icon: <Iconify icon="solar:wallet-bold" />,
        },
      ].map((item) => (
        <Box key={item.label} sx={{ gap: 1.5, display: 'flex' }}>
          {item.icon}
          <ListItemText
            primary={item.label}
            secondary={item.value}
            slotProps={{
              primary: {
                sx: { typography: 'body2', color: 'text.secondary' },
              },
              secondary: {
                sx: { mt: 0.5, color: 'text.primary', typography: 'subtitle2' },
              },
            }}
          />
        </Box>
      ))}
    </Box>
  );

  const renderContent = () => (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Lịch trình
      </Typography>
      <Markdown
        children={tour.description || 'Không có mô tả'}
        sx={[
          () => ({
            p: 3,
            '& p, li, ol, table': { typography: 'body2' },
            '& table': {
              mt: 2,
              maxWidth: 640,
              '& td': { px: 2 },
              '& td:first-of-type': { color: 'text.secondary' },
              'tbody tr:nth-of-type(odd)': { bgcolor: 'transparent' },
            },
          }),
        ]}
      />
    </Box>
  );

  return (
    <>
      {renderGallery()}

      <Box>
        {renderHead()}

        <Divider sx={{ borderStyle: 'dashed', my: 5 }} />

        {renderOverview()}

        <Divider sx={{ borderStyle: 'dashed', mt: 5, mb: 2 }} />

        {renderContent()}
      </Box>
    </>
  );
}
