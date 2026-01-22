import { Pencil, X } from 'lucide-react';
import { useEditMode } from '../../contexts/EditModeContext';
import { cn } from '../ui/utils';

export function EditModeFloatingButton() {
  const { isEditMode, canEdit, enterEditMode, exitEditMode, hasChanges } =
    useEditMode();

  if (!canEdit) return null;

  const handleClick = () => {
    if (isEditMode) {
      if (hasChanges) {
        const confirm = window.confirm(
          'You have unsaved changes. Are you sure you want to exit edit mode?'
        );
        if (!confirm) return;
      }
      exitEditMode();
    } else {
      enterEditMode();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2',
        isEditMode
          ? 'bg-gray-700 text-white hover:bg-gray-800 focus:ring-gray-500'
          : 'bg-gradient-to-r from-[#F44314] to-[#F97023] text-white hover:from-[#E03A0E] hover:to-[#E86519] focus:ring-[#F97023]'
      )}
      title={isEditMode ? 'Exit edit mode' : 'Enter edit mode'}
      aria-label={isEditMode ? 'Exit edit mode' : 'Enter edit mode'}
    >
      {isEditMode ? (
        <X className="h-6 w-6" />
      ) : (
        <Pencil className="h-6 w-6" />
      )}
    </button>
  );
}
