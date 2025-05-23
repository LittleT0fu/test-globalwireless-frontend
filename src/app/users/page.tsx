"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/services/api";

//components
import UserTable from "@/components/UserTable";

export default function UsersPage() {
    const router = useRouter();

    //check if user is logged in
    useEffect(() => {
        const authToken = getAuthToken();
        if (!authToken) {
            router.push("/");
        }
    }, [router]);

    return (
        <div className=" flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold my-4">Users</h1>
            <UserTable />
        </div>
    );
}
