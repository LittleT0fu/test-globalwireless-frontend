"use client";

import { useEffect } from "react";
import { useState } from "react";

//api
import { getAuthToken, getUsers, deleteUser, updateUser } from "@/services/api";

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
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const refetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getUsers();
            if (!response.ok) {
                throw new Error("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
            }

            const data = await response.json();
            setUsers(data.data);
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

    //fetch users
    useEffect(() => {
        refetchUsers();
    }, []);

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
                                    <th className={headerClassname} colSpan={2}>
                                        role
                                    </th>
                                    {/* เพิ่ม column ตามต้องการ */}
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-[#292a2d] divide-y divide-gray-200 dark:divide-gray-600 cursor-pointer ">
                                {users.map((user) => (
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
    console.log(authUser.permission);

    const handleEdit = () => {
        if (authUser.permission.includes("edit_user")) {
            setIsEdit(true);
        }
    };

    const handleDelete = async () => {
        console.log("delete", user.id);
        let response;
        if (!authUser.permission.includes("delete_user")) {
            return;
        }
        response = await deleteUser(user.id);
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

    const handleSave = async () => {
        await updateUser(editUser);
        togglePopup(false); // ปิด popup หลังจากบันทึก
        setIsEdit(false);
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
                {/* button section */}
                <hr className="border-t border-gray-300 dark:border-gray-600 my-2 w-full" />

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
        console.log("delete", user.id);
        let response;
        if (!authUser.permission.includes("delete_user")) {
            return;
        }
        response = await deleteUser(user.id);
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
            onClick={() => setIsDelete(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
            Delete
        </button>
    );
};
