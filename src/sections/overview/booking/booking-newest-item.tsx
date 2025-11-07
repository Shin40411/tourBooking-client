import { Avatar, Box, BoxProps, ListItemText, Skeleton } from "@mui/material";
import { useGetContactInfo } from "src/actions/booking";
import { useGetTour } from "src/actions/tour";
import { Iconify } from "src/components/iconify";
import { Image } from "src/components/image";
import { Label } from "src/components/label";
import { IBookingList } from "src/types/booking";
import { fCurrencyVN } from "src/utils/format-number";
import { fDateTime } from "src/utils/format-time-vi";

type Props = BoxProps & {
    title?: string;
    subheader?: string;
    list: IBookingList[];
};

type ItemProps = BoxProps & {
    item: Props['list'][number];
    loading: boolean;
};

export function BookingNewestItem({ item, loading, sx, ...other }: ItemProps) {
    const { contactInfo, contactInfoLoading } = useGetContactInfo({
        contactInfoId: item.contactInfoId,
        enabled: !!item
    });

    const { tour, tourLoading } = useGetTour(item.tourId);

    if (tourLoading || contactInfoLoading || loading) {
        return (
            <Box
                sx={[
                    {
                        width: 1,
                        borderRadius: 2,
                        position: 'relative',
                        bgcolor: 'background.neutral',
                    },
                    ...(Array.isArray(sx) ? sx : [sx]),
                ]}
                {...other}
            >
                <Box
                    sx={{
                        px: 2,
                        pb: 1,
                        gap: 2,
                        pt: 2.5,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Box sx={{ flex: 1 }}>
                            <Skeleton width="60%" height={20} />
                            <Skeleton width="40%" height={16} sx={{ mt: 0.5 }} />
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            rowGap: 1.5,
                            columnGap: 2,
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            typography: 'caption',
                            color: 'text.secondary',
                        }}
                    >
                        <Skeleton width={100} height={16} />
                        <Skeleton width={100} height={16} />
                    </Box>
                </Box>

                <Label
                    variant="filled"
                    sx={{
                        right: 16,
                        zIndex: 9,
                        bottom: 16,
                        position: 'absolute',
                        px: 2,
                        py: 0.5,
                    }}
                >
                    <Skeleton width={50} height={18} />
                </Label>

                <Box sx={{ p: 1, position: 'relative' }}>
                    <Skeleton
                        variant="rounded"
                        sx={{ borderRadius: 1.5 }}
                        width="100%"
                        height={240}
                    />
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={[
                {
                    width: 1,
                    borderRadius: 2,
                    position: 'relative',
                    bgcolor: 'background.neutral',
                },
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
            {...other}
        >
            <Box
                sx={{
                    px: 2,
                    pb: 1,
                    gap: 2,
                    pt: 2.5,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                    <Avatar alt={contactInfo?.fullName} src={contactInfo?.fullName} />
                    <ListItemText
                        primary={contactInfo?.fullName}
                        secondary={fDateTime(item.bookingDate)}
                        slotProps={{
                            secondary: {
                                sx: {
                                    mt: 0.5,
                                    typography: 'caption',
                                    color: 'text.disabled',
                                },
                            },
                        }}
                    />
                </Box>

                <Box
                    sx={{
                        rowGap: 1.5,
                        columnGap: 2,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        typography: 'caption',
                        color: 'text.secondary',
                    }}
                >
                    <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
                        <Iconify width={16} icon="solar:calendar-date-bold" sx={{ flexShrink: 0 }} />
                        {tour?.duration}
                    </Box>

                    <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
                        <Iconify width={16} icon="solar:users-group-rounded-bold" sx={{ flexShrink: 0 }} />
                        {item.quantity} hành khách
                    </Box>
                </Box>
            </Box>

            <Label variant="filled" sx={{ right: 16, zIndex: 9, bottom: 16, position: 'absolute' }}>
                {item.status === 'NEW' && '🔥'} {fCurrencyVN(tour?.price)}
            </Label>

            <Label variant="inverted" sx={{
                left: 16,
                zIndex: 9,
                bottom: 325,
                position: 'absolute',
                maxWidth: 200,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            }}>
                {tour?.title}
            </Label>
            <Box sx={{ p: 1, position: 'relative' }}>
                <Image alt={tour?.image} src={tour?.image} ratio="1/1" sx={{ borderRadius: 1.5 }} />
            </Box>
        </Box>
    );
}
