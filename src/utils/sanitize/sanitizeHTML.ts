import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML strings to prevent XSS attacks.
 * Use this ONLY when dangerouslySetInnerHTML is absolutely necessary.
 */
export function sanitizeHTML(dirty: string): string {
  if (typeof window === 'undefined') {
    // Server-side: strip all HTML tags as DOMPurify requires DOM
    return dirty.replace(/<[^>]*>/g, '');
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],      // No HTML tags allowed by default
    ALLOWED_ATTR: [],      // No attributes allowed
  });
}