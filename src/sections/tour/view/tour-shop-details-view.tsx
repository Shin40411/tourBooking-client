import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, Grid, SxProps, Typography } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { useTabs } from "minimal-shared/hooks";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { EmptyContent } from "src/components/empty-content";
import { Iconify } from "src/components/iconify";
import { RouterLink } from "src/routes/components";
import { paths } from "src/routes/paths";
import { ProductDetailsCarousel } from "src/sections/product/product-details-carousel";
import { ProductDetailsSkeleton } from "src/sections/product/product-skeleton";
import { TourItem } from "src/types/tour";
import { TourDetailsSummary } from "../tour-details-sumary";
import { ProductDetailsDescription } from "src/sections/product/product-details-description";
import { GridExpandMoreIcon } from "@mui/x-data-grid";

type Props = {
  tour?: TourItem;
  loading?: boolean;
  error?: any;
};

export function TourShopDetailsView({ tour, error, loading }: Props) {
  const containerStyles: SxProps<Theme> = {
    mt: 5,
    mb: 10,
  };

  if (loading) {
    return (
      <Container sx={containerStyles}>
        <ProductDetailsSkeleton />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={containerStyles}>
        <EmptyContent
          filled
          title="Tour không tìm thấy!"
          action={
            <Button
              component={RouterLink}
              href={paths.homeTour.root}
              startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
              sx={{ mt: 3 }}
            >
              Quay lại
            </Button>
          }
          sx={{ py: 10 }}
        />
      </Container>
    );
  }

  return (
    <Container sx={containerStyles}>
      <CustomBreadcrumbs
        links={[
          { name: 'Trang chủ', href: '/' },
          { name: 'Tour', href: paths.homeTour.root },
          { name: tour?.title },
        ]}
        sx={{ mb: 5 }}
      />
      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }} height="100%">
        <Grid size={{ xs: 12, md: 6, lg: 7 }}>
          <ProductDetailsCarousel images={[tour?.image || "/assets/illustrations/noresult.jpg"]} />
          <Box
            sx={{
              gap: 5,
              my: 10,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
            }}
          >
            {tour?.includes.map((item) => (
              <Box key={item} sx={{ textAlign: 'center', px: 5 }}>
                <Iconify icon="solar:verified-check-bold" width={32} sx={{ color: 'primary.main' }} />

                <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
                  {item}
                </Typography>
              </Box>
            ))}
            {tour?.extras.map((item) => (
              <Box key={item} sx={{ textAlign: 'center', px: 5 }}>
                <Iconify icon="mdi:seat-recline-extra" width={32} sx={{ color: 'primary.main' }} />
                <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box>
            <Accordion defaultExpanded
              sx={{
                borderRadius: 2,
                boxShadow: 2,
                '&:before': { display: 'none' },
              }}>
              <AccordionSummary
                expandIcon={<GridExpandMoreIcon />}
                aria-controls="schedule-content"
                id="schedule-header"
              >
                <Typography variant="h4" textAlign="center" sx={{ width: '100%' }}>
                  Lịch trình
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <ProductDetailsDescription description={tour?.description} />
              </AccordionDetails>
            </Accordion>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 5 }}>
          {tour && (
            <Box
              sx={{
                position: { md: 'sticky' },
                top: { md: 120 },
                zIndex: 1,
              }}
            >
              <TourDetailsSummary tour={tour} disableActions={tour?.slots === 0} />
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}