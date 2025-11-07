import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { signUp } from '../../context/jwt';
import { useAuthContext } from '../../hooks';
import { getErrorMessage } from '../../utils';
import { FormHead } from '../../components/form-head';
import { SignUpTerms } from '../../components/sign-up-terms';
import { toast } from 'sonner';

// ----------------------------------------------------------------------


export const SignUpSchema = zod.object({
  username: zod
    .string()
    .min(3, { message: 'Họ và tên phải có ít nhất 3 ký tự' })
    .max(100, { message: 'Họ và tên không được vượt quá 100 ký tự' }),
  phone: zod
    .string()
    .regex(/^0\d{9}$/, { message: 'Số điện thoại không hợp lệ' }),
  email: zod
    .string()
    .email({ message: 'Email không hợp lệ' }),
  password: zod
    .string()
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
});

export type SignUpSchemaType = zod.infer<typeof SignUpSchema>;

// ----------------------------------------------------------------------

export function JwtSignUpView() {
  const router = useRouter();

  const showPassword = useBoolean();

  const { checkUserSession } = useAuthContext();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: SignUpSchemaType = {
    username: '',
    phone: '',
    email: '',
    password: '',
  };

  const methods = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signUp({
        email: data.email,
        password: data.password,
        username: data.username,
        phone: data.phone,
      });
      toast.success("Đăng ký thành công");
      toast.success("Vui lòng đăng nhập lại");
      router.push(paths.auth.jwt.signIn);
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text
        name="username"
        label="Họ và tên"
      />
      <Field.Text
        name="phone"
        label="Số điện thoại"
      />

      <Field.Text name="email" label="Địa chỉ email" />

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

      <Button
        fullWidth
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Đang xác thực..."
      >
        Tạo tài khoản
      </Button>
    </Box>
  );

  return (
    <>
      <FormHead
        title="Đăng ký tài khoản"
        description={
          <>
            {`Đã có tài khoản? `}
            <Link component={RouterLink} href={paths.auth.jwt.signIn} variant="subtitle2">
              Quay lại đăng nhập
            </Link>
          </>
        }
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <SignUpTerms />
    </>
  );
}
