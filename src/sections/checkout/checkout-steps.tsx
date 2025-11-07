import type { StepperProps } from '@mui/material/Stepper';

import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Stepper from '@mui/material/Stepper';
import { styled } from '@mui/material/styles';
import StepLabel, { stepLabelClasses } from '@mui/material/StepLabel';
import MuiStepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

import { Iconify } from 'src/components/iconify';
import { TourCheckoutContextValue } from 'src/types/booking';

// ----------------------------------------------------------------------

type Props = StepperProps & {
  steps: TourCheckoutContextValue['steps'];
  activeStep: TourCheckoutContextValue['activeStep'];
};

export function CheckoutSteps({ steps, activeStep, sx, ...other }: Props) {
  return (
    <Stepper
      alternativeLabel
      activeStep={activeStep ?? 0}
      connector={<StepConnector />}
      sx={[{ mb: { xs: 3, md: 5 } }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      {steps.map((label, index) => (
        <Step key={label}>
          <StepLabel
            StepIconComponent={(props) => (
              <StepIcon {...props} stepIndex={index} label={label} />
            )}
            sx={{
              [`& .${stepLabelClasses.label}`]: {
                fontWeight: 'fontWeightSemiBold',
                textTransform: 'capitalize',
              },
            }}
          >
            {label === 'Tour'
              ? 'Xác nhận thông tin'
              : label === 'Contact info'
                ? 'Thông tin liên hệ'
                : 'Thanh toán'}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}

// -----------------------------
const StepConnector = styled(MuiStepConnector)(({ theme }) => ({
  top: 10,
  left: 'calc(-50% + 20px)',
  right: 'calc(50% + 20px)',
  [`& .${stepConnectorClasses.line}`]: {
    borderTopWidth: 2,
    borderColor: theme.vars.palette.divider,
  },
  [`&.${stepConnectorClasses.active}, &.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: { borderColor: theme.vars.palette.primary.main },
  },
}));

// -----------------------------
type StepIconProps = {
  active?: boolean;
  completed?: boolean;
  stepIndex: number;
  label: string;
};

function StepIcon({ active, completed, stepIndex }: StepIconProps) {
  const icons: Record<number, string> = {
    0: 'ri:contract-line',
    1: 'solar:user-bold',
    2: 'solar:card-bold',
  };
  const icon = icons[stepIndex] ?? 'solar:check-circle-bold';
  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        bgcolor: completed ? 'primary.main' : active ? 'primary.lighter' : 'action.hover',
        color: completed ? 'common.white' : active ? 'primary.main' : 'text.disabled',
        transition: 'all 0.3s',
      }}
    >
      <Iconify icon={completed ? 'eva:checkmark-fill' : icon} width={20} />
    </Box>
  );
}