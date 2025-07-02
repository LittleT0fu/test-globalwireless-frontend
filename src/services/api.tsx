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

// ================================ ERROR HANDLING ================================

// ฟังก์ชันสำหรับจัดการ connection errors
const handleConnectionError = (error: any) => {
    console.error("Connection error:", error);

    // จัดการ ERR_CONNECTION_REFUSED
    if (
        error.message?.includes("ERR_CONNECTION_REFUSED") ||
        error.message?.includes("fetch") ||
        error.message?.includes("Failed to fetch")
    ) {
        return {
            ok: false,
            status: 0,
            statusText: "CONNECTION_REFUSED",
            json: async () => ({
                message:
                    "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบว่าเซิร์ฟเวอร์กำลังทำงานอยู่",
                error: "CONNECTION_REFUSED",
            }),
        };
    }

    // จัดการ network errors อื่นๆ
    if (error.name === "TypeError") {
        return {
            ok: false,
            status: 0,
            statusText: "NETWORK_ERROR",
            json: async () => ({
                message:
                    "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต",
                error: "NETWORK_ERROR",
            }),
        };
    }

    return {
        ok: false,
        status: 0,
        statusText: "UNKNOWN_ERROR",
        json: async () => ({
            message: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ กรุณาลองใหม่อีกครั้ง",
            error: "UNKNOWN_ERROR",
        }),
    };
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
    try {
        return await fetch(`${API_URL}/users/login`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfToken,
            },
        });
    } catch (error) {
        return handleConnectionError(error);
    }
};

export const getUsers = async () => {
    const { token } = getAuthToken();
    const csrfToken = getCSRFToken();
    try {
        return await fetch(`${API_URL}/users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "X-CSRF-Token": csrfToken,
            },
        });
    } catch (error) {
        return handleConnectionError(error);
    }
};

export const createUser = async (payload: {
    name: string;
    email: string;
    password: string;
    role: string;
}) => {
    const { token } = getAuthToken();
    const csrfToken = getCSRFToken();
    try {
        return await fetch(`${API_URL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "X-CSRF-Token": csrfToken,
            },
            body: JSON.stringify(payload),
        });
    } catch (error) {
        return handleConnectionError(error);
    }
};

export const deleteUser = async (id: string) => {
    const { token } = getAuthToken();
    const csrfToken = getCSRFToken();
    try {
        return await fetch(`${API_URL}/users/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "X-CSRF-Token": csrfToken,
            },
        });
    } catch (error) {
        return handleConnectionError(error);
    }
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
    try {
        return await fetch(`${API_URL}/users/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
    } catch (error) {
        return handleConnectionError(error);
    }
};

export const register = async (payload: {
    name: string;
    email: string;
    password: string;
}) => {
    try {
        return await fetch(`${API_URL}/users/register`, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        return handleConnectionError(error);
    }
};
