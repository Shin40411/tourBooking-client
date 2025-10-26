import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export function ContactForm({ sx, ...other }: BoxProps) {
  return (
    <Box sx={sx} {...other}>
      <Typography variant="h3">
        Hãy liên hệ với chúng tôi <br />
        Chúng tôi luôn sẵn lòng lắng nghe và hỗ trợ bạn!
      </Typography>

      <Box
        sx={{
          my: 5,
          gap: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TextField fullWidth label="Họ và tên" />
        <TextField fullWidth label="Email" />
        <TextField fullWidth label="Chủ đề" />
        <TextField
          fullWidth
          label="Nhập nội dung tin nhắn của bạn..."
          multiline
          rows={4}
        />
      </Box>

      <Button size="large" variant="contained">
        Gửi liên hệ
      </Button>
    </Box>
  );
}
