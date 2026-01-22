export interface PendingChange {
  pageId: string;
  sectionId: string;
  blockKey: string;
  originalContent: string;
  newContent: string;
  blockType: 'text' | 'richtext' | 'image' | 'cta';
}

export interface EditModeContextType {
  isEditMode: boolean;
  canEdit: boolean;
  hasChanges: boolean;
  isSaving: boolean;
  pendingChanges: Map<string, PendingChange>;

  enterEditMode: () => void;
  exitEditMode: () => void;
  registerChange: (
    pageId: string,
    sectionId: string,
    blockKey: string,
    newContent: string,
    originalContent: string,
    blockType: PendingChange['blockType']
  ) => void;
  discardChanges: () => void;
  saveChanges: () => Promise<boolean>;
}

export function getChangeKey(
  pageId: string,
  sectionId: string,
  blockKey: string
): string {
  return `${pageId}:${sectionId}:${blockKey}`;
}
