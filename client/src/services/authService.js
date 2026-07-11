import { loginUser as loginApi } from "../api/login.js";
import { setAuthToken, setAuthUser, setCurrentUser, setIsAdmin } from "./config.js";

export const login = async (email, password) => {
    const data = await loginApi(email, password);

    setAuthToken(data.token);
    setAuthUser(data.user);
    setCurrentUser(data.user);

    if (data.user.role === "admin") {
        setIsAdmin(true);
    }

    localStorage.setItem("authToken", data.token);
    localStorage.setItem("authUser", JSON.stringify(data.user));

    return data.user;
};
