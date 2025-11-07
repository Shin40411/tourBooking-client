import type { IProductItem } from 'src/types/product';
import type { CheckoutContextValue } from 'src/types/checkout';

import { useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Link, { linkClasses } from '@mui/material/Link';
import { formHelperTextClasses } from '@mui/material/FormHelperText';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fCurrencyVN, fShortenNumber } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { ColorPicker } from 'src/components/color-utils';
import { NumberInput } from 'src/components/number-input';
import { TourItem } from 'src/types/tour';
import { useAuthContext } from 'src/auth/hooks';
import { fDate } from 'src/utils/format-time-vi';
import { Card, CardContent } from '@mui/material';
import { useTourCheckoutContext } from '../checkout/context';
import { ITourCheckoutItem } from 'src/types/booking';

// ----------------------------------------------------------------------

type Props = {
    tour: TourItem;
    disableActions?: boolean;
    onAddToCart?: () => {};
};

export function TourDetailsSummary({
    tour,
    onAddToCart,
    disableActions,
    ...other
}: Props) {
    const router = useRouter();
    const { user } = useAuthContext();
    const { onAddTour } = useTourCheckoutContext();
    const {
        id,
        tourCode,
        title,
        date,
        description,
        duration,
        extras,
        includes,
        locations,
        price,
        slots
    } = tour

    const defaultValues = {
        id,
        userId: user?.id,
        numPeople: slots ? 1 : 0
    };

    const methods = useForm<typeof defaultValues>({
        defaultValues,
    });

    const { watch, control, setValue, handleSubmit } = methods;

    const numPeople = watch('numPeople') ?? 0;

    const onSubmit = handleSubmit(async (data) => {
        try {
            const item: ITourCheckoutItem = {
                id,
                tourCode,
                title,
                price,
                duration,
                date,
                quantity: data.numPeople,
                slots,
                image: tour.image || '',
                includes,
                extras,
                locations,
                subtotal: data.numPeople * price,
            };
            onAddTour(item);
            router.push(paths.homeTour.checkOut);
        } catch (error) {
            console.error(error);
        }
    });

    const renderPrice = () => (
        <Box sx={{ typography: 'h5' }} color="red">
            {fCurrencyVN(price)}/ Khách
        </Box>
    );

    const renderDetailSum = () => (
        <Stack flexDirection="column" gap={2}>
            <Box display="flex" flexDirection="row" gap={1}>
                <Iconify icon="lsicon:bar-code-filled" /> <Typography variant='subtitle2'>Mã tour:</Typography> <Typography variant='subtitle2' color='secondary' fontWeight={700}>{tourCode}</Typography>
            </Box>
            <Box display="flex" flexDirection="row" gap={1}>
                <Iconify icon="mdi:airplane-date" /> <Typography variant='subtitle2'>Ngày khởi hành:</Typography> <Typography variant='subtitle2' color='secondary' fontWeight={700}>{fDate(date)}</Typography>
            </Box>
            <Box display="flex" flexDirection="row" gap={1}>
                <Iconify icon="fluent-mdl2:date-time" /> <Typography variant='subtitle2'>Thời gian:</Typography> <Typography variant='subtitle2' color='secondary' fontWeight={700}>{duration}</Typography>
            </Box>
        </Stack>
    );

    const renderQuantity = () => (
        <Box sx={{ display: 'flex' }}>
            <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                Số người tham gia
            </Typography>

            <Stack spacing={1}>
                <NumberInput
                    hideDivider
                    value={numPeople}
                    onChange={(_, quantity: number) => {
                        setValue('numPeople', quantity, { shouldDirty: true, shouldValidate: true });
                    }}
                    max={slots}
                    sx={{ maxWidth: 112 }}
                />

                <Typography
                    variant="caption"
                    component="div"
                    sx={{ textAlign: 'right', color: 'text.secondary' }}
                >
                    Số chỗ còn: {slots - numPeople}
                </Typography>
            </Stack>
        </Box>
    );

    const renderActions = () => (
        <Box sx={{ gap: 2, display: 'flex' }}>
            <Button fullWidth size="large" color='error' type="submit" variant="contained" disabled={disableActions} startIcon={<Iconify icon="material-symbols:travel" />}>
                Đặt ngay
            </Button>
        </Box>
    );

    const renderInventoryType = () => (
        <Box
            component="span"
            sx={{
                typography: 'overline',
                color:
                    (slots === 0 && 'error.main') ||
                    (slots <= 2 && 'warning.main') ||
                    'success.main',
            }}
        >
            {slots === 0 ? 'Tour đã ngưng hoạt động' : 'Tour vẫn còn chỗ'}
        </Box>
    );

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Card>
                <CardContent>
                    <Stack spacing={3} sx={{ pt: 3 }} {...other}>
                        <Stack spacing={2} alignItems="flex-start">
                            {renderInventoryType()}

                            <Typography variant="h5">{title}</Typography>

                            {renderPrice()}

                            {renderDetailSum()}
                        </Stack>

                        <Divider sx={{ borderStyle: 'dashed' }} />

                        {renderQuantity()}

                        <Divider sx={{ borderStyle: 'dashed' }} />

                        {renderActions()}
                    </Stack>
                </CardContent>
            </Card>
        </Form>
    );
}
