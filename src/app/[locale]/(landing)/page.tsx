import { setRequestLocale } from 'next-intl/server';

import { HeroSection } from '@/shared/blocks/landing/hero-section';
import { UseCasesSection } from '@/shared/blocks/landing/use-cases-section';

export const revalidate = 3600;

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <UseCasesSection />
    </>
  );
}
