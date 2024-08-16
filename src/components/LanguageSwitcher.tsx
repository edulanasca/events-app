import { useRouter } from 'next/router';
import Link from 'next/link';

export default function LanguageSwitcher() {
    const router = useRouter();
    const { locales, locale: activeLocale } = router;

    return (
        <div>
            {locales?.map((locale) => (
                <Link key={locale} href={router.asPath} locale={locale}>
                    <a style={{ marginRight: 10, color: locale === activeLocale ? 'red' : 'black' }}>
                        {locale}
                    </a>
                </Link>
            ))}
        </div>
    );
}
