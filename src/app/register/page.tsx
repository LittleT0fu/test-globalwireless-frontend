"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Popup from "@/components/Popup";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { register } from "@/services/api";
import DOMPurify from "dompurify";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setPopup({
                show: true,
                message: "Password and Confirm Password do not match",
                type: "error",
                button: [
                    {
                        label: "ตกลง",
                        onClick: () => {
                            closePopup();
                        },
                    },
                ],
            });
            return;
        }

        // sanitize input
        const sanitizedName = DOMPurify.sanitize(name);
        const sanitizedEmail = DOMPurify.sanitize(email);
        const sanitizedPassword = DOMPurify.sanitize(password);

        const payload = {
            name: sanitizedName,
            email: sanitizedEmail,
            password: sanitizedPassword,
        };

        try {
            const response = await register(payload);
            if (response.ok) {
                setPopup({
                    show: true,
                    message: "Register successfully",
                    type: "success",
                    button: [
                        {
                            label: "ตกลง",
                            onClick: () => {
                                closePopup();
                                // redirect to login page
                                router.push("/");
                            },
                        },
                    ],
                });
            } else {
                const data = await response.json();
                setPopup({
                    show: true,
                    message: data.message || "Failed to register",
                    type: "error",
                    button: [
                        {
                            label: "ตกลง",
                            onClick: () => {
                                closePopup();
                            },
                        },
                    ],
                });
            }
        } catch (error) {
            console.error(error);
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
            <div className="flex min-h-screen flex-col items-center justify-center p-6">
                <div className="w-full max-w-md p-8 max-sm:p-4 border text-black border-gray-300  dark:bg-[#21252b] dark:text-white dark:border-none rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-6 text-center">
                        Register
                    </h1>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium"
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:bg-[#282c34] rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="กรอกชื่อของคุณ"
                            />
                        </div>

                        {/* email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:bg-[#282c34] rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="กรอกอีเมลของคุณ"
                            />
                        </div>

                        {/* password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:bg-[#282c34] rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="กรอกรหัสผ่านของคุณ"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
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

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium"
                            >
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:bg-[#282c34] rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="กรอกรหัสผ่านของคุณ"
                                />
                            </div>
                        </div>

                        <hr className="my-8  border-gray-300 dark:border-gray-600" />

                        {/* button */}
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Register
                        </button>

                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Have an account?{" "}
                                <a
                                    href="/login"
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    Login
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
