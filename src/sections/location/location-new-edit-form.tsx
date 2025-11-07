import { zodResolver } from "@hookform/resolvers/zod";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createLocation, updateLocation } from "src/actions/location";
import { Field, Form } from "src/components/hook-form";
import { z } from "zod";

const locationSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Tên địa điểm không được để trống')
        .max(255, 'Tên quá dài, tối đa 255 ký tự'),
});
type LocationFormValues = z.infer<typeof locationSchema>;

type Props = {
    open: boolean;
    onClose: () => void;
    refetch?: () => void;
    editData?: { id: number; name: string } | null;
};

export function LocationNewEditForm({ open, onClose, refetch, editData }: Props) {
    const isEdit = Boolean(editData);
    const defaultValues: LocationFormValues = {
        name: ""
    };
    const methods = useForm<LocationFormValues>({
        resolver: zodResolver(locationSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        if (editData) {
            reset({ name: editData.name });
        } else {
            reset({ name: '' });
        }
    }, [editData, reset, open]);

    const onSubmit = handleSubmit(async (values: LocationFormValues) => {
        try {
            if (isEdit && editData) {
                await updateLocation(values.name, editData.id);
                toast.success('Cập nhật địa điểm thành công!');
            } else {
                await createLocation(values.name);
                toast.success('Tạo địa điểm mới thành công!');
            }

            if (refetch) refetch();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Đã xảy ra lỗi, vui lòng thử lại!');
        }
    });

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>{isEdit ? 'Chỉnh sửa địa điểm' : 'Tạo mới địa điểm'}</DialogTitle>

            <Form onSubmit={onSubmit} methods={methods} >
                <DialogContent dividers>
                    <Stack spacing={2} mt={1}>
                        <Field.Text name="name" label="Tên địa điểm" />
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={18} /> : undefined}
                    >
                        {isEdit ? 'Lưu thay đổi' : 'Tạo mới'}
                    </Button>
                </DialogActions>
            </Form>
        </Dialog>
    );
}