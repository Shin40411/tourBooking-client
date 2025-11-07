import { z as zod } from 'zod';
import { useRouter } from 'src/routes/hooks';
import { toast } from 'src/components/snackbar';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Box,
  Stack,
  Card,
  Chip,
  Button,
  Divider,
  Collapse,
  CardHeader,
  Typography,
  IconButton,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Autocomplete,
} from '@mui/material';
import { Form, Field } from 'src/components/hook-form';
import { paths } from 'src/routes/paths';
import type { TourDto, TourItem } from 'src/types/tour';
import { useBoolean } from 'minimal-shared/hooks';
import { createTour, updateTour, uploadImage, useGetToursExtras, useGetToursIncludes } from 'src/actions/tour';
import { Iconify } from 'src/components/iconify';
import { useGetLocations } from 'src/actions/location';
import { useCallback, useMemo, useState } from 'react';
import { CONFIG } from 'src/global-config';
import dayjs from 'dayjs';
import { generateTourCode } from './helper/generate-tour-code';
import { mutate } from 'swr';

// ----------------------------------------------------------------------

export const NewTourSchema = zod.object({
  title: zod.string().min(1, { message: 'Vui lòng nhập tiêu đề tour!' }).max(100, { message: 'Tiêu đề tối đa 100 ký tự!' }),
  price: zod.number().min(1, { message: 'Giá phải lớn hơn 0!' }),
  description: zod.string().min(10, { message: 'Mô tả phải có ít nhất 10 ký tự!' }),
  duration: zod.string().min(10, { message: 'Thời gian phải có ít nhất 10 ký tự!' }),
  slots: zod.number().min(1, { message: 'Số chỗ phải lớn hơn hoặc bằng 1!' }),
  date: zod.custom<string | number | null>().refine(
    (val) => val !== null && val !== undefined && val !== '',
    { message: 'Vui lòng chọn ngày khởi hành!' }
  ),
  image: zod
    .any()
    .refine((file) => file instanceof File || typeof file === 'string', {
      message: 'Ảnh tour không hợp lệ',
    })
    .refine((file) => !!file, {
      message: 'Ảnh tour là bắt buộc',
    }),
  includes: zod
    .array(zod.string().trim().min(1, { message: 'Không được để trống!' }))
    .min(1, { message: 'Phải có ít nhất 1 dịch vụ bao gồm!' }),
  extras: zod
    .array(zod.string().trim().min(1, { message: 'Không được để trống!' }))
    .min(1, { message: 'Phải có ít nhất 1 dịch vụ bổ sung!' })
    .or(zod.literal('').transform(() => [])),
  locationIds: zod.array(zod.string()).min(1, { message: 'Chọn ít nhất 1 địa điểm!' }),
});

export type NewTourSchemaType = zod.infer<typeof NewTourSchema>;

// ----------------------------------------------------------------------

type Props = {
  currentTour?: TourItem;
  mutateTour?: () => void;
};

