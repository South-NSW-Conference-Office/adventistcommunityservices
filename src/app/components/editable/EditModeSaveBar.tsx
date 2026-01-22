import { Loader2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { useEditMode } from '../../contexts/EditModeContext';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';

// Debug helper
const DEBUG_PREFIX = '[SaveBar DEBUG]';
function debug(...args: unknown[]) {
  console.log(DEBUG_PREFIX, ...args);
}

export function EditModeSaveBar() {
  const {
    isEditMode,
    hasChanges,
    isSaving,
    pendingChanges,
    discardChanges,
    saveChanges,
  } = useEditMode();

  debug('Render - isEditMode:', isEditMode, 'hasChanges:', hasChanges, 'pendingChanges.size:', pendingChanges.size);

  if (!isEditMode || !hasChanges) return null;

  const changeCount = pendingChanges.size;

  const handleDiscard = () => {
    debug('handleDiscard() called');
    const confirm = window.confirm(
      'Are you sure you want to discard all changes?'
    );
    if (confirm) {
      debug('User confirmed discard');
      discardChanges();
    }
  };

  const handleSave = async () => {
    debug('========================================');
    debug('handleSave() called - Save button clicked!');
    debug('pendingChanges.size:', pendingChanges.size);
    debug('pendingChanges keys:', Array.from(pendingChanges.keys()));

    const success = await saveChanges();
    debug('saveChanges() returned:', success);

    if (success) {
      debug('Showing success toast and reloading page');
      toast.success('Changes saved successfully');
      // Reload page to fetch fresh content from database
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      debug('Showing error toast');
      toast.error('Failed to save changes. Please try again.');
    }
  };

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white px-4 py-3 shadow-lg transition-transform duration-200',
        'flex items-center justify-between'
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">
          {changeCount} unsaved {changeCount === 1 ? 'change' : 'changes'}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDiscard}
          disabled={isSaving}
          className="gap-1.5"
        >
          <X className="h-4 w-4" />
          Discard
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          className="gap-1.5 bg-gradient-to-r from-[#F44314] to-[#F97023] text-white hover:from-[#E03A0E] hover:to-[#E86519]"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
