import DOMPurify from 'dompurify';
import { marked } from 'marked';

marked.setOptions({
  breaks: true,
  gfm: true,
});

function looksLikeHtml(content: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(content);
}

export function renderRichContent(content: string): string {
  const source = content || '';

  if (!source.trim()) {
    return '';
  }

  const html = looksLikeHtml(source) ? source : marked.parse(source, { async: false });
  return DOMPurify.sanitize(html);
}
