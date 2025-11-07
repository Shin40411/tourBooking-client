import type { Breakpoint } from '@mui/material/styles';

import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { usePathname, useRouter } from 'src/routes/hooks';

import { Logo } from 'src/components/logo';

import { NavMobile } from './nav/mobile';
import { NavDesktop } from './nav/desktop';
import { Footer, HomeFooter } from './footer';
import { MainSection } from '../core/main-section';
import { MenuButton } from '../components/menu-button';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import { navData as mainNavData } from '../nav-config-main';
import { SignInButton } from '../components/sign-in-button';
import { SettingsButton } from '../components/settings-button';

import type { FooterProps } from './footer';
import type { NavMainProps } from './nav/types';
import type { MainSectionProps } from '../core/main-section';
import type { HeaderSectionProps } from '../core/header-section';
import type { LayoutSectionProps } from '../core/layout-section';
import { useGetLocations } from 'src/actions/location';
import { MouseEvent, useCallback, useMemo, useState } from 'react';
import { Iconify } from 'src/components/iconify';
import { kebabCase } from 'es-toolkit';
import { useAuthContext } from 'src/auth/hooks';
import { RouterLink } from 'src/routes/components';
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { JWT_USER_INFO, signOut } from 'src/auth/context/jwt';
import { toast } from 'sonner';
import { useGetCategories } from 'src/actions/category';

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type MainLayoutProps = LayoutBaseProps & {
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    nav?: {
      data?: NavMainProps['data'];
    };
    main?: MainSectionProps;
    footer?: FooterProps;
  };
};

export function MainLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = 'md',
}: MainLayoutProps) {
  const { user, checkUserSession } = useAuthContext();
  const pathname = usePathname();
  const { categories, pagination, categoriesLoading, categoriesEmpty, mutation } = useGetCategories({
    pageNumber: 1,
    pageSize: 999,
    enabled: true,
  });

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const isHomePage = pathname === '/';
  const router = useRouter();

  // const navData = slotProps?.nav?.data ?? mainNavData;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openAccountPage = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      await checkUserSession?.();
      sessionStorage.removeItem(JWT_USER_INFO);
      onClose?.();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Unable to logout!');
    }
  }, [checkUserSession, onClose, router]);

  const navData = useMemo(() => {
    return [
      {
        title: 'Điểm đến',
        path: '/destinations',
        icon: <Iconify icon="solar:map-point-bold-duotone" width={22} />,
        children: categories.map((item) => ({
          subheader: item.name,
          items: item.locations.map((l) => ({
            title: l.name,
            path: paths.homeTour.category(l.id),
          })),
        })),
      },
      {
        title: 'Liên hệ',
        icon: <Iconify icon="solar:notebook-bold-duotone" width={22} />,
        path: paths.contact,
      },
    ];
  }, [categories]);

  const renderHeader = () => {
    const headerSlots: HeaderSectionProps['slots'] = {
      topArea: (
        <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      leftArea: (
        <>
          {/** @slot Nav mobile */}
          <MenuButton
            onClick={onOpen}
            sx={(theme) => ({
              mr: 1,
              ml: -1,
              [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
            })}
          />
          <NavMobile data={navData} open={open} onClose={onClose} />

          {/** @slot Logo */}
          <Logo />
        </>
      ),
      rightArea: (
        <>
          {/** @slot Nav desktop */}
          <NavDesktop
            data={navData}
            isHomePage={isHomePage}
            sx={(theme) => ({
              display: 'none',
              [theme.breakpoints.up(layoutQuery)]: { mr: 2.5, display: 'flex' },
            })}
          />
          {!user ?
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
              <SignInButton color='primary' />
            </Box>
            :
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
              <IconButton
                onClick={handleOpen}
                title="Tài khoản"
                sx={{ bgcolor: '#00A76F', '&:hover': { bgcolor: '#008a5d' } }}
              >
                <Iconify icon="hugeicons:manager" color="#fff" />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={openAccountPage}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  sx: { borderRadius: 2, mt: 1 },
                }}
              >
                <MenuItem
                  component={RouterLink}
                  href={paths.dashboard.root}
                  onClick={handleClose}
                >
                  <ListItemText primary="Quản lý đơn đặt" />
                </MenuItem>

                <MenuItem onClick={handleLogout}>
                  <ListItemText primary="Đăng xuất" />
                </MenuItem>
              </Menu>
            </Box>
          }
        </>
      ),
    };

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={slotProps?.header?.slotProps}
        sx={slotProps?.header?.sx}
        disableElevation
        disableOffset
      />
    );
  };

  const renderFooter = () => <HomeFooter sx={slotProps?.footer?.sx} />;

  const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      headerSection={renderHeader()}
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={cssVars}
      sx={sx}
    >
      {renderMain()}
    </LayoutSection>
  );
}
