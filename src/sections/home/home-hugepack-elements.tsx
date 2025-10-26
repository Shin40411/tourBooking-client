import type { MotionValue } from 'framer-motion';
import type { BoxProps } from '@mui/material/Box';

import { useRef, useState } from 'react';
import { useClientRect } from 'minimal-shared/hooks';
import { m, useSpring, useScroll, useTransform, useMotionValueEvent, useInView } from 'framer-motion';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

import { SectionTitle, SectionCaption } from './components/section-title';
import { FloatLine, FloatTriangleLeftIcon } from './components/svg-elements';
import { HeroBackground } from './components/hero-background';

// ----------------------------------------------------------------------

const renderLines = () => (
  <>
    <FloatTriangleLeftIcon sx={{ top: 80, left: 80, opacity: 0.4 }} />
    <FloatLine vertical sx={{ top: 0, left: 80 }} />
  </>
);

export function HomeHugePackElements({ sx, ...other }: BoxProps) {
  return (
    <Box
      component="section"
      sx={[
        () => ({
          pt: 10,
          position: 'relative',
          backgroundImage: `url(${CONFIG.assetsDir}/assets/images/mock/travel/travel-13.webp)`,
          backgroundSize: 'contain',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <MotionViewport>
        <Container sx={{ textAlign: { xs: 'center', md: 'left' }, position: 'relative' }}>
          <Grid container rowSpacing={{ xs: 3, md: 0 }} columnSpacing={{ xs: 0, md: 8 }}>
            <Grid size={{ xs: 12, md: 6, lg: 7 }}>
              <SectionTitle title="" txtGradient="Khám phá sản phẩm" sx={{ mt: 3 }} />
              <SectionTitle title="CanThoTravel" sx={{ color: '#00A76F' }} />
            </Grid>

            <Grid size={{ xs: 12, md: 6, lg: 5 }}>
              <m.div variants={varFade('inUp', { distance: 24 })}>
                <Typography
                  sx={{ color: 'text.disabled', fontSize: { md: 20 }, lineHeight: { md: 36 / 20 } }}
                >
                  <Box component="span" sx={{ color: 'text.primary' }}>
                    Hãy tận hưởng trải nghiệm du lịch chuyên nghiệp, mang lại cho bạn những khoảnh khắc tuyệt vời và nâng tầm cuộc sống.
                  </Box>
                  <br />
                  <Box component="span" sx={{ color: '#0c5637' }}>
                    Chúng tôi cam kết mang đến những chuyến đi đáng nhớ, giúp bạn khám phá thế giới theo cách hoàn hảo nhất.
                  </Box>
                </Typography>
              </m.div>
            </Grid>
          </Grid>

          <m.div variants={varFade('inUp', { distance: 24 })}>
            <Button
              size="large"
              color="inherit"
              variant="outlined"
              target="_blank"
              rel="noopener"
              href={paths.components}
              endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
              sx={{ mt: 5, mx: 'auto' }}
            >
              Xem ngay
            </Button>
          </m.div>
        </Container>
      </MotionViewport>
      <ScrollableContent />
    </Box>
  );
}

// ----------------------------------------------------------------------

function ScrollableContent() {
  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';

  const containerRef = useRef<HTMLDivElement>(null);
  const containerRect = useClientRect(containerRef);

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollRect = useClientRect(scrollRef);

  const [startScroll, setStartScroll] = useState(false);

  const { scrollYProgress } = useScroll({ target: containerRef });

  const physics = { damping: 16, mass: 0.16, stiffness: 50 };

  const scrollRange = -scrollRect.scrollWidth + containerRect.width;

  const x1 = useSpring(useTransform(scrollYProgress, [0, 1], [0, scrollRange]), physics);
  const x2 = useSpring(useTransform(scrollYProgress, [0, 1], [scrollRange, 0]), physics);

  const background: MotionValue<string> = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [
      '#daefff',
      theme.vars.palette.background.neutral,
      theme.vars.palette.background.neutral,
      theme.vars.palette.background.neutral,
      '#daefff',
    ]
  );

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest !== 0 && latest !== 1) {
      setStartScroll(true);
    } else {
      setStartScroll(false);
    }
  });

  return (
    <ScrollRoot ref={containerRef} sx={{ height: scrollRect.scrollWidth, minHeight: '100vh' }}>
      <ScrollContainer style={{ background }} data-scrolling={startScroll}>
        <ScrollContent ref={scrollRef} layout transition={{ ease: 'linear', duration: 0.25 }}>
          <ScrollRow style={{ x: x1 }}>
            <ScrollImage
              sx={{ backgroundImage: `url(${CONFIG.assetsDir}/assets/images/travel/danang.jpg)` }}
              title="Khám phá Đà Nẵng"
              description="Thành phố đáng sống nhất Việt Nam với biển xanh và ẩm thực tuyệt vời."
              color="#FFDD00"
            />
            <ScrollImage
              sx={{ backgroundImage: `url(${CONFIG.assetsDir}/assets/images/travel/hanoi.jpg)` }}
              title="Trải nghiệm Hà Nội"
              description="Văn hóa cổ kính hòa quyện hiện đại – trái tim của Việt Nam."
              color="#1df0a9ff"
            />
          </ScrollRow>

          <ScrollRow style={{ x: x2 }}>
            <ScrollImage
              sx={{ backgroundImage: `url(${CONFIG.assetsDir}/assets/images/travel/halong.jpg)` }}
              title="Vịnh Hạ Long"
              description="Kỳ quan thiên nhiên thế giới – điểm đến mơ ước của mọi du khách."
              color="#2bf870ff"
            />
            <ScrollImage
              sx={{ backgroundImage: `url(${CONFIG.assetsDir}/assets/images/travel/nhatrang.jpg)` }}
              title="Biển Nha Trang"
              description="Nước trong xanh, cát trắng mịn và nắng vàng rực rỡ quanh năm."
              color="#85b6ffff"
            />
          </ScrollRow>
        </ScrollContent>
      </ScrollContainer>
    </ScrollRoot>
  );
}

