import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, Stack } from '@mui/material';
import { useBoolean, UseBooleanReturn } from 'minimal-shared/hooks';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { updateUser } from 'src/actions/user';
import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { UserDto } from 'src/types/user';
import { z as zod } from 'zod';

const ChangePasswordSchema = zod
    .object({
        newPassword: zod.string().min(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự!' }),
        confirmPassword: zod.string().min(1, { message: 'Vui lòng xác nhận mật khẩu mới!' }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Mật khẩu xác nhận không khớp!',
        path: ['confirmPassword'],
    });

type ChangePasswordSchemaType = zod.infer<typeof ChangePasswordSchema>;

export function UserChangePassword({ confirmChangePass, selectedId }: { confirmChangePass: UseBooleanReturn; selectedId: number }) {
    const showCurrent = useBoolean();
    const showNew = useBoolean();
    const showConfirm = useBoolean();

    const methods = useForm<ChangePasswordSchemaType>({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        },
    });

    const {
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            const basePayload: UserDto = {
                password: data.confirmPassword
            }

            await updateUser(basePayload, selectedId);

            console.log('Đổi mật khẩu thành công:', data);
            toast.success('Đổi mật khẩu thành công!');
            reset();
            confirmChangePass.onFalse();
        } catch (error) {
            toast.error('Đổi mật khẩu thất bại!');
            console.error(error);
        }
    });

    return (
        <Dialog open={confirmChangePass.value} onClose={confirmChangePass.onFalse} fullWidth maxWidth="xs">
            <DialogTitle>Đổi mật khẩu</DialogTitle>

            <Form methods={methods} onSubmit={onSubmit}>
                <DialogContent dividers>
                    <Stack spacing={2} pt={1}>
                        <Field.Text
                            name="newPassword"
                            label="Mật khẩu mới"
                            placeholder="Tối thiểu 6 ký tự"
                            type={showNew.value ? 'text' : 'password'}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={showNew.onToggle} edge="end">
                                                <Iconify icon={showNew.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                        <Field.Text
                            name="confirmPassword"
                            label="Xác nhận mật khẩu mới"
                            type={showConfirm.value ? 'text' : 'password'}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={showConfirm.onToggle} edge="end">
                                                <Iconify icon={showConfirm.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" color="inherit" onClick={confirmChangePass.onFalse} disabled={isSubmitting}>
                        Hủy
                    </Button>
                    <Button type="submit" variant="contained" loading={isSubmitting}>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Form>
        </Dialog>
    );
}