import { useState, useEffect, useCallback } from 'react';
import {
  getPageContent,
  getBlockContent,
  getSectionBlocks,
  PageContent,
  ContentBlock,
} from '../services/pageContentService';

interface UsePageContentResult {
  content: PageContent | null;
  loading: boolean;
  error: Error | null;
  getBlock: (sectionId: string, blockKey: string) => string;
  getSection: (sectionId: string) => ContentBlock[];
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage page content from the CMS
 * @param pageId - The unique identifier for the page
 */
export function usePageContent(pageId: string): UsePageContentResult {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContent = useCallback(async () => {
    if (!pageId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getPageContent(pageId);
      setContent(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch content'));
      setContent(null);
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const getBlock = useCallback(
    (sectionId: string, blockKey: string): string => {
      return getBlockContent(content, sectionId, blockKey);
    },
    [content]
  );

  const getSection = useCallback(
    (sectionId: string): ContentBlock[] => {
      return getSectionBlocks(content, sectionId);
    },
    [content]
  );

  return {
    content,
    loading,
    error,
    getBlock,
    getSection,
    refetch: fetchContent,
  };
}

/**
 * Hook to pre-load multiple page contents (useful for SSR or preloading)
 * @param pageIds - Array of page identifiers to load
 */
export function useMultiplePageContent(
  pageIds: string[]
): Record<string, PageContent | null> {
  const [contents, setContents] = useState<Record<string, PageContent | null>>(
    {}
  );

  useEffect(() => {
    const fetchAll = async () => {
      const results: Record<string, PageContent | null> = {};
      await Promise.all(
        pageIds.map(async (pageId) => {
          const content = await getPageContent(pageId);
          results[pageId] = content;
        })
      );
      setContents(results);
    };

    if (pageIds.length > 0) {
      fetchAll();
    }
  }, [pageIds.join(',')]);

  return contents;
}
