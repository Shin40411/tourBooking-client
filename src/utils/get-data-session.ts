import { JWT_USER_INFO } from "src/auth/context/jwt";

export function getUserInfoFromSession() {
    try {
        const raw = sessionStorage.getItem(JWT_USER_INFO);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}
