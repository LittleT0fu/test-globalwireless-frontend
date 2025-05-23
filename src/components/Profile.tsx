import React from "react";

interface ProfileProps {
    name?: string;
    email?: string;
    avatar?: string;
}

const Profile: React.FC<ProfileProps> = ({
    name = "ผู้ใช้",
    email = "user@example.com",
    avatar = "https://via.placeholder.com/150",
}) => {
    return (
        <div className="bg-white dark:bg-[#21252b] p-6 rounded-lg shadow-md">
            <div className="flex flex-col items-center">
                <img
                    src={avatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-full mb-4 object-cover"
                />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">{email}</p>
            </div>
        </div>
    );
};

export default Profile;
