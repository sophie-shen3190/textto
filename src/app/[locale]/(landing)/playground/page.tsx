import { setRequestLocale } from 'next-intl/server';

import { redirect } from '@/core/i18n/navigation';
import { DocumentPlayground } from '@/shared/blocks/playground/document-playground';
import { getSignUser } from '@/shared/models/user';

export default async function PlaygroundPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSignUser();
  if (!user) {
    redirect({ href: '/sign-in?callbackUrl=/playground', locale });
  }

  return <DocumentPlayground />;
}
