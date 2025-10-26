import type { Breakpoint } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _socials } from 'src/_mock';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';
import { Icon, Stack } from '@mui/material';

// ----------------------------------------------------------------------

const LINKS = [
  {
    headline: 'Minimal',
    children: [
      { name: 'About us', href: paths.about },
      { name: 'Contact us', href: paths.contact },
      { name: 'FAQs', href: paths.faqs },
    ],
  },
  {
    headline: 'Legal',
    children: [
      { name: 'Terms and condition', href: '#' },
      { name: 'Privacy policy', href: '#' },
    ],
  },
  { headline: 'Contact', children: [{ name: 'support@minimals.cc', href: '#' }] },
];

// ----------------------------------------------------------------------

const FooterRoot = styled('footer')(({ theme }) => ({
  background: 'linear-gradient(135deg, #0072ff 0%, #00c6ff 100%)', // xanh biển -> ngọc lam
  color: theme.palette.common.white,
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
}));
export type FooterProps = React.ComponentProps<typeof FooterRoot>;

export function Footer({
  sx,
  layoutQuery = 'md',
  ...other
}: FooterProps & { layoutQuery?: Breakpoint }) {
  return (
    <FooterRoot sx={sx} {...other}>
      <Divider />

      <Container
        sx={(theme) => ({
          pb: 5,
          pt: 10,
          textAlign: 'center',
          [theme.breakpoints.up(layoutQuery)]: { textAlign: 'unset' },
        })}
      >
        <Logo />

        <Grid
          container
          sx={[
            (theme) => ({
              mt: 3,
              justifyContent: 'center',
              [theme.breakpoints.up(layoutQuery)]: { justifyContent: 'space-between' },
            }),
          ]}
        >
          <Grid size={{ xs: 12, [layoutQuery]: 3 }}>
            <Typography
              variant="body2"
              sx={(theme) => ({
                mx: 'auto',
                maxWidth: 280,
                [theme.breakpoints.up(layoutQuery)]: { mx: 'unset' },
              })}
            >
              The starting point for your next project with Minimal UI Kit, built on the newest
              version of Material-UI ©, ready to be customized to your style.
            </Typography>

            <Box
              sx={(theme) => ({
                mt: 3,
                mb: 5,
                display: 'flex',
                justifyContent: 'center',
                [theme.breakpoints.up(layoutQuery)]: { mb: 0, justifyContent: 'flex-start' },
              })}
            >
              {_socials.map((social) => (
                <IconButton key={social.label}>
                  {social.value === 'twitter' && <Iconify icon="socials:twitter" />}
                  {social.value === 'facebook' && <Iconify icon="socials:facebook" />}
                  {social.value === 'instagram' && <Iconify icon="socials:instagram" />}
                  {social.value === 'linkedin' && <Iconify icon="socials:linkedin" />}
                </IconButton>
              ))}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, [layoutQuery]: 6 }}>
            <Box
              sx={(theme) => ({
                gap: 5,
                display: 'flex',
                flexDirection: 'column',
                [theme.breakpoints.up(layoutQuery)]: { flexDirection: 'row' },
              })}
            >
              {LINKS.map((list) => (
                <Box
                  key={list.headline}
                  sx={(theme) => ({
                    gap: 2,
                    width: 1,
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    [theme.breakpoints.up(layoutQuery)]: { alignItems: 'flex-start' },
                  })}
                >
                  <Typography component="div" variant="overline">
                    {list.headline}
                  </Typography>

                  {list.children.map((link) => (
                    <Link
                      key={link.name}
                      component={RouterLink}
                      href={link.href}
                      color="inherit"
                      variant="body2"
                    >
                      {link.name}
                    </Link>
                  ))}
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 10 }}>
          © All rights reserved.
        </Typography>
      </Container>
    </FooterRoot>
  );
}

// ----------------------------------------------------------------------

export function HomeFooter({ sx, ...other }: FooterProps) {
  return (
    <FooterRoot
      sx={[
        {
          textAlign: { xs: 'center', md: 'left' },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Container>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'center', md: 'flex-start' }}
          spacing={4}
        >
          {/* --- Cột 1: Logo + mô tả --- */}
          <Box sx={{ maxWidth: 360 }}>
            <Logo />
            <Typography variant="body2" sx={{ mt: 2, color: 'white.400' }}>
              <strong>CanThoTravel</strong> — nền tảng đặt tour du lịch trực tuyến
              giúp bạn khám phá thế giới dễ dàng và tiện lợi hơn bao giờ hết.
              Cùng chúng tôi tạo nên những hành trình đáng nhớ!
            </Typography>
          </Box>

          {/* --- Cột 2: Liên kết nhanh --- */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Liên kết nhanh
            </Typography>
            <Stack spacing={1}>
              <Link href="#" color="inherit" underline="hover">Trang chủ</Link>
              <Link href="#" color="inherit" underline="hover">Giới thiệu</Link>
              <Link href="#" color="inherit" underline="hover">Tour nổi bật</Link>
              <Link href="#" color="inherit" underline="hover">Liên hệ</Link>
            </Stack>
          </Box>

          {/* --- Cột 3: Liên hệ --- */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Liên hệ
            </Typography>
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="mdi:phone" fontSize={18} />
                <Typography variant="body2">Hotline: 1900 1234</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="mdi:email-outline" fontSize={18} />
                <Typography variant="body2">support@CanThoTravel.vn</Typography>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={1.5} mt={2} justifyContent={{ xs: 'center', md: 'flex-start' }}>
              <IconButton color="inherit" href="https://facebook.com">
                <Iconify icon="mdi:facebook" fontSize={22} />
              </IconButton>
              <IconButton color="inherit" href="https://instagram.com">
                <Iconify icon="mdi:instagram" fontSize={22} />
              </IconButton>
              <IconButton color="inherit" href="https://youtube.com">
                <Iconify icon="mdi:youtube" fontSize={22} />
              </IconButton>
            </Stack>
          </Box>
        </Stack>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

        <Box textAlign="center" py={4}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            © {new Date().getFullYear()} CanThoTravel. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </FooterRoot>
  );
}
