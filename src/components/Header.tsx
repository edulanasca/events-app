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
        <header className="w-full flex justify-between items-center mb-8">
            <button className="text-3xl font-bold" onClick={() => router.push("/")}>
                {t('header.title')}
            </button>
            <div className="flex items-center gap-4">
                {user && (
                    <>
                        <button onClick={() => router.push(`/${lng}/event/my-events`)}>{t('header.myEvents')}</button>
                        <button onClick={() => router.push(`/${lng}/event/create`)}>{t('header.createEvent')}</button>
                    </>
                )}
                <LanguageSwitcher />
            </div>
            <UserMenu />
        </header>
    );
}