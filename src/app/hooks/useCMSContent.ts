import { useMemo } from 'react';
import { usePageContent } from './usePageContent';
import {
  PageContent,
  ContentBlock,
  getBlockContent,
  getSectionBlocks,
} from '../services/pageContentService';

export interface CMSContentResult<T> {
  content: T;
  loading: boolean;
  error: Error | null;
  isFromCMS: boolean;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch CMS content for a specific block with fallback support
 * @param pageId - The page identifier
 * @param sectionId - The section identifier
 * @param blockKey - The block key
 * @param fallback - Fallback content if CMS is unavailable
 */
export function useCMSBlock<T extends string>(
  pageId: string,
  sectionId: string,
  blockKey: string,
  fallback: T
): CMSContentResult<T> {
  const { content, loading, error, refetch } = usePageContent(pageId);

  const result = useMemo(() => {
    if (loading) {
      return { content: fallback, isFromCMS: false };
    }

    if (error || !content) {
      return { content: fallback, isFromCMS: false };
    }

    const cmsContent = getBlockContent(content, sectionId, blockKey);
    if (cmsContent) {
      return { content: cmsContent as T, isFromCMS: true };
    }

    return { content: fallback, isFromCMS: false };
  }, [content, loading, error, sectionId, blockKey, fallback]);

  return {
    content: result.content,
    loading,
    error,
    isFromCMS: result.isFromCMS,
    refetch,
  };
}

/**
 * Hook to fetch CMS content for a JSON block with fallback support
 * @param pageId - The page identifier
 * @param sectionId - The section identifier
 * @param blockKey - The block key containing JSON data
 * @param fallback - Fallback content if CMS is unavailable
 */
export function useCMSJSONBlock<T>(
  pageId: string,
  sectionId: string,
  blockKey: string,
  fallback: T
): CMSContentResult<T> {
  const { content, loading, error, refetch } = usePageContent(pageId);

  const result = useMemo(() => {
    if (loading) {
      return { content: fallback, isFromCMS: false };
    }

    if (error || !content) {
      return { content: fallback, isFromCMS: false };
    }

    const cmsContent = getBlockContent(content, sectionId, blockKey);
    if (cmsContent) {
      try {
        const parsed = JSON.parse(cmsContent) as T;
        return { content: parsed, isFromCMS: true };
      } catch {
        console.warn(
          `Failed to parse JSON from CMS block ${pageId}/${sectionId}/${blockKey}`
        );
        return { content: fallback, isFromCMS: false };
      }
    }

    return { content: fallback, isFromCMS: false };
  }, [content, loading, error, pageId, sectionId, blockKey, fallback]);

  return {
    content: result.content,
    loading,
    error,
    isFromCMS: result.isFromCMS,
    refetch,
  };
}

/**
 * Hook to fetch all blocks from a CMS section with fallback support
 * @param pageId - The page identifier
 * @param sectionId - The section identifier
 * @param fallback - Fallback blocks if CMS is unavailable
 */
export function useCMSSection(
  pageId: string,
  sectionId: string,
  fallback: ContentBlock[] = []
): CMSContentResult<ContentBlock[]> {
  const { content, loading, error, refetch } = usePageContent(pageId);

  const result = useMemo(() => {
    if (loading) {
      return { content: fallback, isFromCMS: false };
    }

    if (error || !content) {
      return { content: fallback, isFromCMS: false };
    }

    const blocks = getSectionBlocks(content, sectionId);
    if (blocks.length > 0) {
      return { content: blocks, isFromCMS: true };
    }

    return { content: fallback, isFromCMS: false };
  }, [content, loading, error, sectionId, fallback]);

  return {
    content: result.content,
    loading,
    error,
    isFromCMS: result.isFromCMS,
    refetch,
  };
}

/**
 * Hook to fetch multiple blocks from a section as an object
 * @param pageId - The page identifier
 * @param sectionId - The section identifier
 * @param blockKeys - Array of block keys to fetch
 * @param fallbackMap - Object mapping block keys to fallback values
 */
export function useCMSSectionBlocks<T extends Record<string, string>>(
  pageId: string,
  sectionId: string,
  blockKeys: (keyof T)[],
  fallbackMap: T
): CMSContentResult<T> {
  const { content, loading, error, refetch } = usePageContent(pageId);

  const result = useMemo(() => {
    if (loading) {
      return { content: fallbackMap, isFromCMS: false };
    }

    if (error || !content) {
      return { content: fallbackMap, isFromCMS: false };
    }

    const cmsData: Record<string, string> = {};
    let hasAnyCMSContent = false;

    for (const key of blockKeys) {
      const cmsContent = getBlockContent(content, sectionId, key as string);
      if (cmsContent) {
        cmsData[key as string] = cmsContent;
        hasAnyCMSContent = true;
      } else {
        cmsData[key as string] = fallbackMap[key];
      }
    }

    return {
      content: cmsData as T,
      isFromCMS: hasAnyCMSContent,
    };
  }, [content, loading, error, sectionId, blockKeys, fallbackMap]);

  return {
    content: result.content,
    loading,
    error,
    isFromCMS: result.isFromCMS,
    refetch,
  };
}

/**
 * Hook to get full page content with section-level access
 * @param pageId - The page identifier
 */
export function useCMSPage(pageId: string): {
  page: PageContent | null;
  loading: boolean;
  error: Error | null;
  isFromCMS: boolean;
  getBlock: (sectionId: string, blockKey: string) => string;
  getJSONBlock: <T>(sectionId: string, blockKey: string, fallback: T) => T;
  isSectionEnabled: (sectionId: string) => boolean;
  refetch: () => Promise<void>;
} {
  const { content, loading, error, getBlock, getSection, refetch } =
    usePageContent(pageId);

  const getJSONBlock = <T>(
    sectionId: string,
    blockKey: string,
    fallback: T
  ): T => {
    const rawContent = getBlock(sectionId, blockKey);
    if (!rawContent) return fallback;

    try {
      return JSON.parse(rawContent) as T;
    } catch {
      console.warn(
        `Failed to parse JSON from CMS block ${pageId}/${sectionId}/${blockKey}`
      );
      return fallback;
    }
  };

  const isSectionEnabled = (sectionId: string): boolean => {
    if (!content) return true; // Default to enabled if no CMS content
    const section = content.sections.find((s) => s.sectionId === sectionId);
    return section?.isEnabled ?? true;
  };

  return {
    page: content,
    loading,
    error,
    isFromCMS: !!content,
    getBlock,
    getJSONBlock,
    isSectionEnabled,
    refetch,
  };
}

/**
 * Type for hero section content
 */
export interface HeroContent {
  label: string;
  title: string;
  subtitle: string;
}

/**
 * Type for testimonial data
 */
export interface Testimonial {
  id: number;
  name: string;
  location: string;
  review: string;
  image: string;
}

/**
 * Type for service preview data
 */
export interface ServicePreview {
  id: number;
  name: string;
  descriptionShort: string;
  location: string;
  capacity: number;
  image: string;
}

/**
 * Type for process step data
 */
export interface ProcessStep {
  number: string;
  icon: string;
  title: string;
  description: string;
}

/**
 * Type for value data
 */
export interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

/**
 * Type for team member data
 */
export interface TeamMember {
  image: string;
  title: string;
  department: string;
  description: string;
}

/**
 * Type for image data
 */
export interface CMSImage {
  url: string;
  alt: string;
  caption?: string;
}
