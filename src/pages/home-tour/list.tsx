import { CONFIG } from "src/global-config";
import { TourFilteredView } from "src/sections/tour/view/tour-filtered-view";

const metadata = { title: `Đặt tour ngay tại - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>
            <TourFilteredView />
        </>
    );
}
