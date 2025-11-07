import { Box, Typography } from '@mui/material';
import { useCountdown } from 'src/actions/tour';
import { Iconify } from 'src/components/iconify';
import { IDateValue } from 'src/types/common';
import { fDate } from 'src/utils/format-time-vi';

type Props = {
    date: IDateValue;
};

export function TourCountdown({ date }: Props) {
    const targetDate = date ? new Date(date) : null;
    const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

    return (
        <Box
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'rgba(0, 0, 0, 0.55)',
                color: 'common.white',
                px: 1.5,
                py: 0.75,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '100%',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Iconify icon="solar:calendar-bold" width={18} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {date ? fDate(date) : 'Chưa có ngày'}
                </Typography>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    mt: 0.5,
                }}
            >
                <Iconify icon={isExpired ? "pajamas:time-out" : "mdi:clock-outline"} width={16} />
                <Typography variant="caption">
                    {isExpired ? 'Đã khởi hành' : `${days}d ${hours}h ${minutes}m ${seconds}s`}
                </Typography>
            </Box>
        </Box>
    );
}
