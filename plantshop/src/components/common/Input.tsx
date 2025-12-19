// src/components/Input.tsx
import React, { useState } from "react";

export const Input: React.FC = () => {
    const [user, setUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/user");
            if (!res.ok) throw new Error("Network response was not ok");
            const data = await res.json();
            setUser(data.name);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2 p-4 border rounded shadow max-w-sm">
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={fetchUser}
                disabled={loading}
            >
                {loading ? "Loading..." : "Lấy User"}
            </button>

            {user && <div className="text-green-700">Tên User: {user}</div>}
            {error && <div className="text-red-700">Lỗi: {error}</div>}
        </div>
    );
};
