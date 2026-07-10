import { loginUser as loginApi } from "../api/login.js";
import { setAuthToken, setAuthUser, setCurrentUser } from "./config.js";

export const login = async (email) => {
    const data = await loginApi(email);

    setAuthToken(data.token);
    setAuthUser(data.user);
    setCurrentUser(data.user);

    localStorage.setItem("authToken", data.token);
    localStorage.setItem("authUser", JSON.stringify(data.user));

    return data.user;
};
