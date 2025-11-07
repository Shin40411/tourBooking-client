import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { _countryNames } from "src/_mock";
import { createCategory, updateCategory } from "src/actions/category";
import { useGetLocations } from "src/actions/location";
import { Field, Form } from "src/components/hook-form";
import { ICategoryDto, ICategoryItem } from "src/types/category";
import { z } from "zod";

type Props = {
    open: boolean;
    editingCategory: ICategoryItem | null;
    onClose: VoidFunction;
    mutation: () => void;
};

const CategorySchema = z.object({
    name: z.string().min(1, 'Tên danh mục là bắt buộc'),
    country: z.string().min(1, 'Quốc gia là bắt buộc'),
    locationIds: z.array(z.string()).min(1, { message: 'Chọn ít nhất 1 địa điểm!' }),
});

type CategoryFormValues = z.infer<typeof CategorySchema>;

export function CategoryNewEditForm({
    open,
    editingCategory,
    onClose,
    mutation,
}: Props) {
    const { locations, locationsEmpty, locationsError, locationsLoading } = useGetLocations({
        pageNumber: 1,
        pageSize: 999,
        enabled: open
    });

    const defaultValues: CategoryFormValues = {
        name: '',
        country: '',
        locationIds: [],
    };

    const locationOptions = useMemo(
        () =>
            locations.map((loc) => ({
                label: loc.name,
                value: String(loc.id),
            })),
        [locations]
    );

    const methods = useForm<CategoryFormValues>({
        resolver: zodResolver(CategorySchema),
        defaultValues
    });

    const {
        watch,
        control,
        reset,
        handleSubmit,
        setValue,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        if (editingCategory) {
            reset({
                name: String(editingCategory.name ?? ''),
                country: String(editingCategory.country ?? ''),
                locationIds: editingCategory.locations.flatMap((l) => String(l.id)),
            });
        } else {
            reset({
                name: '',
                country: '',
                locationIds: [],
            });
        }
    }, [editingCategory, reset]);

    const onSubmit = handleSubmit(async (data: CategoryFormValues) => {
        try {
            const mapperData: ICategoryDto = {
                country: data.country,
                name: data.name,
                locationIds: data.locationIds.map(Number),
            }
            if (editingCategory) {
                await updateCategory(mapperData, editingCategory.id);
                toast.success('Cập nhật danh mục thành công!');
            } else {
                await createCategory(mapperData);
                toast.success('Tạo danh mục thành công!');
            }
            onClose();
            mutation();
            reset();
        } catch (error) {
            toast.error('Có lỗi xảy ra!');
            console.error(error);
        }
    });

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{editingCategory ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}</DialogTitle>

            <Form methods={methods} onSubmit={onSubmit}>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <Field.Text
                            name="name"
                            label="Tên danh mục"
                            placeholder="Du lịch trong nước"
                        />

                        <Field.Select
                            name="country"
                            label="Quốc gia"
                        >
                            {_countryNames.map((option) => (
                                <MenuItem key={option} value={option} sx={{ textTransform: 'capitalize' }}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Field.Select>

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
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} disabled={isSubmitting}>
                        Hủy
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                        {editingCategory ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                </DialogActions>
            </Form>
        </Dialog>
    );
}