const API_URL = process.env.NEXT_PUBLIC_API_URL;
import Cookies from "js-cookie";

// ================================ CSRF ================================

// เพิ่มฟังก์ชันสำหรับสร้าง CSRF token
const generateCSRFToken = () => {
    return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
};

// เก็บ CSRF token ใน cookie
const setCSRFToken = () => {
    const token = generateCSRFToken();
    Cookies.set("csrf_token", token, {
        secure: true,
        sameSite: "strict",
    });
    return token;
};

// ดึง CSRF token จาก cookie หรือสร้างใหม่ถ้าไม่มี
const getCSRFToken = () => {
    let token = Cookies.get("csrf_token");
    if (!token) {
        // ถ้าไม่มี token ให้สร้างใหม่
        token = setCSRFToken();
    }
    return token;
};

// ================================ API ================================

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
    const csrfToken = setCSRFToken();
    return await fetch(`${API_URL}/users/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
        },
    });
};

export const getUsers = async () => {
    const { token } = getAuthToken();
    const csrfToken = getCSRFToken();
    return await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-CSRF-Token": csrfToken,
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
    const csrfToken = getCSRFToken();
    return await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify(payload),
    });
};

export const deleteUser = async (id: string) => {
    const { token } = getAuthToken();
    const csrfToken = getCSRFToken();
    return await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-CSRF-Token": csrfToken,
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
