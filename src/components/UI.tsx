// src/components/UI.tsx
import React from 'react';

export const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 ${className}`}>
        {children}
    </div>
);

export const Button = ({ onClick, children, variant = "primary", disabled = false }: any) => {
    const baseStyle = "px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2";
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
        secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
        success: "bg-green-600 text-white hover:bg-green-700"
    };
    return (
        <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant as keyof typeof variants]}`}>
            {children}
        </button>
    );
};