"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken, getUsers, createUser } from "@/services/api";

//components
import UserTable from "@/components/UserTable";
import Popup from "@/components/Popup";
import router from "next/router";

export default function UsersPage() {
    const router = useRouter();
    const [fetchData, setFetchData] = useState({});
    const [loading, setLoading] = useState(false);

    const refetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getUsers();
            const data = await response.json();

            if (!response.ok) {
                setFetchData({
                    error: data.message || "Failed to fetch users",
                });
                return;
            }

            setFetchData(data);
        } catch (err) {
            if (err instanceof Error) {
                setFetchData({ error: err.message });
            } else {
                setFetchData({ error: "An unknown error occurred" });
            }
        } finally {
            setLoading(false);
        }
    };

    //fetch users
    useEffect(() => {
        refetchUsers();
    }, []);

    //check if user is logged in
    useEffect(() => {
        const authToken = getAuthToken();
        if (!authToken) {
            router.push("/");
        }
    }, [router]);

    const [notification, setNotification] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    return (
        <div className=" flex flex-col items-center gap-4 justify-center">
            <h1 className="text-2xl font-bold my-4">Users</h1>
            <AddUserButton
                setNotification={setNotification}
                refetchUsers={refetchUsers}
            />
            <UserTable
                fetchData={fetchData}
                refetchUsers={refetchUsers}
                loading={loading}
            />

            {notification && (
                <Popup show={true} onClose={() => setNotification(null)}>
                    <div
                        className={`min-w-sm bg-white dark:bg-[#292a2d] text-black dark:text-white border border-gray-200 dark:border-none rounded-lg p-4 cursor-auto ${
                            notification.type === "success"
                                ? "border-green-500"
                                : "border-red-500"
                        }`}
                    >
                        <p
                            className={`text-lg ${
                                notification.type === "success"
                                    ? "text-green-500"
                                    : "text-red-500"
                            }`}
                        >
                            {notification.message}
                        </p>
                    </div>
                </Popup>
            )}
        </div>
    );
}

const AddUserButton = ({
    setNotification,
    refetchUsers,
}: {
    setNotification: (notification: {
        message: string;
        type: "success" | "error";
    }) => void;
    refetchUsers: () => Promise<void>;
}) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const auth_token = getAuthToken();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        const hasPermission =
            auth_token?.user?.permission?.includes("create_user") ?? false;
        setIsDisabled(!hasPermission);
    }, [auth_token]);

    const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload = {
            name,
            email,
            password,
            role,
        };
        try {
            const response = await createUser(payload);
            if (response.ok) {
                refetchUsers();
                setNotification({
                    message: "User added successfully",
                    type: "success",
                });
                setIsPopupOpen(false);
                setEmail("");
                setName("");
                setPassword("");
            } else {
                setNotification({
                    message: "Failed to add user",
                    type: "error",
                });
            }
        } catch (error) {
            setNotification({
                message: "An error occurred while adding user" + error,
                type: "error",
            });
        }
    };

    const logout = () => {
        localStorage.removeItem("auth_token");
        router.push("/");
    };

    return (
        <>
            <div className="flex gap-4">
                <button
                    disabled={isDisabled}
                    onClick={() => setIsPopupOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:hover:bg-blue-500 disabled:cursor-not-allowed"
                >
                    Add User
                </button>
                <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                >
                    Logout
                </button>
            </div>
            {isPopupOpen && (
                <Popup show={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
                    <div className="min-w-sm bg-white dark:bg-[#292a2d] text-black dark:text-white border border-gray-200 dark:border-none rounded-lg p-4 cursor-auto">
                        <h1 className="text-2xl font-bold">Add User</h1>
                        <form
                            onSubmit={handleAddUser}
                            className="flex flex-col gap-4 mt-4"
                        >
                            <div className="flex flex-col gap-2">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={name}
                                    required
                                    onChange={(e) => setName(e.target.value)}
                                    className="border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-[#21252b] text-black dark:text-white"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-[#21252b] text-black dark:text-white"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    required
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-[#21252b] text-black dark:text-white"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="role">Role</label>
                                <input
                                    type="text"
                                    id="role"
                                    name="role"
                                    value={role}
                                    required
                                    onChange={(e) => setRole(e.target.value)}
                                    className="border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-[#21252b] text-black dark:text-white"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-4"
                            >
                                Add User
                            </button>
                        </form>
                    </div>
                </Popup>
            )}
        </>
    );
};
