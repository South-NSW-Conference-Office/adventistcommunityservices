import { useState } from 'react';
import { Lightbulb, Send, Check } from 'lucide-react';

interface ServiceRequestBannerProps {
  /** Team or service name ΓÇö used in the placeholder and stored with the submission */
  contextName?: string;
  /** Team ID to route the feedback to */
  teamId?: string;
  /** Optional: the page type for context */
  pageType?: 'team' | 'service';
}

export function ServiceRequestBanner({ contextName, teamId, pageType = 'team' }: ServiceRequestBannerProps) {
  const [expanded, setExpanded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [request, setRequest] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!request.trim()) return;

    // TODO: POST to backend ΓÇö store as service request linked to teamId
    // For now, log it (Bem will build the endpoint)
    console.log('Service request:', { request, location, teamId, contextName, pageType });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setExpanded(false);
      setRequest('');
      setLocation('');
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="bg-[#F0FDF4] border-y border-green-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-green-800 font-medium text-sm">Thanks ΓÇö your suggestion has been shared with the team.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFBEB] border-y border-amber-200">
      <div className="max-w-7xl mx-auto px-6 py-5">
        {!expanded ? (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-[#1F2937] font-semibold text-sm">Can't find what you're looking for?</p>
                <p className="text-gray-500 text-xs">Let this team know what services your community could use.</p>
              </div>
            </div>
            <button
              onClick={() => setExpanded(true)}
              className="px-5 py-2 bg-[#1F2937] text-white rounded-lg text-sm font-medium hover:bg-[#374151] transition-colors flex-shrink-0"
            >
              Suggest a Service
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-3 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <p className="text-[#1F2937] font-semibold text-sm">What service would you like to see{contextName ? ` from ${contextName}` : ''}?</p>
            </div>
            <div className="flex gap-3 flex-wrap md:flex-nowrap">
              <input
                type="text"
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                placeholder="e.g. After-school tutoring, clothing repairs, financial counseling..."
                className="flex-1 min-w-0 px-4 py-2.5 rounded-lg bg-white border border-amber-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F44314] text-sm"
                required
              />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Your suburb"
                className="w-40 px-4 py-2.5 rounded-lg bg-white border border-amber-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F44314] text-sm"
              />
              <button type="submit" className="px-5 py-2.5 bg-[#F44314] text-white rounded-lg text-sm font-semibold hover:bg-[#d93a10] transition-colors flex items-center gap-2 flex-shrink-0">
                <Send className="w-3.5 h-3.5" /> Submit
              </button>
            </div>
            <button type="button" onClick={() => setExpanded(false)} className="text-gray-400 text-xs hover:text-gray-600">Cancel</button>
          </form>
        )}
      </div>
    </div>
  );
}
