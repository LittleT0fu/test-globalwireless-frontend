"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Popup from "./Popup";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { login } from "@/services/api";
import DOMPurify from "dompurify";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isCooldown, setIsCooldown] = useState(false);
    const [cooldownTime, setCooldownTime] = useState(0);
    const [popup, setPopup] = useState({
        show: false,
        message: "",
        type: "",
        button: [
            {
                label: "ตกลง",
                onClick: () => {
                    closePopup();
                },
            },
        ],
    });
    const router = useRouter();

    const closePopup = () => {
        setPopup({
            show: false,
            message: "",
            type: "",
            button: [
                {
                    label: "ตกลง",
                    onClick: () => {
                        closePopup();
                    },
                },
            ],
        });
    };

    // handle login
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isCooldown) {
            setPopup({
                ...popup,
                show: true,
                message: `กรุณารอ ${cooldownTime} วินาที ก่อนที่จะลองเข้าสู่ระบบอีกครั้ง`,
                type: "error",
            });
            return;
        }

        console.log("กำลังเข้าสู่ระบบ...");
        try {
            if (!email && !password) {
                setPopup({
                    ...popup,
                    show: true,
                    message: "กรุณากรอกอีเมลและรหัสผ่าน",
                    type: "error",
                });
                return;
            }

            if (!email) {
                setPopup({
                    ...popup,
                    show: true,
                    message: "กรุณากรอกอีเมล",
                    type: "error",
                });
                return;
            }

            if (!password) {
                setPopup({
                    ...popup,
                    show: true,
                    message: "กรุณากรอกรหัสผ่าน",
                    type: "error",
                });
                return;
            }

            // sanitize input
            const sanitizedEmail = DOMPurify.sanitize(email);
            const sanitizedPassword = DOMPurify.sanitize(password);

            const response = await login(sanitizedEmail, sanitizedPassword);

            if (!response.ok) {
                const errorData = await response.json();
                // เริ่ม cooldown เมื่อ login ไม่สำเร็จ
                setIsCooldown(true);
                setCooldownTime(5);
                const cooldownInterval = setInterval(() => {
                    setCooldownTime((prev) => {
                        if (prev <= 1) {
                            clearInterval(cooldownInterval);
                            setIsCooldown(false);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);

                setPopup({
                    ...popup,
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
                ...popup,
                show: true,
                message: "เข้าสู่ระบบสำเร็จ",
                type: "success",
                button: [
                    {
                        label: "ตกลง",
                        onClick: () => {
                            router.push("/users");
                        },
                    },
                ],
            });

            //todo: redirect to user page
        } catch (error) {
            setPopup({
                ...popup,
                show: true,
                message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ " + error,
                type: "error",
            });
        }
    };

    return (
        <>
            {popup.show && (
                <Popup show={popup.show} onClose={() => closePopup()}>
                    <div className="text-center min-w-64 mx-4 text-black bg-white border border-gray-300 dark:bg-[#21252b] dark:text-white p-8 rounded-lg drop-shadow-lg">
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
                        {popup.button.map((button) => (
                            <button
                                key={button.label}
                                onClick={button.onClick}
                                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {button.label}
                            </button>
                        ))}
                    </div>
                </Popup>
            )}

            {/* container */}
            <div className="w-full max-w-md p-8 max-sm:p-4 border text-black border-gray-300  dark:bg-[#21252b] dark:text-white dark:border-none rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center  mb-6">Login</h1>
                {/* form */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* email */}
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

                    {/* password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium "
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:bg-[#282c34] rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? (
                                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <FaEye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    <hr className="my-8 border-gray-300 dark:border-gray-600" />
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Sign in
                    </button>
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account?{" "}
                            <a
                                href="/register"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Register
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </>
    );
}
