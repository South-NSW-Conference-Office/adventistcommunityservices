import { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { useEditMode } from '../../contexts/EditModeContext';
import { InlineRichTextEditor } from './InlineRichTextEditor';
import { cn } from '../ui/utils';

// Restrict iframe sources to trusted video platforms only.
// This hook runs once at module load time (not per-render) to avoid duplicate registrations.
if (typeof window !== 'undefined') {
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'IFRAME') {
      const src = node.getAttribute('src') || '';
      const allowedDomains = [
        'youtube.com',
        'www.youtube.com',
        'youtube-nocookie.com',
        'www.youtube-nocookie.com',
        'player.vimeo.com',
      ];
      try {
        const url = new URL(src);
        if (!allowedDomains.includes(url.hostname)) {
          node.remove();
        }
      } catch {
        // Invalid URL -- remove the iframe
        node.remove();
      }
    }
  });
}

interface EditableRichTextProps {
  pageId: string;
  sectionId: string;
  blockKey: string;
  content: string;
  fallback?: string;
  className?: string;
}

export function EditableRichText({
  pageId,
  sectionId,
  blockKey,
  content,
  fallback = '',
  className,
}: EditableRichTextProps) {
  const { isEditMode, registerChange } = useEditMode();
  const [localContent, setLocalContent] = useState(content || fallback);
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

  const handleChange = (html: string) => {
    setLocalContent(html);
    registerChange(
      pageId,
      sectionId,
      blockKey,
      html,
      originalContentRef.current,
      'richtext'
    );
  };

  // View mode - render sanitized HTML
  if (!isEditMode) {
    const sanitizedContent = DOMPurify.sanitize(localContent, {
      ADD_TAGS: ['iframe'],
      ADD_ATTR: ['target', 'allowfullscreen', 'frameborder'],
    });

    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    );
  }

  // Edit mode - render Tiptap editor
  return (
    <div
      className={cn(
        className,
        'rounded transition-all duration-150',
        'ring-2 ring-[#F97023]/30 ring-offset-1'
      )}
      data-editable="true"
    >
      <InlineRichTextEditor
        content={localContent}
        onChange={handleChange}
        className={className}
      />
    </div>
  );
}
