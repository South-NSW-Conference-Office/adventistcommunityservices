import { AuthService } from './auth';
import type { Section, PageContent } from './pageContentService';
import type { PendingChange } from '../types/editMode.types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Debug helper
const DEBUG_PREFIX = '[CMS DEBUG]';
function debug(...args: unknown[]) {
  console.log(DEBUG_PREFIX, ...args);
}

interface UpdatePageResponse {
  success: boolean;
  message?: string;
  page?: PageContent;
}

function getAuthHeaders(): HeadersInit {
  const token = AuthService.getToken();
  debug('Auth token present:', !!token);
  if (!token) {
    debug('WARNING: No auth token found!');
  }
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Get page content for editing (includes draft content)
 */
export async function getPageForEdit(
  pageId: string
): Promise<PageContent | null> {
  debug('getPageForEdit() called with pageId:', pageId);
  debug('API_BASE:', API_BASE);
  const url = `${API_BASE}/api/admin/page-content/${pageId}`;
  debug('Fetching from URL:', url);

  try {
    const headers = getAuthHeaders();
    debug('Request headers:', JSON.stringify(headers));

    const response = await fetch(url, { headers });
    debug('Response status:', response.status, response.statusText);

    if (!response.ok) {
      if (response.status === 404) {
        debug('Page not found (404) - will need to create');
        return null;
      }
      const errorText = await response.text();
      debug('Error response body:', errorText);
      throw new Error(`Failed to fetch page: ${response.status}`);
    }

    const data = await response.json();
    debug('Page fetched successfully:', {
      pageId: data.page?.pageId,
      status: data.page?.status,
      sectionsCount: data.page?.sections?.length,
    });
    return data.page;
  } catch (error) {
    console.error('Error fetching page for edit:', error);
    debug('Fetch error:', error);
    return null;
  }
}

/**
 * Create a new page with initial sections from pending changes
 */
async function createPageFromChanges(
  pageId: string,
  changes: PendingChange[]
): Promise<UpdatePageResponse> {
  debug('createPageFromChanges() called');
  debug('pageId:', pageId);
  debug('changes count:', changes.length);
  debug('changes:', JSON.stringify(changes, null, 2));

  // Build sections from changes
  const sectionsMap = new Map<string, Section>();

  for (const change of changes) {
    let section = sectionsMap.get(change.sectionId);
    if (!section) {
      section = {
        sectionId: change.sectionId,
        sectionName: change.sectionId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        order: sectionsMap.size,
        blocks: [],
        isEnabled: true,
      };
      sectionsMap.set(change.sectionId, section);
    }

    section.blocks.push({
      key: change.blockKey,
      type: change.blockType,
      content: change.newContent,
      order: section.blocks.length,
    });
  }

  const sections = Array.from(sectionsMap.values());
  debug('Built sections:', JSON.stringify(sections, null, 2));

  const requestBody = {
    pageId,
    pageName: pageId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    slug: `/${pageId}`,
    sections,
  };
  debug('Create page request body:', JSON.stringify(requestBody, null, 2));

  try {
    const url = `${API_BASE}/api/admin/page-content`;
    debug('POSTing to URL:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestBody),
    });

    debug('Create response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      debug('Create error response:', errorData);
      throw new Error(
        errorData.message || `Failed to create page: ${response.status}`
      );
    }

    const data = await response.json();
    debug('Page created successfully:', {
      pageId: data.page?.pageId,
      status: data.page?.status,
    });
    return { success: true, page: data.page };
  } catch (error) {
    console.error('Error creating page content:', error);
    debug('Create error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create page',
    };
  }
}

/**
 * Apply pending changes to a page's sections structure
 * Creates missing sections and blocks as needed
 */
function applyChangesToSections(
  currentSections: Section[],
  changes: PendingChange[]
): Section[] {
  debug('applyChangesToSections() called');
  debug('currentSections count:', currentSections.length);
  debug('changes count:', changes.length);

  const sections = JSON.parse(JSON.stringify(currentSections)) as Section[];

  for (const change of changes) {
    let section = sections.find((s) => s.sectionId === change.sectionId);

    // Create section if it doesn't exist
    if (!section) {
      debug(`Section not found: ${change.sectionId} - CREATING`);
      section = {
        sectionId: change.sectionId,
        sectionName: change.sectionId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        order: sections.length,
        blocks: [],
        isEnabled: true,
      };
      sections.push(section);
    }

    let block = section.blocks.find((b) => b.key === change.blockKey);

    // Create block if it doesn't exist
    if (!block) {
      debug(`Block not found: ${change.blockKey} in section ${change.sectionId} - CREATING`);
      block = {
        key: change.blockKey,
        type: change.blockType,
        content: change.newContent,
        order: section.blocks.length,
      };
      section.blocks.push(block);
    } else {
      debug(`Updating block ${change.blockKey} in section ${change.sectionId}`);
      debug(`  Old content: "${block.content?.substring(0, 50)}..."`);
      debug(`  New content: "${change.newContent?.substring(0, 50)}..."`);
      block.content = change.newContent;
    }
  }

  debug('Final sections count:', sections.length);
  return sections;
}

