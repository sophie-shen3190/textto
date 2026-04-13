import { envConfigs } from '..';

export const localeNames: any = {
  en: 'English',
  // zh: '中文',
  // ja: '日本語',
  // ko: '한국어',
  // de: 'Deutsch',
  // fr: 'Français',
  // es: 'Español',
  // pt: 'Português',
  // it: 'Italiano',
  // nl: 'Nederlands',
  // ru: 'Русский',
  // ar: 'العربية',
};

// Uncomment each locale once its landing.json is translated
export const locales = ['en'];

export const defaultLocale = envConfigs.locale;

export const localePrefix = 'as-needed';

export const localeDetection = false;

export const localeMessagesRootPath = '@/config/locale/messages';

export const localeMessagesPaths = [
  'common',
  'landing',
  'showcases',
  'blog',
  'updates',
  'pricing',
  'settings/sidebar',
  'settings/profile',
  'settings/security',
  'settings/billing',
  'settings/payments',
  'settings/credits',
  'settings/apikeys',
  'admin/sidebar',
  'admin/users',
  'admin/roles',
  'admin/permissions',
  'admin/categories',
  'admin/posts',
  'admin/payments',
  'admin/subscriptions',
  'admin/credits',
  'admin/settings',
  'admin/apikeys',
  'admin/ai-tasks',
  'admin/chats',
  'ai/music',
  'ai/chat',
  'ai/image',
  'ai/video',
  'activity/sidebar',
  'activity/ai-tasks',
  'activity/chats',
  'pages/index',
  'pages/pricing',
  'pages/showcases',
  'pages/blog',
  'pages/updates',
];
