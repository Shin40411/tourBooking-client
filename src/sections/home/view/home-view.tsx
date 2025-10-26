import Stack from '@mui/material/Stack';

import { BackToTopButton } from 'src/components/animate/back-to-top-button';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { HomeHero } from '../home-hero';
import { HomePricing } from '../home-pricing';
import { HomeHugePackElements } from '../home-hugepack-elements';
import { Box } from '@mui/material';
import HomeFilter from '../home-filter';
import { useState } from 'react';
import { HomeFAQs } from '../home-faqs';

// ----------------------------------------------------------------------

export function HomeView() {
  const pageProgress = useScrollProgress();

  return (
    <>
      <ScrollProgress
        variant="linear"
        progress={pageProgress.scrollYProgress}
        sx={[(theme) => ({ position: 'fixed', zIndex: theme.zIndex.appBar + 1 })]}
      />

      <BackToTopButton />

      <BackToTopButton />

      <HomeHero />
      <Stack sx={{ position: 'relative', bgcolor: 'background.default' }}>

        <HomeHugePackElements />

        <HomePricing />
        {/* <HomeFAQs /> */}
      </Stack>
    </>
  );
}
