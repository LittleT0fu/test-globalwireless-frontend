"use client";

import { useEffect } from "react";
import { useState } from "react";

//api
import { getUsers, deleteUser, updateUser } from "@/services/api";

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
    // เพิ่ม props ตามต้องการในอนาคต
}

export default function UserTable({}: UserTableProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    //fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getUsers();
                if (!response.ok) {
                    throw new Error("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
                }

                const data = await response.json();
                setUsers(data.data);
                console.log(data.data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <div className="text-center py-4">กำลังโหลด...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">{error}</div>;
    }

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
                                    <th className={headerClassname} colSpan={2}>
                                        role
                                    </th>
                                    {/* เพิ่ม column ตามต้องการ */}
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-[#292a2d] divide-y divide-gray-200 dark:divide-gray-600 cursor-pointer ">
                                {users.map((user) => (
                                    <RowTable key={user.id} user={user} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

function RowTable({ user }: { user: User }) {
    const bodyClassname = "px-6 py-4 whitespace-nowrap";
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [editUser, setEditUser] = useState(user);

    const handleEdit = () => {
        setIsEdit(true);
    };

    const handleDelete = () => {
        deleteUser(user.id);
    };

    const handleSave = () => {
        updateUser(editUser);
        setIsEdit(false);
    };

    const handleCancle = () => {
        setEditUser(user);
        setIsEdit(false);
    };

    const detailsClassname = "bg-gray-200 dark:bg-gray-700 rounded-md p-2";

    return (
        <>
            {isOpen && (
                <Popup show={isOpen} onClose={() => setIsOpen(false)}>
                    <div className="min-w-64 flex  flex-col gap-4 bg-white dark:bg-[#292a2d] text-black dark:text-white rounded-lg p-4 cursor-auto">
                        <h1 className="text-2xl font-bold">User Details</h1>
                        <div className="flex flex-col gap-2">
                            <p>Name :</p>
                            {isEdit ? (
                                <input
                                    type="text"
                                    value={editUser.name}
                                    className={detailsClassname}
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
                                    type="text"
                                    value={editUser.email}
                                    className={detailsClassname}
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
                        {isEdit ? (
                            <>
                                <button
                                    onClick={() => setIsEdit(false)}
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setIsEdit(false)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                                >
                                    Cancle
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleEdit}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </Popup>
            )}
            <tr
                key={user.id}
                className=" hover:bg-gray-100 dark:hover:bg-zinc-800"
                onClick={() => setIsOpen(true)}
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
        </>
    );
}
