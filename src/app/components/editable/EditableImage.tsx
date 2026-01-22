import { useState, useEffect, useRef } from 'react';
import { ImageIcon } from 'lucide-react';
import { useEditMode } from '../../contexts/EditModeContext';
import { MediaSelector } from './MediaSelector';
import { cn } from '../ui/utils';

interface EditableImageProps {
  pageId: string;
  sectionId: string;
  blockKey: string;
  src: string;
  alt?: string;
  fallbackSrc?: string;
  className?: string;
}

export function EditableImage({
  pageId,
  sectionId,
  blockKey,
  src,
  alt = '',
  fallbackSrc,
  className,
}: EditableImageProps) {
  const { isEditMode, registerChange } = useEditMode();
  const [localSrc, setLocalSrc] = useState(src || fallbackSrc || '');
  const [localAlt, setLocalAlt] = useState(alt);
  const [showSelector, setShowSelector] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const originalSrcRef = useRef(src || fallbackSrc || '');

  // Update local src when prop changes (e.g., after save)
  useEffect(() => {
    const newSrc = src || fallbackSrc || '';
    setLocalSrc(newSrc);
    originalSrcRef.current = newSrc;
  }, [src, fallbackSrc]);

  useEffect(() => {
    setLocalAlt(alt);
  }, [alt]);

  const handleSelect = (url: string, newAlt?: string) => {
    setLocalSrc(url);
    if (newAlt) setLocalAlt(newAlt);
    setShowSelector(false);

    if (url !== originalSrcRef.current) {
      registerChange(
        pageId,
        sectionId,
        blockKey,
        url,
        originalSrcRef.current,
        'image'
      );
    }
  };

  // View mode - render normal image
  if (!isEditMode) {
    if (!localSrc) return null;
    return <img src={localSrc} alt={localAlt} className={className} />;
  }

  // Edit mode
  return (
    <>
      <div
        className={cn('relative cursor-pointer', className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setShowSelector(true)}
        data-editable="true"
      >
        {localSrc ? (
          <img
            src={localSrc}
            alt={localAlt}
            className={cn('w-full h-full object-cover', className)}
          />
        ) : (
          <div className="w-full h-full min-h-[100px] bg-gray-100 flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-gray-400" />
          </div>
        )}

        {/* Edit overlay */}
        <div
          className={cn(
            'absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        >
          <div className="flex flex-col items-center gap-2 text-white">
            <ImageIcon className="h-8 w-8" />
            <span className="text-sm font-medium">Change Image</span>
          </div>
        </div>

        {/* Edit indicator border */}
        <div
          className={cn(
            'absolute inset-0 pointer-events-none border-2 transition-colors',
            isHovered ? 'border-[#F97023]' : 'border-[#F97023]/30'
          )}
        />
      </div>

      <MediaSelector
        isOpen={showSelector}
        onClose={() => setShowSelector(false)}
        onSelect={handleSelect}
        currentUrl={localSrc}
      />
    </>
  );
}
