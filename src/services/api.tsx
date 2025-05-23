const API_URL = process.env.NEXT_PUBLIC_API_URL;
import Cookies from "js-cookie";

export const getAuthToken = () => {
    const authCookie = Cookies.get("auth_token");
    if (!authCookie) return null;
    try {
        return JSON.parse(authCookie);
    } catch (error) {
        console.error("ไม่สามารถแปลงค่า auth_token ได้:", error);
        return null;
    }
};

export const login = async (email: string, password: string) => {
    return await fetch(`${API_URL}/users/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
            "Content-Type": "application/json",
        },
    });
};

export const getUsers = async () => {
    const { token } = getAuthToken();
    return await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
};

export const createUser = async (payload: {
    name: string;
    email: string;
    password: string;
    role: string;
}) => {
    const { token } = getAuthToken();
    return await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
};

export const deleteUser = async (id: string) => {
    const { token } = getAuthToken();
    return await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
};

export const updateUser = async (
    payload: {
        name: string;
        email: string;
        role: string;
    },
    id: string
) => {
    const { token } = getAuthToken();
    return await fetch(`${API_URL}/users/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
};

export const register = async (payload: {
    name: string;
    email: string;
    password: string;
}) => {
    return await fetch(`${API_URL}/users/register`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json",
        },
    });
};
