
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { Form, Field } from 'src/components/hook-form';
import { IContactInfo, TourCheckoutContextValue } from 'src/types/booking';
import { Iconify } from 'src/components/iconify';
import { Card, CardActions, CardContent, Typography } from '@mui/material';
import { useEffect } from 'react';
import { fetchUserInfo } from 'src/actions/user';
import { JWT_USER_INFO } from 'src/auth/context/jwt';

// ----------------------------------------------------------------------

const TourContactSchema = zod.object({
  fullName: zod.string().min(1, { message: 'Họ và tên là bắt buộc' }),
  email: zod.string().email({ message: 'Email không hợp lệ' }),
  phone: zod.string().min(1, { message: 'Số điện thoại là bắt buộc' }).regex(/^0\d{9}$/, { message: 'Số điện thoại không hợp lệ (Bắt buộc 10 số)' }),
  note: zod.string().optional(),
});

export type TourContactSchemaType = zod.infer<typeof TourContactSchema>;

// ----------------------------------------------------------------------
type Props = {
  onSetContactInfo: TourCheckoutContextValue['onSetContactInfo'];
  onChangeStep: (type: "next" | "go" | "back", step?: number | undefined) => void;
  savedInfo: IContactInfo | null;
};

export function AddressNewForm({ onSetContactInfo, onChangeStep, savedInfo }: Props) {
  const defaultValues: TourContactSchemaType = {
    fullName: savedInfo?.fullName || '',
    email: savedInfo?.email || '',
    phone: savedInfo?.phone || '',
    note: savedInfo?.note || '',
  };

  const userInfo = sessionStorage.getItem(JWT_USER_INFO);

  const methods = useForm<TourContactSchemaType>({
    mode: 'all',
    resolver: zodResolver(TourContactSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const loadUser = async () => {
      if (!userInfo || savedInfo) return;
      const parsedUserInfo = JSON.parse(userInfo);
      try {
        const res = await fetchUserInfo(parsedUserInfo.id);
        methods.setValue('fullName', res.username || '');
        methods.setValue('email', res.email || '');
        methods.setValue('phone', res.phone || '');
      } catch (err) {
        console.error('Không thể tải thông tin người dùng:', err);
      }
    };

    loadUser();
  }, [userInfo, methods]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const info: IContactInfo = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        note: data.note,
      };

      onSetContactInfo(info);
      onChangeStep('next');
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card>
        <Box pt={4} px={4}>
          <Typography variant='h5'>Thông tin liên hệ</Typography>
        </Box>
        <CardContent>
          <Stack spacing={3}>
            <Field.Text name="fullName" label="Họ và tên liên hệ" />
            <Field.Text name="email" label="Email" />
            <Field.Text name="phone" label="Số điện thoại" />
            <Field.Text name="note" label="Ghi chú" multiline rows={3} />
          </Stack>
        </CardContent>

        <CardActions sx={{ pb: 4, px: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            size="small"
            color="inherit"
            onClick={() => onChangeStep('back')}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            Quay lại
          </Button>
          <Button type="submit" variant="contained" loading={isSubmitting}>
            Lưu thông tin
          </Button>
        </CardActions>
      </Card>
    </Form>
  );
}