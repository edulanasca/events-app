import { Trans } from 'react-i18next/TransWithoutContext';
import { languages } from 'eventsapp/app/i18n/settings';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'eventsapp/app/i18n/client';

export default function LanguageSwitcher() {
    const { lng } = useParams();
    const { t } = useTranslation(lng as string, 'translation');
    const router = useRouter();
    const pathname = usePathname()

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLang = event.target.value;
        if (selectedLang) {
            const newPath = pathname.replace(`/${lng}`, `/${selectedLang}`);
            router.push(newPath);
        }
    };

    return (
        <div>
            <Trans i18nKey="languageSwitcher" t={t}>    
                Switch from {{ lng }} to:{' '}
            </Trans>
            <select onChange={handleChange} value="">
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