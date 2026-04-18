import { setRequestLocale } from 'next-intl/server';

import { DocumentPlayground } from '@/shared/blocks/playground/document-playground';
import { GtagConversion } from '@/shared/blocks/common/gtag-conversion';

export default async function PlaygroundPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <GtagConversion sendTo="AW-18094910694/MsfeCJiVzZ0cEObZqbRD" value={1.0} currency="USD" />
      <DocumentPlayground />
    </>
  );
}
