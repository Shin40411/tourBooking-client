import type { UserDto, UserItem } from 'src/types/user';

import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';


import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { IconButton, InputAdornment, MenuItem } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { useBoolean } from 'minimal-shared/hooks';
import { createUser, updateUser } from 'src/actions/user';
import { mutate } from 'swr';

// ----------------------------------------------------------------------


export const NewUserSchema = (hasCurrentUser: boolean) =>
  zod.object({
    username: zod.string().min(1, { message: 'Vui lòng nhập tên tài khoản!' }),
    email: zod
      .string()
      .min(1, { message: 'Vui lòng nhập địa chỉ email!' })
      .email({ message: 'Địa chỉ email không hợp lệ!' }),
    phone: zod
      .string()
      .regex(/^0\d{9}$/, { message: 'Số điện thoại không hợp lệ' }),
    role: zod.string().min(1, { message: 'Vui lòng chọn cấp độ tài khoản!' }),
    password: zod
      .string()
      .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự!' }),
  });

export type NewUserSchemaType = zod.infer<ReturnType<typeof NewUserSchema>>;
// ----------------------------------------------------------------------

type Props = {
  currentUser?: UserItem;
};

export function UserNewEditForm({ currentUser }: Props) {
  const router = useRouter();
  const showPassword = useBoolean();

  const defaultValues: NewUserSchemaType = {
    username: '',
    email: '',
    phone: '',
    role: 'ROLE_USER',
    password: ''
  };

  const methods = useForm<NewUserSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema(!!currentUser)),
    defaultValues,
    values: currentUser,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const basePayload: UserDto = {
        username: data.username,
        email: data.email,
        phone: data.phone,
        role: data.role
      }

      const createPayload = {
        ...basePayload,
        password: data.password || ''
      }

      const updatePayload = {
        ...basePayload
      }

      if (!currentUser)
        await createUser(createPayload);
      else
        await updateUser(updatePayload, currentUser.id);

      reset();
      toast.success(currentUser ? 'Cập nhật tài khoản thành công!' : 'Tạo tài khoản mới thành công!');
      await mutate(
        (k) => typeof k === "string" && k.startsWith('/api/users'),
        undefined,
        { revalidate: true }
      );
      router.push(paths.dashboard.user.list);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Đã có lỗi xảy ra");
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="username" label="Tên tài khoản" />
              {!currentUser && (
                <Field.Text
                  name="password"
                  label="Mật khẩu"
                  placeholder="6+ ký tự"
                  type={showPassword.value ? 'text' : 'password'}
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={showPassword.onToggle} edge="end">
                            <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
              <Field.Text name="email" label="Địa chỉ email" />
              <Field.Text
                name="phone"
                label="Số điện thoại"
              />
              <Field.Select name="role" label="Cấp độ tài khoản">
                <MenuItem key="ROLE_ADMIN" value="ROLE_ADMIN">Quản trị viên</MenuItem>
                <MenuItem key="ROLE_USER" value="ROLE_USER">Người dùng (Khách hàng)</MenuItem>
              </Field.Select>
            </Box>

            <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
              <Button type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Tạo tài khoản' : 'Lưu thay đổi'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
