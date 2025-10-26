import { CONFIG } from "src/global-config";
import { TourFilteredView } from "src/sections/tour/view/tour-filtered-view";

const metadata = { title: `CanThoTravel - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>
            <TourFilteredView />
        </>
    );
}
