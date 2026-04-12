/**
 * Google Translate utility for VLM description fields.
 * Only translates text that contains Chinese characters.
 */

const HAS_CHINESE = /[\u4e00-\u9fff]/;
const DESCRIPTION_RE = /<description>([\s\S]*?)<\/description>/gi;
const TEXT_TAG_RE    = /<text>([\s\S]*?)<\/text>/gi;

async function googleTranslate(text: string): Promise<string> {
  const key = process.env.GOOGLE_TRANSLATE_API_KEY ?? '';
  if (!key) return text;
  try {
    const resp = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text, target: 'en', format: 'text' }),
      }
    );
    const json = await resp.json();
    return json?.data?.translations?.[0]?.translatedText ?? text;
  } catch {
    return text;
  }
}

/**
 * Process VLM markdown:
 * - <description>中文</description>  →  *[Image: English translation]*
 * - <description>English</description>  →  *[Image: English]*
 * - <text>content</text>  →  content  (unwrap, keep text)
 *
 * Call this BEFORE normalise() so cleanMarkdown() doesn't strip the tags first.
 */
export async function processVlmDescriptions(md: string): Promise<string> {
  if (!md) return md;

  // Collect description matches (matchAll returns iterator — collect to array for async loop)
  const descMatches = [...md.matchAll(DESCRIPTION_RE)];

  let result = md;
  for (const match of descMatches) {
    const content = match[1].trim();
    let replacement = '';
    if (content) {
      const translated = HAS_CHINESE.test(content)
        ? await googleTranslate(content)
        : content;
      replacement = `*[Image: ${translated}]*`;
    }
    // Replace only the first occurrence to avoid double-replacing identical blocks
    result = result.replace(match[0], replacement);
  }

  // Unwrap <text> tags — keep inner content
  result = result.replace(TEXT_TAG_RE, (_, inner) => inner.trim());

  return result;
}
