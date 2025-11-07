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
import { Chip, Skeleton } from '@mui/material';
import { useGetTours } from 'src/actions/tour';
import { fCurrencyVN } from 'src/utils/format-number';
import { TourItem } from 'src/types/tour';
import { EmptyContent } from 'src/components/empty-content';
import { useNavigate } from 'react-router';

// ----------------------------------------------------------------------

export function HomePricing({ sx, ...other }: BoxProps) {
  const { tours: PLANS = [], toursEmpty, toursLoading } = useGetTours(undefined, 1, 3);

  const renderSkeletonDesktop = () => (
    <Box gridTemplateColumns="repeat(3, 1fr)" sx={{ display: { xs: 'none', md: 'grid' }, gap: 3 }}>
      {[...Array(3)].map((_, i) => (
        <PlanCardSkeleton key={i} />
      ))}
    </Box>
  );

  const renderSkeletonMobile = () => (
    <Stack spacing={5} alignItems="center" sx={{ display: { md: 'none' } }}>
      {[...Array(3)].map((_, i) => (
        <PlanCardSkeleton key={i} />
      ))}
    </Stack>
  );

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
      {Array.isArray(PLANS) &&
        PLANS.filter(
          (plan) => plan.date !== null && new Date(plan.date) >= new Date()
        ).map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
    </Box>
  );

  const renderContentMobile = () => (
    <Stack
      spacing={5}
      alignItems="center"
      sx={{ display: { md: 'none' } }}
    >
      {Array.isArray(PLANS) &&
        PLANS.filter(
          (plan) => plan.date !== null && new Date(plan.date) >= new Date()
        ).map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
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

        {toursEmpty ?
          <Box pb={10}>
            <EmptyContent />
          </Box>
          :
          <>
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
              <Container>{toursLoading ? renderSkeletonDesktop() : renderContentDesktop()}</Container>

            </Box>

            <Container> {toursLoading ? renderSkeletonMobile() : renderContentMobile()}</Container>
          </>
        }
      </MotionViewport>
    </Box>
  );
}

// ----------------------------------------------------------------------
interface PlanCardProps {
  plan: TourItem;
  sx?: object;
  [key: string]: any;
}

function PlanCard({ plan, sx, ...other }: PlanCardProps) {
  const navigate = useNavigate();
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
            alt={plan.title}
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
            {plan.title}
          </Typography>
        </Box>

        <m.div variants={varFade('inUp', { distance: 24 })}>
          <Typography variant="h4" color="primary.main">
            {fCurrencyVN(plan.price)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {plan.duration}
          </Typography>
        </m.div>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Điểm đến</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {plan.locations.map((d) => (
              <Chip key={d.id} label={d.name} variant="outlined" size="small" />
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
            onClick={() => navigate(`${paths.homeTour.details(String(plan.id))}`)}
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

function PlanCardSkeleton() {
  return (
    <Box
      sx={(theme) => ({
        px: 4,
        py: 6,
        gap: 4,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 0 12px ${theme.vars
          ? `rgba(${theme.vars.palette.grey['500Channel']},0.15)`
          : theme.palette.grey[500]}33`,
        backgroundColor: theme.vars
          ? theme.vars.palette.background.paper
          : theme.palette.background.paper,
      })}
    >
      <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />

      <Box>
        <Skeleton width="60%" height={28} />
        <Skeleton width="40%" />
      </Box>

      <Box>
        <Skeleton width="30%" />
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} variant="rounded" width={60} height={24} />
          ))}
        </Stack>
      </Box>

      <Box>
        <Skeleton width="40%" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} width="80%" />
        ))}
      </Box>

      <Box>
        <Skeleton width="50%" />
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} width="70%" />
        ))}
      </Box>

      <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 1, mt: 2 }} />
    </Box>
  );
}