import { Avatar, Box, Button, Card, ListItemText, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useGetContactInfo } from "src/actions/booking";
import { Iconify } from "src/components/iconify";
import { IBookingList, IContactInfo } from "src/types/booking";

type BookerItemProps = {
    booker: IBookingList;
    onSelected: () => void;
    loadingId: string | null;
};

export function BookerItem({ booker, onSelected, loadingId }: BookerItemProps) {
    const { contactInfo } = useGetContactInfo({
        contactInfoId: booker.contactInfoId,
        enabled: !!booker
    });

    const [userInfo, setUserInfo] = useState<IContactInfo | null>(null);

    useEffect(() => {
        if (!contactInfo) return;
        setUserInfo(contactInfo);
    }, [contactInfo]);

    return (
        <Card key={booker.id} sx={{ p: 3, gap: 2, display: 'flex' }}>
            <Avatar alt={userInfo?.fullName} src={userInfo?.fullName} sx={{ width: 48, height: 48 }} />

            <Box sx={{ minWidth: 0, flex: '1 1 auto' }}>
                <ListItemText
                    primary={userInfo?.fullName}
                    secondary={
                        <Stack flexDirection="column" gap={2}>
                            <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
                                <Iconify icon="ic:baseline-email" width={16} />
                                Email: {userInfo?.email || '-'}
                            </Box>
                            <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
                                <Iconify icon="gridicons:phone" width={16} />
                                Số điện thoại: {userInfo?.phone || '-'}
                            </Box>
                            <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
                                <Iconify icon="solar:users-group-rounded-bold" width={16} />
                                Số lượng hành khách: {booker.quantity}
                            </Box>
                        </Stack>
                    }
                    slotProps={{
                        primary: { noWrap: true },
                        secondary: {
                            sx: { mt: 0.5, typography: 'caption', color: 'text.disabled' },
                        },
                    }}
                />
            </Box>

            <Button
                size="small"
                variant={booker.paymentStatus === "PAID" ? 'text' : 'outlined'}
                color={booker.paymentStatus === "PAID" ? 'success' : 'inherit'}
                startIcon={
                    booker.paymentStatus === "PAID" ? <Iconify width={18} icon="eva:checkmark-fill" sx={{ mr: -0.75 }} /> : <Iconify width={18} icon="material-symbols:pending-outline" sx={{ mr: -0.75 }} />
                }
                disabled={loadingId === String(booker.id)}
                onClick={onSelected}

            >
                {booker.paymentStatus === "PAID" ? 'Đã thanh toán' : 'Duyệt thanh toán'}
            </Button>
        </Card>
    );
}