function ScrollImage({ sx, title, description, color }: any) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const [hovered, setHovered] = useState(false);

  return (
    <ScrollImageRoot
      ref={ref}
      sx={sx}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.05) 100%)",
          transition: "opacity 0.4s ease",
          opacity: hovered ? 0 : 1,
        }}
      />

      <m.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: 0,
          display: hovered ? "none" : "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "#fff",
          padding: "24px",
          transition: "opacity 0.4s ease",
        }}
      >
        <SectionTitle
          title={title}
          description={description}
          sx={{ mt: 3, color }}
          slotProps={{
            description: {
              sx: { color: "rgba(255, 255, 255, 1)", fontWeight: 600 },
            },
          }}
        />
      </m.div>

      <m.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: hovered ? 1 : 0,
          scale: hovered ? 1 : 0.98,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0, 0, 0, 0.7)",
          pointerEvents: hovered ? "auto" : "none",
        }}
      >
        <m.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: color || "#FFDD00",
            color: "#000",
            fontWeight: 700,
            padding: "12px 28px",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Khám phá ngay
        </m.button>
      </m.div>
    </ScrollImageRoot>
  );
}

// ----------------------------------------------------------------------

const ScrollRoot = styled(m.div)(({ theme }) => ({
  zIndex: 9,
  position: 'relative',
  paddingTop: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(15),
  },
}));

const ScrollContainer = styled(m.div)(({ theme }) => ({
  top: 0,
  height: '100vh',
  display: 'flex',
  position: 'sticky',
  overflow: 'hidden',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  transition: theme.transitions.create(['background-color']),
  '&[data-scrolling="true"]': { justifyContent: 'center' },
}));

const ScrollContent = styled(m.div)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0),
  [theme.breakpoints.up('md')]: {
    gap: theme.spacing(0),
  },
}));

const ScrollRow = styled(m.div)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0),
  width: 'max-content',
  height: 300,
  [theme.breakpoints.up('md')]: {
    height: 400,
  },
}));

const ScrollImageRoot = styled(m.div)(({ theme }) => ({
  position: "relative",
  width: "80vw",
  flexShrink: 0,
  backgroundSize: "cover",
  backgroundPosition: "center center",
  backgroundRepeat: "no-repeat",
  overflow: "hidden",
}));
