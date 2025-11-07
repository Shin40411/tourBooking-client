import { Box, Button, Card, CardContent, CardMedia, Container, Divider, Stack, TablePagination, Typography } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { useSearchParams } from "react-router";
import { useGetLocation } from "src/actions/location";
import { useGetTours } from "src/actions/tour";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { EmptyContent } from "src/components/empty-content";
import { CONFIG } from "src/global-config";
import { RouterLink } from "src/routes/components";
import { paths } from "src/routes/paths";
import HomeFilter from "src/sections/home/home-filter";
import { TourFilterParams } from "src/types/tour";
import { fCurrencyVN } from "src/utils/format-number";
import { fDate } from "src/utils/format-time-vi";

type Props = {
    id: number;
};

export function CategoryShopView({ id }: Props) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { location, locationError } = useGetLocation(id);
    const { tours = [], toursEmpty, toursLoading, pagination } = useGetTours(
        { locationIds: [id] }, page + 1, rowsPerPage
    );

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    if (toursLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Typography variant="body1">Đang tải tour...</Typography>
            </Box>
        );
    }

    return (
        <Box component="section" sx={{
            backgroundImage: `url(${CONFIG.assetsDir}/assets/background/stolenbgpricing.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>
            <Box
                sx={{
                    position: 'relative',
                    height: { xs: 250, md: 350 },
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 4,
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: 20,
                        left: { xs: 16, md: 40 },
                        bgcolor: '#fff',
                        borderRadius: 4,
                        p: 2,
                        mx: 4
                    }}
                >
                    <CustomBreadcrumbs
                        links={[
                            { name: 'Điểm đến', href: '/' },
                            { name: 'Danh mục' },
                            { name: location?.name }
                        ]}
                    />
                </Box>

                <Box sx={{ textAlign: 'center', px: 2 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            color: 'white',
                            fontWeight: 700,
                            mb: 1,
                            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                            fontSize: { xs: '2rem', md: '3rem' },
                        }}
                    >
                        {location?.name}
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'white',
                            fontWeight: 400,
                            textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
                        }}
                    >
                        Khám phá {tours.length} tour du lịch tại điểm đến này !!!
                    </Typography>
                </Box>
            </Box>
            <Container maxWidth="lg" sx={{ mb: 6 }}>
                <Box pb={10}>
                    <HomeFilter />
                </Box>
                {toursEmpty || tours.length === 0
                    ?
                    <Box height={400} width="100%" display="flex" justifyContent="center" alignItems="center">
                        <EmptyContent />
                    </Box>
                    :
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                md: 'repeat(3, 1fr)',
                            },
                            gap: 3,
                        }}
                    >

                        {tours.map((tour) => (
                            <Card
                                key={tour.id}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 1,
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                        transform: 'translateY(-8px)',
                                    },
                                }}
                            >
                                <Box sx={{ position: 'relative', paddingTop: '66.67%' }}>
                                    <CardMedia
                                        component="img"
                                        image={tour.image}
                                        alt={tour.title}
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </Box>
                                <CardContent
                                    sx={{
                                        p: 2.5,
                                        flexGrow: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 600,
                                            mb: 1.5,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            minHeight: '2em',
                                        }}
                                    >
                                        {tour.title}
                                    </Typography>

                                    <Box sx={{ mb: 1.5 }}>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
                                        >
                                            🛫 {fDate(tour.date)}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
                                        >
                                            ⏱ {tour.duration}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                            }}
                                        >
                                            📍 {tour.locations.map((l) => l.name).join(', ')}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mt: 'auto' }}>
                                        <Divider sx={{ mb: 2 }} />
                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >
                                            <Box>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{ display: 'block', mb: 0.5 }}
                                                >
                                                    Giá từ
                                                </Typography>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: 'primary.main',
                                                    }}
                                                >
                                                    {fCurrencyVN(tour.price)}
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="contained"
                                                size="medium"
                                                component={RouterLink}
                                                href={paths.homeTour.details(String(tour.id))}
                                                sx={{
                                                    px: 2.5,
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Xem chi tiết
                                            </Button>
                                        </Stack>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                }

                {(pagination?.totalRecord && pagination.totalRecord) > 0 && (
                    <Box
                        sx={{
                            mt: 6,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            py: 1,
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            boxShadow: 2,
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
            </Container>
        </Box>
    );
}