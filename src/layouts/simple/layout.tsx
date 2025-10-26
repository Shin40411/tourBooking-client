import type { Breakpoint } from '@mui/material/styles';


import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';


import { Logo } from 'src/components/logo';

import { SimpleCompactContent } from './content';
import { MainSection } from '../core/main-section';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';

import type { SimpleCompactContentProps } from './content';
import type { MainSectionProps } from '../core/main-section';
import type { HeaderSectionProps } from '../core/header-section';
import type { LayoutSectionProps } from '../core/layout-section';
import { FooterProps, HomeFooter } from '../main/footer';
import { CONFIG } from 'src/global-config';
import { MenuButton } from '../components/menu-button';
import { NavDesktop } from '../main/nav/desktop';
import { SignInButton } from '../components/sign-in-button';
import { NavMainProps } from '../main/nav/types';
import { navData as mainNavData } from '../nav-config-main';
import { useBoolean } from 'minimal-shared/hooks';
import { NavMobile } from '../main/nav/mobile';
import { usePathname } from 'src/routes/hooks';

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type SimpleLayoutProps = LayoutBaseProps & {
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    nav?: {
      data?: NavMainProps['data'];
    };
    main?: MainSectionProps;
    footer?: FooterProps;
    content?: SimpleCompactContentProps & { compact?: boolean };
  };
};

export function SimpleLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = 'md',
}: SimpleLayoutProps) {
  const navData = slotProps?.nav?.data ?? mainNavData;
  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

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
            sx={(theme) => ({
              display: 'none',
              [theme.breakpoints.up(layoutQuery)]: { mr: 2.5, display: 'flex' },
            })}
            isHomePage={true}
          />
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

  const renderFooter = () =>
    <HomeFooter sx={slotProps?.footer?.sx} />

  const renderMain = () => {
    const { compact, ...restContentProps } = slotProps?.content ?? {};

    return (
      <MainSection {...slotProps?.main}>
        {compact ? (
          <SimpleCompactContent layoutQuery={layoutQuery} {...restContentProps}>
            {children}
          </SimpleCompactContent>
        ) : (
          <Box
            sx={{
              backgroundImage: `url(${CONFIG.assetsDir}/assets/images/mock/travel/coconutbg.jpg)`,
              backgroundSize: 'cover',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
            {renderHeader()}
            {children}
          </Box>
        )}
      </MainSection>
    );
  };

  return (
    <LayoutSection
      /** **************************************
       *************************************** */
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={{ '--layout-simple-content-compact-width': '448px', ...cssVars }}
      sx={sx}
    >
      {renderMain()}
    </LayoutSection>
  );
}
