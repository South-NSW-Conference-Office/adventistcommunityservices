const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface ContentBlock {
  key: string;
  type: 'text' | 'richtext' | 'image' | 'cta';
  content: string;
  order: number;
  metadata?: {
    label?: string;
    description?: string;
    placeholder?: string;
    maxLength?: number;
  };
}

export interface Section {
  sectionId: string;
  sectionName: string;
  description?: string;
  order: number;
  blocks: ContentBlock[];
  isEnabled: boolean;
}

export interface PageContent {
  pageId: string;
  pageName: string;
  slug: string;
  description?: string;
  sections: Section[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
}

export interface PageContentResponse {
  success: boolean;
  page: PageContent;
}

export interface AllPagesResponse {
  success: boolean;
  pages: PageContent[];
}

/**
 * Get published content for a specific page
 */
export async function getPageContent(pageId: string): Promise<PageContent | null> {
  try {
    const response = await fetch(`${API_BASE}/api/page-content/${pageId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch page content: ${response.status}`);
    }

    const data: PageContentResponse = await response.json();
    return data.page;
  } catch (error) {
    console.error('Error fetching page content:', error);
    return null;
  }
}

/**
 * Get all published page content
 */
export async function getAllPageContent(): Promise<PageContent[]> {
  try {
    const response = await fetch(`${API_BASE}/api/page-content`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page content: ${response.status}`);
    }

    const data: AllPagesResponse = await response.json();
    return data.pages;
  } catch (error) {
    console.error('Error fetching all page content:', error);
    return [];
  }
}

/**
 * Get a specific block content from a page
 */
export function getBlockContent(
  page: PageContent | null,
  sectionId: string,
  blockKey: string
): string {
  if (!page) return '';

  const section = page.sections.find(
    (s) => s.sectionId === sectionId && s.isEnabled
  );
  if (!section) return '';

  const block = section.blocks.find((b) => b.key === blockKey);
  return block?.content || '';
}

/**
 * Get all blocks from a section
 */
export function getSectionBlocks(
  page: PageContent | null,
  sectionId: string
): ContentBlock[] {
  if (!page) return [];

  const section = page.sections.find(
    (s) => s.sectionId === sectionId && s.isEnabled
  );
  if (!section) return [];

  return [...section.blocks].sort((a, b) => a.order - b.order);
}
