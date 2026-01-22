import { usePageContent } from '../hooks/usePageContent';
import DOMPurify from 'dompurify';
import React from 'react';

interface PageContentProps {
  /** Page ID to fetch content from */
  pageId: string;
  /** Section ID within the page */
  sectionId: string;
  /** Block key within the section */
  blockKey: string;
  /** Fallback content to show while loading or on error */
  fallback?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** HTML element to render as */
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Component to render CMS-managed content
 * Automatically fetches and sanitizes content from the backend
 */
export function PageContent({
  pageId,
  sectionId,
  blockKey,
  fallback,
  className,
  as: Component = 'div',
}: PageContentProps) {
  const { getBlock, loading, error } = usePageContent(pageId);

  // Show fallback while loading
  if (loading) {
    return <>{fallback}</>;
  }

  // Show fallback on error
  if (error) {
    console.error(`PageContent error for ${pageId}/${sectionId}/${blockKey}:`, error);
    return <>{fallback}</>;
  }

  const content = getBlock(sectionId, blockKey);

  // Show fallback if no content
  if (!content) {
    return <>{fallback}</>;
  }

  // Sanitize HTML content to prevent XSS
  const sanitizedContent = DOMPurify.sanitize(content, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['target', 'allowfullscreen', 'frameborder'],
  });

  return (
    <Component
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}

interface PageContentTextProps {
  /** Page ID to fetch content from */
  pageId: string;
  /** Section ID within the page */
  sectionId: string;
  /** Block key within the section */
  blockKey: string;
  /** Fallback text to show while loading or on error */
  fallback?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Component to render plain text CMS content (no HTML)
 */
export function PageContentText({
  pageId,
  sectionId,
  blockKey,
  fallback = '',
  className,
}: PageContentTextProps) {
  const { getBlock, loading, error } = usePageContent(pageId);

  if (loading || error) {
    return <span className={className}>{fallback}</span>;
  }

  const content = getBlock(sectionId, blockKey);

  // Strip HTML tags for plain text display
  const plainText = content
    ? content.replace(/<[^>]*>/g, '').trim()
    : fallback;

  return <span className={className}>{plainText}</span>;
}

interface PageContentImageProps {
  /** Page ID to fetch content from */
  pageId: string;
  /** Section ID within the page */
  sectionId: string;
  /** Block key within the section */
  blockKey: string;
  /** Fallback image URL */
  fallbackSrc?: string;
  /** Alt text for the image */
  alt?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Component to render CMS-managed image content
 */
export function PageContentImage({
  pageId,
  sectionId,
  blockKey,
  fallbackSrc,
  alt = '',
  className,
}: PageContentImageProps) {
  const { getBlock, loading, error } = usePageContent(pageId);

  if (loading || error) {
    return fallbackSrc ? (
      <img src={fallbackSrc} alt={alt} className={className} />
    ) : null;
  }

  const src = getBlock(sectionId, blockKey);

  if (!src && !fallbackSrc) {
    return null;
  }

  return <img src={src || fallbackSrc} alt={alt} className={className} />;
}

// Re-export the hook for convenience
export { usePageContent } from '../hooks/usePageContent';
