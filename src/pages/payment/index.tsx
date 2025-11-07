import { CONFIG } from 'src/global-config';
import { CheckoutView } from 'src/sections/checkout/view';
// ----------------------------------------------------------------------

const metadata = { title: `Đặt tour - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <CheckoutView />
    </>
  );
}
