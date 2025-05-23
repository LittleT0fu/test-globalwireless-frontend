"use client";

import { useEffect } from "react";
import { useState } from "react";

//api
import { getAuthToken, deleteUser, updateUser } from "@/services/api";

//components
import Popup from "@/components/Popup";

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    // เพิ่ม field อื่นๆ ตามต้องการ
}

interface UserTableProps {
    fetchData: {
        data?: User[] | null;
        error?: string | null;
        [key: string]: unknown; // รองรับข้อมูลอื่นๆ ที่อาจมีเพิ่มเติม
    };
    refetchUsers: () => void;
    loading: boolean;
}

export default function UserTable({
    fetchData,
    refetchUsers,
    loading,
}: UserTableProps) {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (fetchData.data) {
            setUsers(fetchData.data);
            setError("");
        } else if (fetchData.error) {
            setError(fetchData.error);
            setUsers([]);
        }
    }, [fetchData]);

    if (loading) {
        return <div className="text-center py-4">กำลังโหลด...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">{error}</div>;
    }

    const onUserChange = () => {
        refetchUsers();
    };

    const headerClassname =
        "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider";

    return (
        <div>
            {users.length === 0 ? (
                <div className="text-center py-4">ไม่พบข้อมูลผู้ใช้</div>
            ) : (
                <>
                    <div className="w-fit overflow-x-auto rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#292a2d] ">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-[#292a2d]">
                            <thead className=" bg-slate-300 dark:bg-slate-700">
                                <tr>
                                    <th className={headerClassname}>name</th>
                                    <th
                                        className={`${headerClassname} hidden xs:table-cell`}
                                    >
                                        email
                                    </th>
                                    <th className={headerClassname}>role</th>
                                    <th className={headerClassname}>
                                        <button
                                            onClick={refetchUsers}
                                            className=" hover:ring-blue-500 hover:ring-2 hover:ring-offset-4 rounded-md"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </th>
                                    {/* เพิ่ม column ตามต้องการ */}
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-[#292a2d] divide-y divide-gray-200 dark:divide-gray-600 cursor-pointer ">
                                {users.map((user: User) => (
                                    <RowTable
                                        key={user.id}
                                        user={user}
                                        onClick={() => setSelectedUser(user)}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {selectedUser && (
                        <UserPopup
                            isOpen={!!selectedUser}
                            user={selectedUser}
                            togglePopup={(open) =>
                                !open && setSelectedUser(null)
                            }
                            onUserChange={onUserChange}
                        />
                    )}
                </>
            )}
        </div>
    );
}

function RowTable({ user, onClick }: { user: User; onClick: () => void }) {
    const bodyClassname = "px-6 py-4 whitespace-nowrap";

    return (
        <tr
            key={user.id}
            className=" hover:bg-gray-100 dark:hover:bg-zinc-800"
            onClick={onClick}
        >
            <td className={bodyClassname}>{user.name}</td>
            <td className={`${bodyClassname} hidden xs:table-cell`}>
                {user.email}
            </td>
            <td className={bodyClassname}>{user.role}</td>
            <td className={bodyClassname}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
            </td>
            {/* เพิ่ม cell ตามต้องการ */}
        </tr>
    );
}

const UserPopup = ({
    isOpen,
    user,
    togglePopup,
    onUserChange,
}: {
    isOpen: boolean;
    user: User;
    togglePopup: (isOpen: boolean) => void;
    onUserChange: () => void;
}) => {
    const detailsClassname = "bg-gray-200 dark:bg-gray-600 rounded-md p-2";
    const [isEdit, setIsEdit] = useState(false);
    const [editUser, setEditUser] = useState(user);

    const { user: authUser } = getAuthToken();

    const handleEdit = () => {
        if (authUser.permission.includes("edit_user")) {
            setIsEdit(true);
        }
    };
    const handleSave = async () => {
        if (!editUser.name || !editUser.email) {
            return;
        }

        const response = await updateUser(editUser, user.id);
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData);
        }
        togglePopup(false); // ปิด popup หลังจากบันทึก
        setIsEdit(false);
        onUserChange();
    };

    const handleCancle = () => {
        setEditUser(user);
        setIsEdit(false);
    };

    return (
        <Popup show={isOpen} onClose={() => togglePopup(false)}>
            <div className="min-w-64 flex  flex-col gap-4 bg-white dark:bg-[#292a2d] text-black dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg p-4 cursor-auto">
                <div className="flex justify-between">
                    <h1 className="text-2xl font-bold">User Details</h1>
                    <button
                        onClick={() => togglePopup(false)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                    >
                        X
                    </button>
                </div>
                {/* details section */}
                <div className="flex flex-col gap-2">
                    <p>Name :</p>
                    {isEdit ? (
                        <input
                            type="text"
                            value={editUser.name}
                            className={detailsClassname}
                            required
                            onChange={(e) =>
                                setEditUser({
                                    ...editUser,
                                    name: e.target.value,
                                })
                            }
                        />
                    ) : (
                        <p className={detailsClassname}>{user.name}</p>
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <p>Email :</p>
                    {isEdit ? (
                        <input
                            type="email"
                            value={editUser.email}
                            className={detailsClassname}
                            required
                            onChange={(e) =>
                                setEditUser({
                                    ...editUser,
                                    email: e.target.value,
                                })
                            }
                        />
                    ) : (
                        <p className={detailsClassname}>{user.email}</p>
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <p>Role :</p>
                    {isEdit ? (
                        <input
                            type="text"
                            value={editUser.role}
                            className={detailsClassname}
                            required
                            onChange={(e) =>
                                setEditUser({
                                    ...editUser,
                                    role: e.target.value,
                                })
                            }
                        />
                    ) : (
                        <p className={detailsClassname}>{user.role}</p>
                    )}
                </div>
                {/* button section */}
                <hr className="border-t border-gray-300 dark:border-gray-600 my-2 w-full" />

                {isEdit ? (
                    <>
                        <button
                            onClick={() => handleSave()}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => handleCancle()}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                        >
                            Cancle
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            disabled={
                                !authUser.permission.includes("edit_user")
                            }
                            onClick={handleEdit}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:hover:bg-blue-500 disabled:cursor-not-allowed"
                        >
                            Edit
                        </button>
                        <DeletePopup
                            user={user}
                            onUserChange={onUserChange}
                            togglePopup={togglePopup}
                        />
                    </>
                )}
            </div>
        </Popup>
    );
};

const DeletePopup = ({
    user,
    onUserChange,
    togglePopup,
}: {
    user: User;
    onUserChange: () => void;
    togglePopup: (isOpen: boolean) => void;
}) => {
    const [isDelete, setIsDelete] = useState(false);
    const { user: authUser } = getAuthToken();

    const handleDelete = async () => {
        if (!authUser.permission.includes("delete_user")) {
            return;
        }
        const response = await deleteUser(user.id);
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData);
        }

        const data = await response?.json();
        console.log(data);
        // ลบผู้ใช้ที่มี id ตรงกันออกจากรายการ
        onUserChange();
        togglePopup(false); // ปิด popup หลังจากลบ
    };

    return isDelete ? (
        <div className="flex flex-col justify-center items-center text-center gap-2 bg-gray-200 dark:bg-gray-600 rounded-md p-2">
            Are you sure? <br /> you want to delete this user?
            <div className="flex gap-2">
                <button
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                >
                    Yes
                </button>
                <button
                    onClick={() => setIsDelete(false)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                >
                    No
                </button>
            </div>
        </div>
    ) : (
        <button
            disabled={!authUser.permission.includes("delete_user")}
            onClick={() => setIsDelete(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:hover:bg-red-500 disabled:cursor-not-allowed"
        >
            Delete
        </button>
    );
};
