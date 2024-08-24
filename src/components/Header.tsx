import { useParams, useRouter } from "next/navigation";
import UserMenu from "./UserMenu";
import { useTranslation } from "eventsapp/app/i18n/client";
import { useUser } from "eventsapp/context/UserProvider";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
    const router = useRouter();
    const { lng } = useParams();
    const { t } = useTranslation(lng as string, 'translation');
    const { user } = useUser();

    return (
        <header className="w-full flex flex-col md:flex-row justify-between items-center mb-8 p-4 md:p-0">
            <button className="text-3xl font-bold mb-4 md:mb-0" onClick={() => router.push("/")}>
                {t('header.title')}
            </button>
            <div className="flex flex-col md:flex-row items-center gap-4">
                {user && (
                    <>
                        <button
                            onClick={() => router.push(`/${lng}/event/my-events`)}
                            className="border-2 border-white py-2 px-4 rounded-full hover:bg-white hover:text-[#FF416C] transition duration-300 mr-4"
                        >
                            {t('header.myEvents')}
                        </button>
                        <button
                            onClick={() => router.push(`/${lng}/event/create`)}
                            className="border-2 border-white py-2 px-4 rounded-full hover:bg-white hover:text-[#FF416C] transition duration-300 mr-4"
                        >
                            {t('header.createEvent')}
                        </button>
                    </>
                )}
                <LanguageSwitcher />
            </div>
            <UserMenu />
        </header>
    );
}