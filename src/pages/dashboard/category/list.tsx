import { CONFIG } from 'src/global-config';
import { CategoryListView } from 'src/sections/category/view/category-list-view';
// ----------------------------------------------------------------------

const metadata = { title: `Danh sách danh mục | Quản lý - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <CategoryListView />
        </>
    );
}
