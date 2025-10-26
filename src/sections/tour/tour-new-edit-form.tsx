import { z as zod } from 'zod';
import { useRouter } from 'src/routes/hooks';
import { toast } from 'src/components/snackbar';
import { useForm } from 'react-hook-form';
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
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { paths } from 'src/routes/paths';
import type { TourDto, TourItem } from 'src/types/tour';
import { useBoolean } from 'minimal-shared/hooks';
import { createTour, updateTour, useGetToursExtras, useGetToursIncludes } from 'src/actions/tour';
import { IDateValue } from 'src/types/common';
import { Iconify } from 'src/components/iconify';
import { useGetLocations } from 'src/actions/location';
import { useCallback, useMemo, useState } from 'react';
import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export const NewTourSchema = zod.object({
  title: zod.string().min(1, { message: 'Vui lòng nhập tiêu đề tour!' }),
  price: zod.number().min(1, { message: 'Giá phải lớn hơn 0!' }),
  description: zod.string().min(10, { message: 'Mô tả phải có ít nhất 10 ký tự!' }),
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
  includes: zod.array(zod.string().min(1)).min(1, { message: 'Phải có ít nhất 1 dịch vụ bao gồm!' }),
  extras: zod.array(zod.string().min(1)).optional(),
  locationIds: zod.array(zod.string()).min(1, { message: 'Chọn ít nhất 1 địa điểm!' }),
});

export type NewTourSchemaType = zod.infer<typeof NewTourSchema>;

// ----------------------------------------------------------------------

type Props = {
  currentTour?: TourItem;
};

export function TourNewEditForm({ currentTour }: Props) {
  const router = useRouter();
  const openIncludeDialog = useBoolean(false);
  const openExtrasDialog = useBoolean(false);
  const openDetails = useBoolean(true);
  const openProperties = useBoolean(true);
  const [newInclude, setNewInclude] = useState('');

  const today = new Date();
  const { toursExtras, toursExtrasLoading, toursExtrasEmpty } = useGetToursExtras();
  const { toursIncludes, toursIncludesEmpty, toursIncludesLoading } = useGetToursIncludes();
  const { locations, locationsLoading, locationsError } = useGetLocations();
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
        description: currentTour.description,
        slots: currentTour.slots,
        includes: currentTour.includes,
        extras: currentTour.extras || [],
        image: `${CONFIG.assetsDir}${currentTour.image}`,
        locationIds: currentTour.locations?.map((l) => String(l.id)) || [],
        date: currentTour.date,
      }
      : undefined,
  });

  const {
    watch,
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const handleAddInclude = () => {
    const trimmed = newInclude.trim();
    if (!trimmed) return;
    openIncludeDialog.onFalse();
  };

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
          // const res = await uploadImage(data.image, data.Folder);
          // imagePayload = `${CONFIG.serverUrl}/${res.data.filePath}`;
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.error("Lỗi khi tải ảnh lên. Vui lòng thử lại.");
          return;
        }
      }

      const basePayload: TourDto = {
        title: data.title,
        date: data.date,
        description: data.description,
        image: imagePayload,
        extras: data.extras ?? [],
        includes: data.includes,
        locationIds: data.locationIds?.map(Number) ?? [],
        price: data.price,
        slots: data.slots
      };

      console.log(basePayload);

      if (!currentTour)
        await createTour(basePayload);
      else
        await updateTour(basePayload, currentTour.id);

      toast.success(currentTour ? 'Cập nhật tour thành công!' : 'Tạo tour mới thành công!');
      reset();
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
            <Field.DatePicker name="date" />
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
            <Stack direction="row" spacing={1} alignItems="center">
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

              <Button
                variant="contained"
                color="primary"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={openIncludeDialog.onTrue}
                sx={{ whiteSpace: 'nowrap' }}
                size='large'
              >
                Tạo mới
              </Button>
            </Stack>
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Dịch vụ bổ sung</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ flexGrow: 1 }}>
                <Field.MultiSelect
                  name="extras"
                  variant='outlined'
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
              </Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={openExtrasDialog.onTrue}
                sx={{ whiteSpace: 'nowrap' }}
                size='large'
              >
                Tạo mới
              </Button>
            </Stack>
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

  const renderIncludesAdd = () => (
    <Dialog open={openIncludeDialog.value} onClose={openIncludeDialog.onFalse} fullWidth maxWidth="xs">
      <DialogTitle>Thêm dịch vụ bao gồm</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Tên dịch vụ"
          value={newInclude}
          onChange={(e) => setNewInclude(e.target.value)}
          autoFocus
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={openIncludeDialog.onFalse} color="inherit">
          Hủy
        </Button>
        <Button onClick={handleAddInclude} variant="contained" color="primary">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderExtrasAdd = () => (
    <Dialog open={openExtrasDialog.value} onClose={openExtrasDialog.onFalse} fullWidth maxWidth="xs">
      <DialogTitle>Thêm dịch vụ bổ sung</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Tên dịch vụ"
          value={newInclude}
          onChange={(e) => setNewInclude(e.target.value)}
          autoFocus
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={openExtrasDialog.onFalse} color="inherit">
          Hủy
        </Button>
        <Button onClick={handleAddInclude} variant="contained" color="primary">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
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
      {renderIncludesAdd()}
      {renderExtrasAdd()}
    </>
  );
}
