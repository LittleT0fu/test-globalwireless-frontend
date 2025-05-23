"use client";

import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement login logic
        console.log("กำลังเข้าสู่ระบบ...");
        try {
            const response = await fetch("http://localhost:3001/users/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("การเข้าสู่ระบบล้มเหลว" + response.status);
            }

            const data = await response.json();
            console.log("เข้าสู่ระบบสำเร็จ:", data);
        } catch (error) {
            console.error("เกิดข้อผิดพลาด:", error);
        }
    };

    return (
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
    );
}
