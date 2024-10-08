import { useTranslation } from "eventsapp/app/i18n/client";
import { useUser } from "eventsapp/context/UserProvider";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserMenu() {
    const router = useRouter();
    const { user, loading, error: userError, refetch } = useUser();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { lng } = useParams();
    const { t } = useTranslation(lng as string, 'translation');

    useEffect(() => {
        refetch();
    }, [refetch])

    useEffect(() => {
        if (userError) {
            setError(t('errors.failedToLoadUser'));
        }
    }, [userError, t]);

    async function auth(type: "register" | "login") {
        router.push(`/auth/${type}`);
    }

    const handleLogout = async () => {
        setIsLoggingOut(true);
        setMenuOpen(false); // Close the menu
        try {
            localStorage.removeItem('token');
            refetch();
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
            setError(t('errors.logoutFailed'));
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div>
            {loading ? (
                <p>{t('events.loading')}</p>
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
                            <p>{t('userMenu.hi')}, {user.name}</p>
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
                                            {t('auth.loggingOut')}
                                        </span>
                                    ) : t('auth.logout')
                                }
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <button
                        onClick={() => auth("login")}
                        className="border-2 border-white py-2 px-4 rounded-full transition duration-300 mr-4"
                    >
                        {t('auth.login')}
                    </button>
                    <button
                        onClick={() => auth("register")}
                        className="bg-[#FF416C] text-white py-2 px-4 rounded-full hover:bg-[#FF4B2B] transition duration-300"
                    >
                        {t('auth.register')}
                    </button>
                </div>
            )}
            {error && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-lg">
                        <p>{error}</p>
                        <button onClick={() => setError(null)} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                            {t('common.close')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}