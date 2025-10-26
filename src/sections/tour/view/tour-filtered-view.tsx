import { Box, Grid, Card, CardMedia, CardContent, Typography, Chip, Stack, CircularProgress, Container, Fade, Button, Divider } from "@mui/material";
import dayjs from "dayjs";
import { varAlpha } from "minimal-shared/utils";
import { useSearchParams } from "react-router";
import { useGetTours } from "src/actions/tour";
import { AnimateText, animateTextClasses, BackToTopButton, MotionContainer, varFade } from "src/components/animate";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { EmptyContent } from "src/components/empty-content";
import { CONFIG } from "src/global-config";
import HomeFilter from "src/sections/home/home-filter";
import { TourFilterParams } from "src/types/tour";
import { fCurrencyVN } from "src/utils/format-number";

export function TourFilteredView() {
    const [searchParams] = useSearchParams();
    const filters: TourFilterParams = {
        title: searchParams.get("title") || "",
        includes: searchParams.get("includes")?.split(",").filter(Boolean) || [],
        extras: searchParams.get("extras")?.split(",").filter(Boolean) || [],
        locationIds: searchParams
            .get("locations")
            ?.split(",")
            .map(Number)
            .filter(Boolean) || [],
        fromDate: searchParams.get("fromDate") || undefined,
        toDate: searchParams.get("toDate") || undefined,
        priceRange: [
            Number(searchParams.get("priceMin") || 0),
            Number(searchParams.get("priceMax") || 50000000),
        ],
    };

    const { tours, toursLoading, toursEmpty, toursError } = useGetTours(filters);

    return (
        <Box>
            <BackToTopButton />

            <BackToTopButton />
            <Box
                component="section"
                sx={[
                    (theme) => ({
                        ...theme.mixins.bgGradient({
                            images: [
                                `linear-gradient(0deg, ${varAlpha(theme.vars.palette.grey['900Channel'], 0.8)}, ${varAlpha(theme.vars.palette.grey['900Channel'], 0.8)})`,
                                `url(${CONFIG.assetsDir}/assets/images/mock/travel/coconutbg.jpg)`,
                            ],
                        }),
                        overflow: 'hidden',
                        height: { md: 560 },
                        position: 'relative',
                        py: { xs: 10, md: 0 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        flexDirection: 'column'
                    }),
                ]}
            >
                <Box sx={{ p: 2, mx: 4, bgcolor: '#fff', borderRadius: 4, alignSelf: 'flex-start' }}>
                    <CustomBreadcrumbs
                        links={[
                            { name: 'Điểm đến', href: '/' },
                            { name: 'Danh sách tour' },
                        ]}
                    />
                </Box>
                <Container component={MotionContainer}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                    <Box
                        sx={{
                            width: { xs: '100%', sm: 600, md: 800 },
                            maxWidth: '100%',
                        }}
                    >
                        <HomeFilter
                            initialValues={{
                                ...filters,
                                locations: filters?.locationIds?.map(String) || [],
                                startDate: filters?.fromDate || null,
                                endDate: filters?.toDate || null,
                            }}
                        />
                    </Box>
                </Container>
            </Box>
            <Container
                maxWidth="xl"
                component="section"
                sx={{
                    pb: 10,
                    position: 'relative',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        my: 6,
                        flexDirection: 'column',
                        gap: 1.5,
                    }}
                >
                    <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                        {tours.length >= 0 && (
                            <>
                                Chúng tôi tìm thấy{' '}
                                <Box
                                    component="span"
                                    sx={{
                                        color: 'primary.main',
                                        fontWeight: 'bold',
                                        fontSize: '1.25rem',
                                    }}
                                >
                                    {tours.length}
                                </Box>{' '}
                                chương trình tour cho quý khách
                            </>
                        )}
                    </Typography>
                    <Divider
                        sx={{
                            width: '100%',
                            borderColor: 'primary.main',
                            borderBottomWidth: 2
                        }}
                    />
                </Box>
                <Fade in={toursLoading} unmountOnExit>
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            bgcolor: 'background.paper',
                            opacity: 0.6,
                            zIndex: 10,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <CircularProgress />
                    </Box>
                </Fade>

                <Box
                    sx={{
                        flexGrow: 1,
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: !!toursEmpty || !!toursError ? '1fr' : '250px 1fr' },
                        gap: 3,
                        height: 800,
                        overflow: 'hidden',
                    }}
                >
                    {(!toursEmpty) &&
                        <Box
                            sx={{
                                bgcolor: '#f8f8f8',
                                borderRadius: 1,
                                p: 2.5,
                                boxShadow: 2,
                                height: 'max-content',
                            }}
                        >
                            <Typography variant="h6" mb={2}>
                                Sắp xếp theo
                            </Typography>

                            <Stack spacing={2}>
                                <Button variant="outlined" sx={{ bgcolor: 'white', color: 'black' }} fullWidth>
                                    Giá tăng dần
                                </Button>
                                <Button variant="outlined" sx={{ bgcolor: 'white', color: 'black' }} fullWidth>
                                    Giá giảm dần
                                </Button>
                                <Button variant="outlined" sx={{ bgcolor: 'white', color: 'black' }} fullWidth>
                                    Mới nhất
                                </Button>
                                <Button variant="outlined" sx={{ bgcolor: 'white', color: 'black' }} fullWidth>
                                    Phổ biến
                                </Button>
                            </Stack>
                        </Box>
                    }

                    <Box
                        sx={{
                            height: '100%',
                            overflowY: 'auto',
                            pr: 1,
                        }}
                    >
                        {toursEmpty || toursError ?
                            <Box textAlign="center" height="100%" display="flex" flexDirection="column" justifyContent="center" py={5}>
                                <EmptyContent filled sx={{ py: 10 }} />
                            </Box>
                            :
                            !toursLoading && (
                                <Grid container spacing={3}>
                                    {tours.map((tour) => (
                                        <Grid key={tour.id} size={12}>
                                            <Card
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    height: 180,
                                                    boxShadow: 3,
                                                    borderRadius: 0.5,
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    sx={{
                                                        width: 200,
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                    }}
                                                    image={`${CONFIG.assetsDir}${tour.image}`}
                                                    alt={tour.title}
                                                />
                                                <CardContent
                                                    sx={{
                                                        flex: 1,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'space-between',
                                                        p: 2.5,
                                                    }}
                                                >
                                                    <Box>
                                                        <Typography variant="h6" gutterBottom noWrap>
                                                            {tour.title}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            Giá từ: {fCurrencyVN(tour.price)}
                                                        </Typography>
                                                        <Stack direction="row" spacing={0.5} flexWrap="wrap" mb={1}>
                                                            {tour.locations.map((loc) => (
                                                                <Chip key={loc.id} size="small" label={loc.name} />
                                                            ))}
                                                        </Stack>
                                                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                                            {tour.includes.map((inc, idx) => (
                                                                <Chip key={idx} size="small" label={inc} color="primary" variant="outlined" />
                                                            ))}
                                                            {tour.extras.map((extra, idx) => (
                                                                <Chip key={idx} size="small" label={extra} color="secondary" variant="outlined" />
                                                            ))}
                                                        </Stack>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )
                        }
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