/**
 * Save page content changes (saves as draft)
 * Auto-creates the page if it doesn't exist
 */
export async function updatePageContent(
  pageId: string,
  changes: PendingChange[]
): Promise<UpdatePageResponse> {
  debug('========================================');
  debug('updatePageContent() called');
  debug('pageId:', pageId);
  debug('changes count:', changes.length);
  debug('changes:', changes.map(c => ({ sectionId: c.sectionId, blockKey: c.blockKey })));

  try {
    // First fetch current page to get full structure
    const currentPage = await getPageForEdit(pageId);

    // If page doesn't exist, create it first
    if (!currentPage) {
      debug('Page does not exist, creating new page...');
      return createPageFromChanges(pageId, changes);
    }

    debug('Page exists, updating...');
    debug('Current page status:', currentPage.status);

    // Apply changes to sections
    const updatedSections = applyChangesToSections(
      currentPage.sections,
      changes
    );

    const url = `${API_BASE}/api/admin/page-content/${pageId}`;
    debug('PUTting to URL:', url);

    const requestBody = { sections: updatedSections };
    debug('Update request body sections count:', updatedSections.length);

    const response = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestBody),
    });

    debug('Update response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      debug('Update error response:', errorData);
      throw new Error(
        errorData.message || `Failed to update page: ${response.status}`
      );
    }

    const data = await response.json();
    debug('Page updated successfully:', {
      pageId: data.page?.pageId,
      status: data.page?.status,
      message: data.message,
    });
    return { success: true, page: data.page };
  } catch (error) {
    console.error('Error updating page content:', error);
    debug('Update error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to save changes',
    };
  }
}

/**
 * Publish page content changes
 */
export async function publishPageContent(
  pageId: string,
  changeDescription?: string
): Promise<UpdatePageResponse> {
  debug('========================================');
  debug('publishPageContent() called');
  debug('pageId:', pageId);

  try {
    const url = `${API_BASE}/api/admin/page-content/${pageId}/publish`;
    debug('POSTing to URL:', url);

    const requestBody = {
      changeDescription: changeDescription || 'Published via inline editor',
    };
    debug('Publish request body:', requestBody);

    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestBody),
    });

    debug('Publish response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      debug('Publish error response:', errorData);
      throw new Error(
        errorData.message || `Failed to publish page: ${response.status}`
      );
    }

    const data = await response.json();
    debug('Page published successfully:', {
      pageId: data.page?.pageId,
      status: data.page?.status,
      publishedAt: data.page?.publishedAt,
      message: data.message,
    });
    return { success: true, page: data.page };
  } catch (error) {
    console.error('Error publishing page content:', error);
    debug('Publish error:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to publish changes',
    };
  }
}

/**
 * Save and publish changes in one operation
 */
export async function saveAndPublish(
  pageId: string,
  changes: PendingChange[]
): Promise<UpdatePageResponse> {
  debug('saveAndPublish() called');
  // First save
  const saveResult = await updatePageContent(pageId, changes);
  if (!saveResult.success) {
    debug('Save failed, not publishing');
    return saveResult;
  }

  // Then publish
  return publishPageContent(pageId);
}

/**
 * Group changes by pageId for batch processing
 */
export function groupChangesByPage(
  changes: Map<string, PendingChange>
): Map<string, PendingChange[]> {
  debug('groupChangesByPage() called');
  debug('Total changes:', changes.size);

  const grouped = new Map<string, PendingChange[]>();

  for (const change of changes.values()) {
    const existing = grouped.get(change.pageId) || [];
    existing.push(change);
    grouped.set(change.pageId, existing);
  }

  debug('Grouped by pages:', Array.from(grouped.keys()));
  for (const [pageId, pageChanges] of grouped) {
    debug(`  ${pageId}: ${pageChanges.length} changes`);
  }

  return grouped;
}
