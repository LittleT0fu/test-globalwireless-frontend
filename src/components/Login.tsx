"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Popup from "./Popup";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [popup, setPopup] = useState({ show: false, message: "", type: "" });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement login logic
        console.log("กำลังเข้าสู่ระบบ...");
        try {
            if (!email && !password) {
                setPopup({
                    show: true,
                    message: "กรุณากรอกอีเมลและรหัสผ่าน",
                    type: "error",
                });
                return;
            }

            if (!email) {
                setPopup({
                    show: true,
                    message: "กรุณากรอกอีเมล",
                    type: "error",
                });
                return;
            }

            if (!password) {
                setPopup({
                    show: true,
                    message: "กรุณากรอกรหัสผ่าน",
                    type: "error",
                });
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
                {
                    method: "POST",
                    body: JSON.stringify({ email, password }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                setPopup({
                    show: true,
                    message:
                        errorData.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
                    type: "error",
                });
                return;
            }

            const data = await response.json();

            const userData = {
                token: data.token,
                user: data.user,
            };

            // เก็บ token ใน HTTP-only cookie
            Cookies.set("auth_token", JSON.stringify(userData), {
                secure: true, // ใช้ HTTPS เท่านั้น
                sameSite: "strict", // ป้องกัน CSRF
                expires: 7, // หมดอายุใน 7 วัน
            });

            setPopup({
                show: true,
                message: "เข้าสู่ระบบสำเร็จ",
                type: "success",
            });

            // ซ่อน popup หลังจาก 3 วินาที
            setTimeout(() => {
                setPopup({ show: false, message: "", type: "" });

                //todo: redirect to user page
            }, 3000);
        } catch (error) {
            setPopup({
                show: true,
                message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" + error,
                type: "error",
            });
            // setTimeout(
            //     () => setPopup({ show: false, message: "", type: "" }),
            //     3000
            // );
        }
    };

    return (
        <>
            {popup.show && (
                <Popup
                    show={popup.show}
                    onClose={() =>
                        setPopup({ show: false, message: "", type: "" })
                    }
                >
                    <div className="text-center min-w-64 mx-4 text-black bg-white dark:bg-[#21252b] dark:text-white p-8 rounded-lg">
                        {popup.type === "success" ? (
                            <svg
                                className="mx-auto h-12 w-12 text-green-500 mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="mx-auto h-12 w-12 text-red-500 mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        )}
                        <p className="">{popup.message}</p>
                        <button
                            onClick={() =>
                                setPopup({ show: false, message: "", type: "" })
                            }
                            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            ตกลง
                        </button>
                    </div>
                </Popup>
            )}

            <div className="w-full max-w-md p-8 max-sm:p-4 border text-black border-gray-300 dark:bg-[#21252b] dark:text-white dark:border-none rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center  mb-6">Login</h1>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium "
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:bg-[#282c34] rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium "
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:bg-[#282c34] rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </>
    );
}
