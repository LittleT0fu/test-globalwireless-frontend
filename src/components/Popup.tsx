import React, { useEffect } from "react";

interface PopupProps {
    show: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

function Popup({ show, onClose, children }: PopupProps) {
    // ป้องกันการ scroll เมื่อ popup แสดง
    useEffect(() => {
        if (show) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [show]);

    if (!show) return null;

    return (
        <div className="fixed z-50 inset-0 flex items-center justify-center rounded-lg shadow-lg text-black">
            {/* Dark Overlay */}
            <div
                className="absolute inset-0 bg-white/20  backdrop-blur-md"
                onClick={onClose}
            />

            {/* Popup Content */}
            <div className="relative">{children}</div>
        </div>
    );
}

export default Popup;
