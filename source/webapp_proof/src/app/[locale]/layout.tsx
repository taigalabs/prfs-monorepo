import { useLocale } from "next-intl";
import { notFound } from "next/navigation";

const locales = ["en", "de"];

const LocaleLayout = ({ children, params: { locale } }: any) => {
  // Validate that the incoming `locale` parameter is valid
  const isValidLocale = locales.some(cur => cur === locale);
  if (!isValidLocale) notFound();

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
};

export default LocaleLayout;
