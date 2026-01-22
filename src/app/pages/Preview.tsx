import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, AlertCircle, Clock, Eye } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface PreviewData {
  isPreview: boolean;
  preview: {
    expiresAt: string;
    accessCount: number;
    maxAccess: number;
    timeRemaining: {
      expired: boolean;
      hours: number;
      minutes: number;
    };
  };
  page: {
    pageId: string;
    pageName: string;
    description?: string;
    slug: string;
    sections: unknown[];
    status: string;
    version: number;
  };
}

export function Preview() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);

  useEffect(() => {
    const fetchPreview = async () => {
      if (!token) {
        setError('No preview token provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/preview/${token}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || data.error || 'Failed to load preview');
        }

        setPreviewData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load preview');
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#F5821F] animate-spin" />
          <p className="text-gray-600 text-lg">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Preview Not Available
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500">
            This preview link may have expired or exceeded its access limit.
            Please request a new preview link from the page editor.
          </p>
        </div>
      </div>
    );
  }

  if (!previewData) {
    return null;
  }

  const { preview, page } = previewData;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Preview Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5" />
            <span className="font-medium">Preview Mode</span>
            <span className="text-amber-100">|</span>
            <span className="text-sm text-amber-100">{page.pageName}</span>
            {page.status !== 'published' && (
              <span className="bg-amber-600 text-xs px-2 py-0.5 rounded-full">
                {page.status}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-amber-100">
              <Clock className="w-4 h-4" />
              {preview.timeRemaining.expired ? (
                <span>Expired</span>
              ) : (
                <span>
                  Expires in {preview.timeRemaining.hours}h {preview.timeRemaining.minutes}m
                </span>
              )}
            </div>
            <span className="text-amber-100">
              Access {preview.accessCount}/{preview.maxAccess}
            </span>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="pt-12">
        {/* Render page sections here */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{page.pageName}</h1>
            {page.description && (
              <p className="text-gray-600 mb-6">{page.description}</p>
            )}

            {/* Placeholder for actual content rendering */}
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-2">
                Page content preview will be rendered here
              </p>
              <p className="text-sm text-gray-400">
                Version {page.version} | {page.sections.length} sections
              </p>
            </div>

            {/* Debug info in development */}
            {import.meta.env.DEV && (
              <details className="mt-8">
                <summary className="text-sm text-gray-500 cursor-pointer">
                  Debug: Raw page data
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(page, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preview;
