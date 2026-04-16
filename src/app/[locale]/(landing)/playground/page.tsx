import { setRequestLocale } from 'next-intl/server';

import { DocumentPlayground } from '@/shared/blocks/playground/document-playground';

export default async function PlaygroundPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DocumentPlayground />;
}
