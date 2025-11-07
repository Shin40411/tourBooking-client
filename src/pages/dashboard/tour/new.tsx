import { CONFIG } from 'src/global-config';

import { TourCreateView } from 'src/sections/tour/view';

// ----------------------------------------------------------------------

const metadata = { title: `Tạo mới tour | Quản lý - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <TourCreateView />
    </>
  );
}
