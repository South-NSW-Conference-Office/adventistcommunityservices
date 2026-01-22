import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import {
  updatePageContent,
  publishPageContent,
  groupChangesByPage,
} from '../services/cmsEditService';
import type {
  EditModeContextType,
  PendingChange,
} from '../types/editMode.types';
import { getChangeKey } from '../types/editMode.types';

// Debug helper
const DEBUG_PREFIX = '[EditMode DEBUG]';
function debug(...args: unknown[]) {
  console.log(DEBUG_PREFIX, ...args);
}

const EditModeContext = createContext<EditModeContextType | undefined>(
  undefined
);

const EDIT_PERMISSION = 'page_content.manage';

interface EditModeProviderProps {
  children: ReactNode;
}

export function EditModeProvider({ children }: EditModeProviderProps) {
  const { isAuthenticated, hasPermission } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<
    Map<string, PendingChange>
  >(new Map());

  const canEdit = useMemo(() => {
    return isAuthenticated && hasPermission(EDIT_PERMISSION);
  }, [isAuthenticated, hasPermission]);

  const hasChanges = useMemo(() => {
    return pendingChanges.size > 0;
  }, [pendingChanges.size]);

  const enterEditMode = useCallback(() => {
    if (canEdit) {
      setIsEditMode(true);
    }
  }, [canEdit]);

  const exitEditMode = useCallback(() => {
    setIsEditMode(false);
  }, []);

  const registerChange = useCallback(
    (
      pageId: string,
      sectionId: string,
      blockKey: string,
      newContent: string,
      originalContent: string,
      blockType: PendingChange['blockType']
    ) => {
      const key = getChangeKey(pageId, sectionId, blockKey);
      debug('registerChange() called');
      debug('  pageId:', pageId);
      debug('  sectionId:', sectionId);
      debug('  blockKey:', blockKey);
      debug('  blockType:', blockType);
      debug('  originalContent:', originalContent?.substring(0, 50) + '...');
      debug('  newContent:', newContent?.substring(0, 50) + '...');
      debug('  key:', key);

      setPendingChanges((prev) => {
        const updated = new Map(prev);

        // If content is back to original, remove the change
        if (newContent === originalContent) {
          debug('  Content reverted to original, removing change');
          updated.delete(key);
        } else {
          // Preserve the original content from first change
          const existing = prev.get(key);
          debug('  Registering change, existing:', !!existing);
          updated.set(key, {
            pageId,
            sectionId,
            blockKey,
            originalContent: existing?.originalContent ?? originalContent,
            newContent,
            blockType,
          });
        }

        debug('  Total pending changes:', updated.size);
        return updated;
      });
    },
    []
  );

  const discardChanges = useCallback(() => {
    setPendingChanges(new Map());
  }, []);

  const saveChanges = useCallback(async (): Promise<boolean> => {
    debug('========================================');
    debug('saveChanges() called');
    debug('pendingChanges.size:', pendingChanges.size);

    if (pendingChanges.size === 0) {
      debug('No pending changes, returning true');
      return true;
    }

    debug('Pending changes:', Array.from(pendingChanges.keys()));
    setIsSaving(true);

    try {
      const grouped = groupChangesByPage(pendingChanges);
      debug('Grouped changes by page:', Array.from(grouped.keys()));

      const results: boolean[] = [];

      for (const [pageId, changes] of grouped) {
        debug(`Processing page: ${pageId} with ${changes.length} changes`);

        debug('Calling updatePageContent...');
        const result = await updatePageContent(pageId, changes);
        debug('updatePageContent result:', result);

        if (!result.success) {
          debug(`Update FAILED for ${pageId}:`, result.message);
          results.push(false);
          continue;
        }

        debug('Update succeeded, now publishing...');
        // Publish and check the result
        const publishResult = await publishPageContent(pageId);
        debug('publishPageContent result:', publishResult);

        if (!publishResult.success) {
          debug(`Publish FAILED for ${pageId}:`, publishResult.message);
        } else {
          debug(`Publish succeeded for ${pageId}`);
        }

        results.push(publishResult.success);
      }

      debug('All results:', results);
      const allSuccessful = results.every(Boolean);
      debug('allSuccessful:', allSuccessful);

      if (allSuccessful) {
        debug('Clearing pending changes');
        setPendingChanges(new Map());
      } else {
        debug('NOT clearing pending changes due to failures');
      }

      return allSuccessful;
    } catch (error) {
      console.error('Error saving changes:', error);
      debug('saveChanges ERROR:', error);
      return false;
    } finally {
      setIsSaving(false);
      debug('saveChanges() finished');
    }
  }, [pendingChanges]);

  const value: EditModeContextType = useMemo(
    () => ({
      isEditMode,
      canEdit,
      hasChanges,
      isSaving,
      pendingChanges,
      enterEditMode,
      exitEditMode,
      registerChange,
      discardChanges,
      saveChanges,
    }),
    [
      isEditMode,
      canEdit,
      hasChanges,
      isSaving,
      pendingChanges,
      enterEditMode,
      exitEditMode,
      registerChange,
      discardChanges,
      saveChanges,
    ]
  );

  return (
    <EditModeContext.Provider value={value}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode(): EditModeContextType {
  const context = useContext(EditModeContext);
  if (context === undefined) {
    throw new Error('useEditMode must be used within an EditModeProvider');
  }
  return context;
}
