import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "eventsapp/context/UserProvider";

export default function Header() {
    const router = useRouter();
    const { user, loading } = useUser();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    async function auth(type: "register" | "login") {
        router.push(`/auth/${type}`);
    }

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const response = await fetch('/api/auth/logout', { method: 'POST' });
            if (!response.ok) {
                throw new Error('Logout failed');
            }

            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <header className="w-full flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Events App</h1>
            {loading ? (
                <p>Loading...</p>
            ) : user ? (
                <div className="relative">
                    <button
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <div className="mr-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray">🐳</div>
                        </div>
                        <div>
                            <p>{user.name}</p>
                        </div>
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                {
                                    isLoggingOut ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Logging out...
                                        </span>
                                    ) : 'Logout'
                                }
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <button onClick={() => auth("login")} className="mr-4">
                        Login
                    </button>
                    <button onClick={() => auth("register")}>Register</button>
                </div>
            )}
        </header>
    );
}