export function TourNewEditForm({ currentTour, mutateTour }: Props) {
  const router = useRouter();
  const currentDate = dayjs();
  const openDetails = useBoolean(true);
  const openProperties = useBoolean(true);

  const today = new Date();
  const { toursExtras, toursExtrasLoading, toursExtrasEmpty } = useGetToursExtras();
  const { toursIncludes, toursIncludesEmpty, toursIncludesLoading } = useGetToursIncludes();
  const { locations, locationsLoading, locationsError } = useGetLocations({
    pageNumber: 1,
    pageSize: 999,
    enabled: true
  });
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


  const defaultValues: NewTourSchemaType = {
    title: '',
    price: 0,
    duration: '',
    description: '',
    slots: 1,
    date: today.toISOString(),
    image: '',
    includes: [],
    extras: [],
    locationIds: [],
  };

  const methods = useForm<NewTourSchemaType>({
    resolver: zodResolver(NewTourSchema),
    defaultValues,
    values: currentTour
      ? {
        title: currentTour.title,
        price: currentTour.price,
        duration: currentTour.duration,
        description: currentTour.description,
        slots: currentTour.slots,
        includes: currentTour.includes,
        extras: currentTour.extras || [],
        image: currentTour.image,
        locationIds: currentTour.locations?.map((l) => String(l.id)) || [],
        date: currentTour.date,
      }
      : undefined,
  });

  const {
    watch,
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const selectedLocationIds = watch("locationIds");
  const selectedDate = watch("date");

  const selectedLocations = locations.filter((loc) =>
    selectedLocationIds.includes(String(loc.id))
  );

  const tourCode = generateTourCode({
    locations: selectedLocations,
    date: selectedDate,
  });

  const [mode, setMode] = useState<'select' | 'manual'>('select');

  const [modeExtras, setModeExtras] = useState<'select' | 'manual'>('select');

  const handleRemoveFile = useCallback(() => {
    setValue('image', '', { shouldValidate: true });
  }, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let imagePayload = '';

      if (typeof data.image === "string") {
        imagePayload = data.image;
      } else if (data.image instanceof File) {
        try {
          const res = await uploadImage(data.image);
          imagePayload = `${CONFIG.serverUrl}${res}`;
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.error("Lỗi khi tải ảnh lên. Vui lòng thử lại.");
          return;
        }
      }

      const basePayload: TourDto = {
        tourCode: tourCode,
        title: data.title,
        date: dayjs(data.date).format('YYYY-MM-DD'),
        duration: data.duration,
        description: data.description,
        image: imagePayload,
        extras: data.extras ?? [],
        includes: data.includes,
        locationIds: data.locationIds?.map(Number) ?? [],
        price: data.price,
        slots: data.slots
      };

      if (!currentTour)
        await createTour(basePayload);
      else
        await updateTour(basePayload, currentTour.id);

      toast.success(currentTour ? 'Cập nhật tour thành công!' : 'Tạo tour mới thành công!');
      reset();
      await mutate(
        (key) => typeof key === 'string' && key.includes('/api/tours'),
        undefined,
        { revalidate: true }
      );
      await mutateTour?.();
      router.push(paths.dashboard.tour.root);
    } catch (error) {
      console.error(error);
      toast.error('Failed to create tour');
    }
  });

  const renderCollapseButton = (value: boolean, onToggle: () => void) => (
    <IconButton onClick={onToggle}>
      <Iconify icon={value ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'} />
    </IconButton>
  );

  const renderDetails = () => (
    <Card>
      <CardHeader
        title="Thông tin Tour"
        subheader={<Box mb={2}>
          <Typography variant='caption' color='text.secondary'>Nhập thông tin cơ bản của tour</Typography>
        </Box>}
        action={renderCollapseButton(openDetails.value, openDetails.onToggle)}
      />

      <Collapse in={openDetails.value}>
        <Divider />
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Tiêu đề</Typography>
            <Field.Text name="title" placeholder="Ví dụ: Khám phá Vịnh Hạ Long..." />
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Ảnh đại diện</Typography>
            <Field.Upload
              // multiple
              thumbnail
              name="image"
              maxSize={3145728}
              onDelete={handleRemoveFile}
              // onRemoveAll={handleRemoveAllFiles}
              onUpload={() => console.log('ON UPLOAD')}
            />
          </Stack>

          <Stack spacing={1.5} direction={{ xs: 'column', md: 'row' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2">Giá tour</Typography>
              <Field.Text name="price" type="number" placeholder="Ví dụ: 2000000" />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2">Số lượt đặt tour</Typography>
              <Field.Text name="slots" type="number" placeholder="Ví dụ: 20" />
            </Box>
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Ngày khởi hành</Typography>
            <Field.DatePicker minDate={currentDate} name="date" />
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Thời gian</Typography>
            <Field.Text name="duration" placeholder="3 ngày 2 đêm" />
          </Stack>
        </Stack>
      </Collapse>
    </Card>
  );

  const renderProperties = () => (
    <Card>
      <CardHeader
        title="Thông tin bổ sung"
        subheader={<Box mb={2}>
          <Typography variant='caption' color='text.secondary'>Dịch vụ bao gồm, phụ phí và điểm đến</Typography>
        </Box>}
        action={renderCollapseButton(openProperties.value, openProperties.onToggle)}
      />

      <Collapse in={openProperties.value}>
        <Divider />
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Dịch vụ bao gồm</Typography>

            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={(_, newMode) => {
                if (newMode) {
                  setMode(newMode);
                  setValue('includes', []);
                }
              }}
              size="small"
              sx={{ mb: 1, width: 'fit-content' }}
            >
              <ToggleButton value="select">Chọn từ danh sách</ToggleButton>
              <ToggleButton value="manual">Thêm dịch vụ tùy chọn</ToggleButton>
            </ToggleButtonGroup>

            {mode === 'select' ? (
              <Box sx={{ flexGrow: 1 }}>
                <Field.MultiSelect
                  variant="outlined"
                  name="includes"
                  options={tourIncludeOptions}
                  checkbox
                  chip
                  placeholder={
                    toursIncludesLoading
                      ? 'Đang tải...'
                      : toursIncludesEmpty
                        ? 'Không có dữ liệu'
                        : 'Chọn dịch vụ bao gồm'
                  }
                  disabled={toursIncludesLoading}
                  sx={{ width: '100%' }}
                />
              </Box>
            ) : (
              <Controller
                name="includes"
                control={control}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    value={field.value || []}
                    onChange={(_, newValue) => field.onChange(newValue)}
                    renderTags={(value: readonly string[], getTagProps) =>
                      value.map((option: string, index: number) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Nhập dịch vụ (phẩy hoặc Enter để thêm)"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            const input = (e.target as HTMLInputElement).value.trim();
                            if (input) {
                              field.onChange([...(field.value || []), input]);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                      />
                    )}
                  />
                )}
              />

            )}
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Dịch vụ bổ sung</Typography>
            <ToggleButtonGroup
              value={modeExtras}
              exclusive
              onChange={(_, newMode) => {
                if (newMode) {
                  setModeExtras(newMode);
                  setValue('extras', []);
                }
              }}
              size="small"
              sx={{ mb: 1, width: 'fit-content' }}
            >
              <ToggleButton value="select">Chọn từ danh sách</ToggleButton>
              <ToggleButton value="manual">Thêm dịch vụ tùy chọn</ToggleButton>
            </ToggleButtonGroup>

            {modeExtras === 'select' ? (
              <Box sx={{ flexGrow: 1 }}>
                <Field.MultiSelect
                  name="extras"
                  variant="outlined"
                  options={tourExtrasOptions}
                  checkbox
                  chip
                  placeholder={
                    toursExtrasLoading
                      ? 'Đang tải...'
                      : toursExtrasEmpty
                        ? 'Không có dữ liệu'
                        : 'Chọn dịch vụ bổ sung'
                  }
                  disabled={toursExtrasLoading}
                  sx={{ width: '100%' }}
                />
              </Box>
            ) : (
              <Controller
                name="extras"
                control={control}
                render={({ field, fieldState }) => (
                  <Autocomplete<string, true, false, true>
                    multiple
                    freeSolo
                    options={[]}
                    value={field.value || []}
                    onChange={(_, newValue) => field.onChange(newValue)}
                    renderTags={(value: readonly string[], getTagProps) =>
                      value.map((option: string, index: number) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Nhập dịch vụ (phẩy hoặc Enter để thêm)"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            const input = (e.target as HTMLInputElement).value.trim();
                            if (input) {
                              field.onChange([...(field.value || []), input]);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                      />
                    )}
                  />
                )}
              />
            )}
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Điểm đến</Typography>
            <Field.MultiSelect
              name="locationIds"
              options={locationOptions}
              checkbox
              chip
              variant='outlined'
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
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Mô tả lịch trình</Typography>
            <Field.Editor name="description" sx={{ height: 300 }} placeholder='Nhập mô tả lịch trình...' />
          </Stack>
        </Stack>
      </Collapse>
    </Card>
  );

  const renderActions = () => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
      <Button type="submit" variant="contained" size="large" loading={isSubmitting}>
        {!currentTour ? 'Tạo tour mới' : 'Lưu thay đổi'}
      </Button>
    </Box>
  );

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={4} sx={{ mx: 'auto' }}>
          {renderDetails()}
          {renderProperties()}
          {renderActions()}
        </Stack>
      </Form>
    </>
  );
}