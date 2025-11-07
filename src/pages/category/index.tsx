import { useNavigate } from "react-router";
import { CONFIG } from "src/global-config";
import { useParams } from "src/routes/hooks";
import { paths } from "src/routes/paths";
import { CategoryShopView } from "src/sections/category/view/category-shop-view";

export default function Page() {
    const metadata = { title: `Danh mục - ${CONFIG.appName}` };
    const { id = '' } = useParams();
    const navigate = useNavigate();
    if (!id) {
        navigate(paths.page404);
        return;
    }

    return (
        <>
            <title>{metadata.title}</title>

            <CategoryShopView id={Number(id)} />
        </>
    );
}
