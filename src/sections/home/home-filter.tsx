import { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Grid,
    Typography,
    Slider,
    Button,
    Stack,
    Tabs,
    Tab,
} from '@mui/material';
import { useGetLocations } from 'src/actions/location';
import { Field, Form } from 'src/components/hook-form';
import { TourFilterParams, TourFilterValues } from 'src/types/tour';
import { useGetToursExtras, useGetToursIncludes } from 'src/actions/tour';
import { useForm } from 'react-hook-form';
import { Iconify } from 'src/components/iconify';
import dayjs from 'dayjs';
import { fCurrencyVN } from 'src/utils/format-number';
import { z } from 'zod';
import { TourFilterSchema } from './schema/filter-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';

type Props = {
    initialValues?: TourFilterValues;
};

const DEFAULT_VALUES: TourFilterValues = {
    title: '',
    includes: [],
    locations: [],
    extras: [],
    priceRange: [0, 50000000],
    startDate: null,
    endDate: null
};

export default function HomeFilter({ initialValues }: Props) {
    const { locations, locationsLoading, locationsError } = useGetLocations();
    const { toursExtras, toursExtrasLoading, toursExtrasEmpty } = useGetToursExtras();
    const { toursIncludes, toursIncludesEmpty, toursIncludesLoading } = useGetToursIncludes();
    const currentDate = dayjs();
    const [tab, setTab] = useState(0);
    const navigate = useNavigate();

    const methods = useForm<z.infer<typeof TourFilterSchema>>({
        resolver: zodResolver(TourFilterSchema),
        defaultValues: initialValues || DEFAULT_VALUES,
    });

    const { handleSubmit, reset, watch, setValue } = methods;

    const locationOptions = useMemo(
        () =>
            locations.map((loc) => ({
                label: loc.name,
                value: String(loc.id),
            })),
        [locations]
    );

    const tourExtrasOptions = useMemo(
        () =>
            toursExtras.map((e) => ({
                label: e,
                value: e,
            })),
        [toursExtras]
    );

    const tourIncludeOptions = useMemo(
        () =>
            toursIncludes.map((e) => ({
                label: e,
                value: e,
            })),
        [toursIncludes]
    );

    const watchValues = watch();
    const isDefault = useMemo(() => {
        return JSON.stringify(watchValues) === JSON.stringify(DEFAULT_VALUES);
    }, [watchValues]);

    useEffect(() => {
        if (initialValues) {
            reset(initialValues);
        }
    }, [initialValues, reset]);

    const onSubmit = handleSubmit((data) => {
        const params = new URLSearchParams({
            title: data.title || '',
            includes: (data.includes ?? []).join(','),
            extras: (data.extras ?? []).join(','),
            locations: (data.locations ?? []).join(','),
            fromDate: data.fromDate || '',
            toDate: data.toDate || '',
            priceMin: String(data.priceRange?.[0] ?? 0),
            priceMax: String(data.priceRange?.[1] ?? 50000000),
        });

        navigate(`${paths.homeTour}?${params.toString()}`);
    });

    const handleClear = () => {
        reset(DEFAULT_VALUES);
    };

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Box
                sx={{
                    p: 3,
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                    height: 300,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'stretch'
                }}
            >
                <Tabs
                    value={tab}
                    onChange={(_, newValue) => setTab(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        justifyContent: 'center',
                        '& .MuiTabs-flexContainer': {
                            justifyContent: 'center',
                        },
                        mb: 3
                    }}
                >
                    <Tab label="Combo trọn gói" icon={<Iconify icon="material-symbols:travel" width={20} />} iconPosition="start" />
                    <Tab label="Thời gian & địa điểm" icon={<Iconify icon="carbon:train-time" width={20} />} iconPosition="start" />
                    <Tab label="Ngân sách" icon={<Iconify icon="mdi:currency-usd" width={20} />} iconPosition="start" />
                </Tabs>

                {tab === 0 && (
                    <Grid container spacing={2} alignItems="flex-end">
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Field.Text
                                name="title"
                                label="Tên tour bạn cần tìm"
                                variant='standard'
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Field.MultiSelect
                                variant='standard'
                                name="includes"
                                options={tourIncludeOptions}
                                checkbox
                                chip
                                placeholder={
                                    toursIncludesLoading
                                        ? "Đang tải..."
                                        : toursIncludesEmpty
                                            ? "Không có dữ liệu"
                                            : "Dịch vụ bao gồm"
                                }
                                disabled={toursIncludesLoading}
                                sx={{ width: '100%' }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Field.MultiSelect
                                name="extras"
                                variant='standard'
                                options={tourExtrasOptions}
                                checkbox
                                chip
                                placeholder={
                                    toursExtrasLoading
                                        ? "Đang tải..."
                                        : toursExtrasEmpty
                                            ? "Không có dữ liệu"
                                            : "Dịch vụ bổ sung"
                                }
                                disabled={toursExtrasLoading}
                                sx={{ width: '100%' }}
                            />
                        </Grid>
                    </Grid>
                )}

                {tab === 1 && (
                    <Grid container alignItems="flex-end" spacing={3}>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <Field.DatePicker
                                name='fromDate'
                                label="Từ ngày"
                                format="DD/MM/YYYY"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <Field.DatePicker
                                name='toDate'
                                label="Đến ngày"
                                format="DD/MM/YYYY"
                                minDate={currentDate}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Field.MultiSelect
                                name="locations"
                                options={locationOptions}
                                checkbox
                                chip
                                variant='standard'
                                placeholder={
                                    locationsLoading
                                        ? "Đang tải địa điểm..."
                                        : locationsError
                                            ? "Không thể tải địa điểm"
                                            : "Chọn địa điểm"
                                }
                                disabled={locationsLoading || !!locationsError}
                                sx={{ width: '100%' }}
                            />
                        </Grid>
                    </Grid>
                )}

                {tab === 2 && (
                    <Box>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                            Ngân sách (Chọn mức giá)
                        </Typography>
                        <Slider
                            value={watchValues.priceRange}
                            min={0}
                            max={50000000}
                            step={500000}
                            valueLabelDisplay="auto"
                            onChange={(_, newValue) => setValue("priceRange", newValue as [number, number])}
                        />
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="caption">
                                {fCurrencyVN(watchValues.priceRange && watchValues.priceRange[0])}
                            </Typography>
                            <Typography variant="caption">
                                {fCurrencyVN(watchValues.priceRange && watchValues.priceRange[1])}
                            </Typography>
                        </Stack>
                    </Box>
                )}

                <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
                    {!isDefault &&
                        <Button variant="outlined" color="inherit" onClick={handleClear}>
                            Xóa lọc
                        </Button>
                    }
                    <Button variant="soft" color="primary" type="submit">
                        <Iconify icon="line-md:search" />
                    </Button>
                </Stack>
            </Box>
        </Form>
    );
}
