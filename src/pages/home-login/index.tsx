import { CONFIG } from "src/global-config";
import { HomeLogin } from "src/sections/home-login/view/home-login";

export default function Page() {
    const metadata = { title: `Đăng nhập tài khoản - ${CONFIG.appName}` };

    return (
        <>
            <title>{metadata.title}</title>

            <HomeLogin />
        </>
    );
}
