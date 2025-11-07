import { Box, Grid, Card, CardMedia, CardContent, Typography, Chip, Stack, CircularProgress, Container, Fade, Button, Divider, Link, TablePagination } from "@mui/material";
import dayjs from "dayjs";
import { varAlpha } from "minimal-shared/utils";
import { useSearchParams } from "react-router";
import { useCountdown, useGetTours } from "src/actions/tour";
import { AnimateText, animateTextClasses, BackToTopButton, MotionContainer, varFade } from "src/components/animate";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { EmptyContent } from "src/components/empty-content";
import { Iconify } from "src/components/iconify";
import { CONFIG } from "src/global-config";
import { RouterLink } from "src/routes/components";
import { paths } from "src/routes/paths";
import HomeFilter from "src/sections/home/home-filter";
import { TourFilterParams } from "src/types/tour";
import { fCurrencyVN } from "src/utils/format-number";
import { fDate } from "src/utils/format-time-vi";
import { TourCountdown } from "../tour-countdown";
import { toast } from "sonner";
import { ChangeEvent, useState } from "react";

export function TourFilteredView() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchParams] = useSearchParams();
    const [filters, setFilters] = useState<TourFilterParams>({
        title: searchParams.get("title") || "",
        includes: searchParams.get("includes")?.split(",").filter(Boolean) || [],
        extras: searchParams.get("extras")?.split(",").filter(Boolean) || [],
        locationIds:
            searchParams
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
    });

    const { tours, toursLoading, toursEmpty, toursError, pagination } = useGetTours(filters, page + 1, rowsPerPage);

    const handleSortByPrice = (order: "asc" | "desc") => {
        setFilters((prev) => {
            const [min, max] = prev.priceRange ?? [0, 50000000];
            return {
                ...prev,
                priceRange:
                    order === "asc"
                        ? [Math.min(min, max), Math.max(min, max)] as [number, number]
                        : [Math.max(min, max), Math.min(min, max)] as [number, number],
            };
        });
    };

    const handleSortByNewest = () => {
        const today = new Date();
        const tenDaysLater = new Date(today);
        tenDaysLater.setDate(today.getDate() + 10);

        setFilters((prev) => ({
            ...prev,
            fromDate: today.toISOString(),
            toDate: tenDaysLater.toISOString(),
        }));
    };

    const handleFilterChange = (newFilters: TourFilterParams) => {
        setFilters(newFilters);
    };

    const handleClearFilters = () => {
        setFilters({
            title: "",
            includes: [],
            extras: [],
            locationIds: [],
            fromDate: undefined,
            toDate: undefined,
            priceRange: [0, 50000000],
        });
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    return (
        <Box sx={{
            backgroundImage: `url(${CONFIG.assetsDir}/assets/background/stolenbgpricing.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>
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
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }),
                ]}
            >
                <Box sx={{ position: 'absolute', top: 40, left: 0, p: 2, mx: 4, bgcolor: '#fff', borderRadius: 4 }}>
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
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                flexDirection: 'column',
                                gap: 1.5,
                            }}
                        >
                            <Typography variant="h2" sx={{ color: '#fff' }} textAlign="justify">
                                {tours.length >= 0 && (
                                    <>
                                        Chúng tôi tìm thấy{' '}
                                        <Box
                                            component="span"
                                            sx={{
                                                color: 'primary.main',
                                                fontWeight: 'bold',
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
                    </Box>
                </Container>
            </Box>
            <Container
                maxWidth="xl"
                component="section"
                sx={{
                    py: 5,
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
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
                        display: 'flex',
                        gap: 3,
                        height: '100v%',
                        overflow: 'hidden',
                    }}
                >
                    <Box
                        sx={{
                            flex: 0.2,
                            bgcolor: '#f8f8f8',
                            borderRadius: 1,
                            p: 2.5,
                            boxShadow: 2,
                            height: 'max-content',
                        }}
                    >
                        <HomeFilter
                            initialValues={{
                                ...filters,
                                locations: filters?.locationIds?.map(String) || [],
                                startDate: filters?.fromDate || null,
                                endDate: filters?.toDate || null,
                            }}
                            onFilterChange={handleFilterChange}
                            onClearFilters={handleClearFilters}
                            isSideBar={true}
                        />

                        <Typography variant="h6" mb={2}>
                            Sắp xếp theo
                        </Typography>
                        <Stack spacing={2}>
                            <Button variant="outlined" onClick={() => handleSortByPrice("asc")} sx={{ bgcolor: 'white', color: 'black' }} fullWidth>
                                Giá tăng dần
                            </Button>
                            <Button variant="outlined" onClick={() => handleSortByPrice("desc")} sx={{ bgcolor: 'white', color: 'black' }} fullWidth>
                                Giá giảm dần
                            </Button>
                            <Button variant="outlined" onClick={() => handleSortByNewest()} sx={{ bgcolor: 'white', color: 'black' }} fullWidth>
                                Mới nhất
                            </Button>
                        </Stack>
                    </Box>

                    <Stack flex={1}>
                        <Box
                            sx={{
                                position: 'relative',
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
                                    <Container sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        {tours.map((tour) => (
                                            <Box key={tour.id}>
                                                <Card
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        height: 180,
                                                        boxShadow: 3,
                                                        borderRadius: 0.5,
                                                        overflow: 'hidden',
                                                        position: 'relative',
                                                    }}
                                                >
                                                    <Box sx={{ position: 'relative', width: 200, height: '100%' }}>
                                                        <Link
                                                            component={RouterLink}
                                                            href={paths.homeTour.details(String(tour.id))}
                                                            color="inherit"
                                                            variant="subtitle2"
                                                            underline="none"
                                                            noWrap
                                                            onClick={(e) => {
                                                                if (tour.date) {
                                                                    const today = new Date();
                                                                    const tourDate = new Date(tour.date);

                                                                    if (today >= tourDate) {
                                                                        e.preventDefault();
                                                                        toast.error('Tour này đã khởi hành, không thể xem chi tiết!');
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            <CardMedia
                                                                component="img"
                                                                sx={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    objectFit: 'cover',
                                                                }}
                                                                image={`${CONFIG.assetsDir}${tour.image}`}
                                                                alt={tour.title}
                                                            />
                                                        </Link>

                                                        <Box
                                                            sx={{
                                                                position: 'absolute',
                                                                top: '50%',
                                                                left: '50%',
                                                                transform: 'translate(-50%, -50%)',
                                                                color: 'common.white',
                                                                borderRadius: 1,
                                                                px: 1.5,
                                                                py: 0.75,
                                                                textAlign: 'center',
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                minWidth: '100%',
                                                            }}
                                                        >
                                                            <TourCountdown date={tour.date} />
                                                        </Box>
                                                    </Box>

                                                    <CardContent
                                                        sx={{
                                                            flex: 1,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'space-between',
                                                            p: 2.5,
                                                        }}
                                                    >
                                                        <Link
                                                            component={RouterLink}
                                                            href={paths.homeTour.details(String(tour.id))}
                                                            color="inherit"
                                                            variant="subtitle2"
                                                            underline="none"
                                                            noWrap
                                                            onClick={(e) => {
                                                                if (tour.date) {
                                                                    const today = new Date();
                                                                    const tourDate = new Date(tour.date);

                                                                    if (today >= tourDate) {
                                                                        e.preventDefault();
                                                                        toast.error('Tour này đã khởi hành, không thể xem chi tiết!');
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            <Box>
                                                                <Typography variant="h6" gutterBottom noWrap>
                                                                    {tour.title}
                                                                </Typography>

                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                                                        Ngày khởi hành: {tour.date ? fDate(tour.date) : 'Chưa có ngày'}
                                                                    </Typography>
                                                                </Box>

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
                                                                        <Chip
                                                                            key={idx}
                                                                            size="small"
                                                                            label={inc}
                                                                            color="primary"
                                                                            variant="outlined"
                                                                        />
                                                                    ))}
                                                                    {tour.extras.map((extra, idx) => (
                                                                        <Chip
                                                                            key={idx}
                                                                            size="small"
                                                                            label={extra}
                                                                            color="secondary"
                                                                            variant="outlined"
                                                                        />
                                                                    ))}
                                                                </Stack>
                                                            </Box>
                                                        </Link>
                                                    </CardContent>
                                                </Card>
                                            </Box>
                                        ))}
                                    </Container>
                                )
                            }
                        </Box>
                        {(pagination?.totalRecord && pagination.totalRecord) > 0 && (
                            <Box
                                sx={{
                                    position: 'sticky',
                                    bottom: 0,
                                    mt: { xs: 4, md: 2 },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 2,
                                    zIndex: 999,
                                    bgcolor: '#fff'
                                }}
                            >
                                <TablePagination
                                    component="div"
                                    count={pagination.totalRecord}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    rowsPerPageOptions={[5, 10, 20]}
                                    labelRowsPerPage="Số dòng mỗi trang:"
                                    labelDisplayedRows={({ from, to, count }) =>
                                        `${from}–${to} trên ${count !== -1 ? count : `nhiều hơn ${to}`}`
                                    }
                                />
                            </Box>
                        )}
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}
