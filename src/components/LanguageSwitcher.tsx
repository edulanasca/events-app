import { Trans } from 'react-i18next/TransWithoutContext';
import { languages } from 'eventsapp/app/i18n/settings';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'eventsapp/app/i18n/client';

export default function LanguageSwitcher() {
    const { lng } = useParams();
    const { t } = useTranslation(lng as string, 'translation');
    const router = useRouter();
    const pathname = usePathname();

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLang = event.target.value;
        if (selectedLang) {
            const newPath = pathname.replace(`/${lng}`, `/${selectedLang}`);
            router.push(newPath);
        }
    };

    return (
        <div className="flex flex-col items-center p-4 rounded-lg shadow-md max-w-xs mx-auto">
            <label className="mb-2 text-lg text-white-700">
                <Trans i18nKey="languageSwitcher" t={t}>    
                    Switch from {{ lng }} to:{' '}
                </Trans>
            </label>
            <select 
                className="p-2 text-lg border border-gray-300 rounded-md w-full max-w-xs bg-gray-700" 
                onChange={handleChange} 
                value=""
            >
                <option value="" disabled>{t('language')}</option>
                {languages.filter((l) => lng !== l).map((l) => (
                    <option key={l} value={l}>
                        {l}
                    </option>
                ))}
            </select>
        </div>
    );
}