import { getTranslations, setRequestLocale } from 'next-intl/server';

import { HeroSection } from '@/shared/blocks/landing/hero-section';
import { UseCasesSection } from '@/shared/blocks/landing/use-cases-section';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  metadataKey: 'landing.metadata',
  canonicalUrl: '/',
});

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('landing');
  const hero = t.raw('hero') as any;

  return (
    <>
      <HeroSection hero={hero} />
      <UseCasesSection />
    </>
  );
}
