import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useCallback, useState } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link as LinkIcon,
  Unlink,
} from 'lucide-react';
import { cn } from '../ui/utils';

interface InlineRichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  className?: string;
  placeholder?: string;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  title,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      disabled={disabled}
      title={title}
      className={cn(
        'p-1.5 rounded transition-colors',
        isActive
          ? 'bg-[#F97023]/20 text-[#F97023]'
          : 'text-gray-600 hover:bg-gray-100',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {children}
    </button>
  );
}

export function InlineRichTextEditor({
  content,
  onChange,
  className,
  placeholder = 'Start typing...',
}: InlineRichTextEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#F97023] underline hover:text-[#E86519]',
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onFocus: () => setIsFocused(true),
    onBlur: ({ event }) => {
      // Don't blur if clicking on the toolbar
      const relatedTarget = event.relatedTarget as HTMLElement;
      if (relatedTarget?.closest('[data-toolbar]')) {
        return;
      }
      setIsFocused(false);
    },
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[1em]',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;

    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    }
    setShowLinkInput(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  if (!editor) {
    return <div className={className}>{content}</div>;
  }

  return (
    <div className="relative">
      {/* Floating Toolbar */}
      {isFocused && (
        <div
          data-toolbar
          className="absolute -top-12 left-0 z-50 flex items-center gap-0.5 rounded-lg bg-white px-2 py-1 shadow-lg border border-gray-200"
        >
          {showLinkInput ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="Enter URL..."
                className="px-2 py-1 text-xs border rounded w-36 focus:outline-none focus:ring-1 focus:ring-[#F97023]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    setLink();
                  } else if (e.key === 'Escape') {
                    setShowLinkInput(false);
                    setLinkUrl('');
                  }
                }}
                autoFocus
              />
              <button
                type="button"
                onClick={setLink}
                className="px-2 py-1 text-xs bg-[#F97023] text-white rounded hover:bg-[#E86519]"
              >
                Set
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLinkInput(false);
                  setLinkUrl('');
                  editor.chain().focus().run();
                }}
                className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
                title="Underline"
              >
                <UnderlineIcon className="h-4 w-4" />
              </ToolbarButton>
              <div className="w-px h-4 bg-gray-300 mx-0.5" />
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </ToolbarButton>
              <div className="w-px h-4 bg-gray-300 mx-0.5" />
              <ToolbarButton
                onClick={() => {
                  const previousUrl = editor.getAttributes('link').href || '';
                  setLinkUrl(previousUrl);
                  setShowLinkInput(true);
                }}
                isActive={editor.isActive('link')}
                title="Add Link"
              >
                <LinkIcon className="h-4 w-4" />
              </ToolbarButton>
              {editor.isActive('link') && (
                <ToolbarButton
                  onClick={() => editor.chain().focus().unsetLink().run()}
                  title="Remove Link"
                >
                  <Unlink className="h-4 w-4" />
                </ToolbarButton>
              )}
            </>
          )}
        </div>
      )}
      <EditorContent editor={editor} className={className} />
    </div>
  );
}
