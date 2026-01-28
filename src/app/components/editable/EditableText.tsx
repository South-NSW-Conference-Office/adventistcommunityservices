import { useState, useRef, useEffect, ElementType } from 'react';
import { useEditMode } from '../../contexts/EditModeContext';
import { cn } from '../ui/utils';

interface EditableTextProps {
  pageId: string;
  sectionId: string;
  blockKey: string;
  content: string;
  fallback?: string;
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div';
}

export function EditableText({
  pageId,
  sectionId,
  blockKey,
  content,
  fallback = '',
  className,
  as: Component = 'span',
}: EditableTextProps) {
  const { isEditMode, registerChange } = useEditMode();
  const [localContent, setLocalContent] = useState(content || fallback);
  const [isEditing, setIsEditing] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const originalContentRef = useRef(content || fallback);
  const isInitialMount = useRef(true);

  // Update local content when prop changes (e.g., after save)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const newContent = content || fallback;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalContent(newContent);
    originalContentRef.current = newContent;
  }, [content, fallback]);

  const handleClick = () => {
    if (isEditMode && !isEditing) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (elementRef.current) {
      const newContent = elementRef.current.textContent || '';

      // Only process if content actually changed during this edit session
      if (newContent !== localContent) {
        setLocalContent(newContent);
        // Always register the change - the context will handle
        // removing it if content matches original
        registerChange(
          pageId,
          sectionId,
          blockKey,
          newContent,
          originalContentRef.current,
          'text'
        );
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      // Revert to original content
      if (elementRef.current) {
        elementRef.current.textContent = localContent;
      }
      setIsEditing(false);
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      elementRef.current?.blur();
    }
  };

  const Tag = Component as ElementType;

  // View mode - render normally
  if (!isEditMode) {
    return <Tag className={className}>{localContent}</Tag>;
  }

  // Edit mode
  return (
    <Tag
      ref={elementRef as React.RefObject<HTMLElement>}
      className={cn(
        className,
        'outline-none transition-all duration-150',
        isEditing
          ? 'ring-2 ring-[#F97023] ring-offset-2'
          : 'cursor-pointer hover:ring-2 hover:ring-[#F97023]/50 hover:ring-offset-1'
      )}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onClick={handleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      data-editable="true"
      data-editing={isEditing}
    >
      {localContent}
    </Tag>
  );
}
