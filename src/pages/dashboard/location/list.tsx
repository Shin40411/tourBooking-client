import { CONFIG } from 'src/global-config';
import { LocationListView } from 'src/sections/location/view';

// ----------------------------------------------------------------------

const metadata = { title: `Danh sách địa điểm | Quản lý - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <LocationListView />
        </>
    );
}
