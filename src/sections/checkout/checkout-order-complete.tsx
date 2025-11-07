import type { PaperProps } from '@mui/material/Paper';
import type { DialogProps } from '@mui/material/Dialog';
import type { CheckoutContextValue } from 'src/types/checkout';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { OrderCompleteIllustration } from 'src/assets/illustrations';

import { Iconify } from 'src/components/iconify';
import { Dispatch, SetStateAction } from 'react';
import { Image } from 'src/components/image';
import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

type Props = DialogProps & {
  onDownloadPDF: () => void;
  tourCode: string;
  resetTourCode: Dispatch<SetStateAction<string>>;
};

export function CheckoutOrderComplete({ onDownloadPDF, tourCode, resetTourCode, slotProps, ...other }: Props) {
  const dialogPaperSx = (slotProps?.paper as PaperProps)?.sx;

  return (
    <Dialog
      fullWidth
      fullScreen
      slotProps={{
        ...slotProps,
        paper: {
          ...slotProps?.paper,
          sx: [
            {
              width: { md: `calc(100% - 48px)` },
              height: { md: `calc(100% - 48px)` },
            },
            ...(Array.isArray(dialogPaperSx) ? dialogPaperSx : [dialogPaperSx]),
          ],
        },
      }}
      {...other}
    >
      <Box
        sx={{
          py: 5,
          gap: 5,
          m: 'auto',
          maxWidth: 480,
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          px: { xs: 2, sm: 0 },
          flexDirection: 'column',
        }}
      >
        <Image src={`${CONFIG.assetsDir}/assets/illustrations/payment-success.png`} />
        <Typography variant="h4">Đặt tour thành công!</Typography>

        <Typography>
          Cảm ơn bạn đã đặt tour cùng chúng tôi.
          <br />
          <br />
          Mã tour đã đặt của bạn là:{' '}
          <Link>{tourCode}</Link>
          <br />
          <br />
          Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận và gửi thông tin chi tiết.
          <br />
          Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại hỗ trợ.
          <br />
          Trân trọng,
        </Typography>

        <Divider sx={{ width: 1, borderStyle: 'dashed' }} />

        <Box
          sx={{
            gap: 2,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Button
            size="large"
            variant="contained"
            startIcon={<Iconify icon="eva:cloud-download-fill" />}
            onClick={onDownloadPDF}
          >
            Xem hóa đơn (PDF)
          </Button>

          <Button
            size="large"
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="eva:arrow-back-fill" />}
            onClick={() => { window.location.href = '/'; resetTourCode('') }}
          >
            Quay về trang chủ
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
