import type { BoxProps } from '@mui/material/Box';

import { m } from 'framer-motion';
import { useTabs } from 'minimal-shared/hooks';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';
import { varFade, varScale, MotionViewport } from 'src/components/animate';

import { SectionTitle } from './components/section-title';
import { FloatLine, FloatXIcon } from './components/svg-elements';
import { Chip } from '@mui/material';

// ----------------------------------------------------------------------

export function HomePricing({ sx, ...other }: BoxProps) {
  const tabs = useTabs('Standard');

  const renderDescription = () => (
    <SectionTitle
      title="Bảng giá"
      txtGradient="các tour được ưa chuộng hiện tại"
      description="Khám phá các gói tour du lịch hấp dẫn với giá cả phải chăng, được thiết kế để mang đến trải nghiệm tuyệt vời nhất cho bạn."
      sx={{ mb: 8, textAlign: 'center' }}
    />
  );

  const renderContentDesktop = () => (
    <Box gridTemplateColumns="repeat(3, 1fr)" sx={{ display: { xs: 'none', md: 'grid' } }}>
      {PLANS.map((plan) => (
        <PlanCard key={plan.name} plan={plan} />
      ))}
    </Box>
  );

  const renderContentMobile = () => (
    <Stack
      spacing={5}
      alignItems="center"
      sx={{ display: { md: 'none' } }}
    >
      {PLANS.map((plan) => (
        <PlanCard key={plan.name} plan={plan} />
      ))}
    </Stack>
  );

  return (
    <Box
      component="section"
      sx={[{
        position: 'relative',
        backgroundImage: `url(${CONFIG.assetsDir}/assets/background/stolenbgpricing.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <MotionViewport>

        <Container>{renderDescription()}</Container>

        <Box
          sx={(theme) => ({
            position: 'relative',
            '&::before, &::after': {
              width: 64,
              height: 64,
              content: "''",
              [theme.breakpoints.up(1440)]: { display: 'block' },
            },
          })}
        >
          <Container>{renderContentDesktop()}</Container>

        </Box>

        <Container>{renderContentMobile()}</Container>
      </MotionViewport>
    </Box>
  );
}

// ----------------------------------------------------------------------

function PlanCard({ plan, sx, ...other }: any) {
  return (
    <MotionViewport>
      <Box
        sx={[
          (theme) => ({
            px: 4,
            py: 6,
            gap: 4,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `0 0 12px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.15)}`,
            backgroundColor: theme.vars.palette.background.paper,
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        <Box
          component={m.div}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          sx={{
            position: 'relative',
            borderRadius: 2,
            overflow: 'hidden',
            height: 180,
          }}
        >
          <Box
            component="img"
            src={plan.image}
            alt={plan.name}
            sx={{
              width: 1,
              height: 1,
              objectFit: 'cover',
              transition: 'transform 0.4s',
              '&:hover': { transform: 'scale(1.05)' },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.15))',
            }}
          />
          <Typography
            variant="h5"
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              color: 'white',
              fontWeight: 700,
            }}
          >
            {plan.name}
          </Typography>
        </Box>

        <m.div variants={varFade('inUp', { distance: 24 })}>
          <Typography variant="h4" color="primary.main">
            {plan.price.toLocaleString()} ₫
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {plan.duration}
          </Typography>
        </m.div>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Điểm đến</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {plan.destinations.map((d: string) => (
              <Chip key={d} label={d} variant="outlined" size="small" />
            ))}
          </Stack>
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Bao gồm</Typography>
          {plan.includes.map((item: string) => (
            <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Iconify icon="eva:checkmark-fill" width={18} color="success.main" />
              <Typography variant="body2">{item}</Typography>
            </Box>
          ))}
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Dịch vụ thêm</Typography>
          {plan.extras.map((item: string) => (
            <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Iconify icon="mdi:star-outline" width={18} color="warning.main" />
              <Typography variant="body2">{item}</Typography>
            </Box>
          ))}
        </Stack>

        <m.div variants={varFade('inUp', { distance: 24 })}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
            href="#"
            startIcon={<Iconify icon="fa7-solid:sign-hanging" />}
          >
            Đặt tour ngay
          </Button>
        </m.div>
      </Box>
    </MotionViewport>
  );
}


// ----------------------------------------------------------------------

const PLANS = [
  {
    name: 'Tour Trọn Gói',
    price: 4990000,
    duration: '5 ngày 4 đêm',
    destinations: ['Phú Quốc', 'Nha Trang'],
    includes: [
      'Khách sạn 4 sao',
      'Ăn uống cao cấp',
      'Hướng dẫn viên chuyên nghiệp',
      'Vé máy bay khứ hồi',
      'Bảo hiểm du lịch',
    ],
    extras: ['Xe đưa đón sân bay', 'Quà lưu niệm'],
    image: `${CONFIG.assetsDir}/assets/images/travel/phuquoc.jpg`,
  },
  {
    name: 'Tour Cơ Bản',
    price: 2990000,
    duration: '3 ngày 2 đêm',
    destinations: ['Đà Lạt', 'Vũng Tàu'],
    includes: [
      'Khách sạn 3 sao',
      'Ăn uống theo chương trình',
      'Hướng dẫn viên du lịch',
      'Vé tham quan các điểm đến',
    ],
    extras: ['Xe đưa đón tận nơi'],
    image: `${CONFIG.assetsDir}/assets/images/travel/dalat.jpg`,
  },
  {
    name: 'Tour Cao Cấp',
    price: 8990000,
    duration: '7 ngày 6 đêm',
    destinations: ['Hà Nội', 'Hạ Long', 'Sapa'],
    includes: [
      'Khách sạn 5 sao',
      'Ẩm thực đặc sản vùng miền',
      'Hướng dẫn viên song ngữ',
      'Vé tàu – vé tham quan cao cấp',
      'Bảo hiểm du lịch toàn phần',
    ],
    extras: ['Quà tặng VIP', 'Dịch vụ chăm sóc 24/7'],
    image: `${CONFIG.assetsDir}/assets/images/travel/halong.jpg`,
  },
];

