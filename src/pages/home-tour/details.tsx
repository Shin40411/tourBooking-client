import { useParams } from "react-router";
import { useGetTour } from "src/actions/tour";
import { CONFIG } from "src/global-config";
import { TourShopDetailsView } from "src/sections/tour/view/tour-shop-details-view";

export default function Page() {
    const { id = '' } = useParams();
    const { tour, tourError, tourLoading } = useGetTour(Number(id));
    const metadata = { title: `Đặt tour ${tour?.title} - ${CONFIG.appName}` };

    return (
        <>
            <title>{metadata.title}</title>
            <TourShopDetailsView tour={tour} error={tourError} loading={tourLoading} />
        </>
    );
}
