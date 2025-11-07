import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';


import { Carousel, useCarousel, CarouselArrowBasicButtons } from 'src/components/carousel';
import { IBookingList } from 'src/types/booking';
import { BookingNewestItem } from './booking-newest-item';

// ----------------------------------------------------------------------

type Props = BoxProps & {
  title?: string;
  subheader?: string;
  list: IBookingList[];
  loading: boolean;
};

export function BookingNewest({ title, subheader, list, loading, sx, ...other }: Props) {
  const carousel = useCarousel({
    align: 'start',
    slideSpacing: '24px',
    slidesToShow: {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4,
    },
  });

  return (
    <Box sx={[{ py: 2 }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={<CarouselArrowBasicButtons {...carousel.arrows} />}
        sx={{ p: 0, mb: 3 }}
      />

      <Carousel carousel={carousel}>
        {list.map((item) => (
          <BookingNewestItem loading={loading} key={item.id} item={item} />
        ))}
      </Carousel>
    </Box>
  );
}
