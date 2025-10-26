import { useParams } from 'src/routes/hooks';

import { _tours } from 'src/_mock/_tour';
import { CONFIG } from 'src/global-config';

import { TourEditView } from 'src/sections/tour/view';
import { useGetTour } from 'src/actions/tour';

// ----------------------------------------------------------------------

const metadata = { title: `Tour edit | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();
  const { tour } = useGetTour(Number(id));
  return (
    <>
      <title>{metadata.title}</title>

      <TourEditView tour={tour} />
    </>
  );
}
