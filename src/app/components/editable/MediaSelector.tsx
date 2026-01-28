import { useState, useEffect } from 'react';
import { Search, Loader2, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { getMediaFiles, type MediaFile } from '../../services/mediaService';
import { cn } from '../ui/utils';

interface MediaSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, alt?: string) => void;
  currentUrl?: string;
}

type TabType = 'library' | 'url';

export function MediaSelector({
  isOpen,
  onClose,
  onSelect,
  currentUrl,
}: MediaSelectorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('library');
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [urlInput, setUrlInput] = useState(currentUrl || '');
  const [altInput, setAltInput] = useState('');

  useEffect(() => {
    if (isOpen && activeTab === 'library') {
      loadFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeTab]);

  useEffect(() => {
    if (currentUrl) {
      setUrlInput(currentUrl);
    }
  }, [currentUrl]);

  const loadFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMediaFiles({ limit: 20, search: search || undefined });
      setFiles(response.data.files);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadFiles();
  };

  const handleSelectFromLibrary = () => {
    if (selectedFile) {
      onSelect(selectedFile.url, selectedFile.alt);
      onClose();
    }
  };

  const handleSelectFromUrl = () => {
    if (urlInput) {
      onSelect(urlInput, altInput);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setUrlInput(currentUrl || '');
    setAltInput('');
    setSearch('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Image</DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              activeTab === 'library'
                ? 'border-[#F97023] text-[#F97023]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            <ImageIcon className="h-4 w-4" />
            Media Library
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              activeTab === 'url'
                ? 'border-[#F97023] text-[#F97023]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            <LinkIcon className="h-4 w-4" />
            URL
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-[300px]">
          {activeTab === 'library' ? (
            <div className="space-y-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search images..."
                    className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97023]"
                  />
                </div>
                <Button type="submit" variant="outline">
                  Search
                </Button>
              </form>

              {/* Loading/Error */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#F97023]" />
                </div>
              )}

              {error && (
                <div className="text-center py-8 text-red-500">{error}</div>
              )}

              {/* Grid */}
              {!loading && !error && (
                <div className="grid grid-cols-4 gap-3">
                  {files.map((file) => (
                    <button
                      key={file._id}
                      type="button"
                      onClick={() => setSelectedFile(file)}
                      className={cn(
                        'relative aspect-square rounded-lg overflow-hidden border-2 transition-all',
                        selectedFile?._id === file._id
                          ? 'border-[#F97023] ring-2 ring-[#F97023]/30'
                          : 'border-transparent hover:border-gray-300'
                      )}
                    >
                      <img
                        src={file.url}
                        alt={file.alt || file.originalName}
                        className="w-full h-full object-cover"
                      />
                      {selectedFile?._id === file._id && (
                        <div className="absolute inset-0 bg-[#F97023]/20" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {!loading && !error && files.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No images found
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97023]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Text (optional)
                </label>
                <input
                  type="text"
                  value={altInput}
                  onChange={(e) => setAltInput(e.target.value)}
                  placeholder="Describe the image..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97023]"
                />
              </div>
              {urlInput && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </p>
                  <div className="border rounded-lg p-2 bg-gray-50">
                    <img
                      src={urlInput}
                      alt={altInput || 'Preview'}
                      className="max-h-48 mx-auto object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {activeTab === 'library' ? (
            <Button
              onClick={handleSelectFromLibrary}
              disabled={!selectedFile}
              className="bg-gradient-to-r from-[#F44314] to-[#F97023] text-white hover:from-[#E03A0E] hover:to-[#E86519]"
            >
              Select Image
            </Button>
          ) : (
            <Button
              onClick={handleSelectFromUrl}
              disabled={!urlInput}
              className="bg-gradient-to-r from-[#F44314] to-[#F97023] text-white hover:from-[#E03A0E] hover:to-[#E86519]"
            >
              Use URL
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
