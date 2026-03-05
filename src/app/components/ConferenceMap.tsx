import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONFERENCES, Conference } from '../data/conferences';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';

interface ConferenceMapProps {
  className?: string;
}

export const ConferenceMap: React.FC<ConferenceMapProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleConferenceClick = async (conferenceCode: string) => {
    const conference = CONFERENCES.find(c => c.code === conferenceCode);
    if (!conference) return;

    if (conference.active) {
      // Navigate to services page with conference filter
      navigate(`/services?conference=${conferenceCode}`);
    } else {
      // Show modal and log interest
      setSelectedConference(conference);
      setModalOpen(true);
      
      // Log interest to backend (best effort, don't block on failure)
      try {
        await fetch('/api/contact/conference-interest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            conference: conferenceCode.toUpperCase(),
            timestamp: Date.now(),
          }),
        });
      } catch (error) {
        // Silently fail - don't block the modal
        console.warn('Failed to log conference interest:', error);
      }
    }
  };

  const conferenceData = CONFERENCES.reduce((acc, conf) => {
    acc[conf.code] = conf;
    return acc;
  }, {} as Record<string, Conference>);

  return (
    <>
      <div className={`w-full max-w-[600px] mx-auto ${className}`}>
        <svg 
          viewBox="0 0 800 700" 
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Western Australia */}
          <path
            d="M 50 150 L 50 400 L 200 450 L 280 350 L 250 200 L 180 120 Z"
            fill={conferenceData.wa?.active ? '#F44314' : '#D1D5DB'}
            stroke="white"
            strokeWidth="2"
            className={`transition-colors duration-200 cursor-pointer ${
              conferenceData.wa?.active 
                ? 'hover:fill-[#DC2626]' 
                : 'hover:fill-[#9CA3AF]'
            }`}
            onClick={() => handleConferenceClick('wa')}
          />
          
          {/* South Australia + NT */}
          <path
            d="M 280 350 L 200 450 L 320 500 L 420 480 L 450 350 L 400 200 L 350 150 L 280 200 Z"
            fill={conferenceData.sa?.active ? '#F44314' : '#D1D5DB'}
            stroke="white"
            strokeWidth="2"
            className={`transition-colors duration-200 cursor-pointer ${
              conferenceData.sa?.active 
                ? 'hover:fill-[#DC2626]' 
                : 'hover:fill-[#9CA3AF]'
            }`}
            onClick={() => handleConferenceClick('sa')}
          />

          {/* Tasmania */}
          <path
            d="M 420 550 L 450 570 L 480 550 L 470 520 L 430 520 Z"
            fill={conferenceData.tas?.active ? '#F44314' : '#D1D5DB'}
            stroke="white"
            strokeWidth="2"
            className={`transition-colors duration-200 cursor-pointer ${
              conferenceData.tas?.active 
                ? 'hover:fill-[#DC2626]' 
                : 'hover:fill-[#9CA3AF]'
            }`}
            onClick={() => handleConferenceClick('tas')}
          />

          {/* Victoria */}
          <path
            d="M 420 480 L 320 500 L 380 520 L 500 510 L 520 480 L 480 450 Z"
            fill={conferenceData.vic?.active ? '#F44314' : '#D1D5DB'}
            stroke="white"
            strokeWidth="2"
            className={`transition-colors duration-200 cursor-pointer ${
              conferenceData.vic?.active 
                ? 'hover:fill-[#DC2626]' 
                : 'hover:fill-[#9CA3AF]'
            }`}
            onClick={() => handleConferenceClick('vic')}
          />

          {/* South Queensland */}
          <path
            d="M 520 400 L 450 350 L 500 300 L 580 320 L 620 380 L 580 420 Z"
            fill={conferenceData.sq?.active ? '#F44314' : '#D1D5DB'}
            stroke="white"
            strokeWidth="2"
            className={`transition-colors duration-200 cursor-pointer ${
              conferenceData.sq?.active 
                ? 'hover:fill-[#DC2626]' 
                : 'hover:fill-[#9CA3AF]'
            }`}
            onClick={() => handleConferenceClick('sq')}
          />

          {/* North Queensland */}
          <path
            d="M 500 300 L 450 200 L 500 150 L 580 180 L 620 220 L 600 280 L 580 320 Z"
            fill={conferenceData.nq?.active ? '#F44314' : '#D1D5DB'}
            stroke="white"
            strokeWidth="2"
            className={`transition-colors duration-200 cursor-pointer ${
              conferenceData.nq?.active 
                ? 'hover:fill-[#DC2626]' 
                : 'hover:fill-[#9CA3AF]'
            }`}
            onClick={() => handleConferenceClick('nq')}
          />

          {/* Greater Sydney Conference */}
          <path
            d="M 620 380 L 650 370 L 670 390 L 660 410 L 630 420 L 620 400 Z"
            fill={conferenceData.gsc?.active ? '#F44314' : '#D1D5DB'}
            stroke="white"
            strokeWidth="2"
            className={`transition-colors duration-200 cursor-pointer ${
              conferenceData.gsc?.active 
                ? 'hover:fill-[#DC2626]' 
                : 'hover:fill-[#9CA3AF]'
            }`}
            onClick={() => handleConferenceClick('gsc')}
          />

          {/* South NSW */}
          <path
            d="M 520 480 L 520 400 L 580 420 L 620 400 L 650 430 L 680 460 L 650 500 L 600 510 L 550 500 Z"
            fill={conferenceData.snsw?.active ? '#F44314' : '#D1D5DB'}
            stroke="white"
            strokeWidth="2"
            className={`transition-colors duration-200 cursor-pointer ${
              conferenceData.snsw?.active 
                ? 'hover:fill-[#DC2626]' 
                : 'hover:fill-[#9CA3AF]'
            }`}
            onClick={() => handleConferenceClick('snsw')}
          />

          {/* North NSW */}
          <path
            d="M 580 320 L 620 220 L 680 250 L 720 300 L 700 350 L 670 370 L 650 370 L 620 380 Z"
            fill={conferenceData.nnsw?.active ? '#F44314' : '#D1D5DB'}
            stroke="white"
            strokeWidth="2"
            className={`transition-colors duration-200 cursor-pointer ${
              conferenceData.nnsw?.active 
                ? 'hover:fill-[#DC2626]' 
                : 'hover:fill-[#9CA3AF]'
            }`}
            onClick={() => handleConferenceClick('nnsw')}
          />

          {/* Conference Labels */}
          <text x="150" y="280" textAnchor="middle" className="text-xs font-semibold fill-gray-700 pointer-events-none">
            WA
          </text>
          <text x="350" y="320" textAnchor="middle" className="text-xs font-semibold fill-gray-700 pointer-events-none">
            SA/NT
          </text>
          <text x="450" y="540" textAnchor="middle" className="text-xs font-semibold fill-gray-700 pointer-events-none">
            TAS
          </text>
          <text x="470" y="490" textAnchor="middle" className="text-xs font-semibold fill-gray-700 pointer-events-none">
            VIC
          </text>
          <text x="570" y="370" textAnchor="middle" className="text-xs font-semibold fill-gray-700 pointer-events-none">
            SQ
          </text>
          <text x="550" y="240" textAnchor="middle" className="text-xs font-semibold fill-gray-700 pointer-events-none">
            NQ
          </text>
          <text x="650" y="380" textAnchor="middle" className="text-xs font-semibold fill-gray-700 pointer-events-none">
            GSC
          </text>
          <text x="600" y="450" textAnchor="middle" className="text-xs font-semibold fill-gray-700 pointer-events-none">
            SNSW
          </text>
          <text x="650" y="300" textAnchor="middle" className="text-xs font-semibold fill-gray-700 pointer-events-none">
            NNSW
          </text>

          {/* Active badge for SNSW */}
          {conferenceData.snsw?.active && (
            <g>
              <rect x="580" y="460" width="40" height="16" rx="8" fill="#10B981" />
              <text x="600" y="472" textAnchor="middle" className="text-xs font-bold fill-white pointer-events-none">
                ✓ Active
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Modal for inactive conferences */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Coming Soon to {selectedConference?.state}!
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2 space-y-2">
              <p>
                People in <strong>{selectedConference?.name}</strong> are looking for community services!
              </p>
              <p>
                This conference hasn't activated on communityservices.org.au yet.
                Want to help bring ACS services to {selectedConference?.state}?
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <a
              href={`mailto:${selectedConference?.contactEmail}?subject=Activate%20${encodeURIComponent(selectedConference?.name || '')}%20on%20CommunityServices.org.au`}
              className="inline-flex items-center justify-center px-4 py-2 bg-[#F44314] text-white font-medium rounded-lg hover:bg-[#DC2626] transition-colors"
              onClick={() => setModalOpen(false)}
            >
              Contact ACS
            </a>
            <button
              onClick={() => setModalOpen(false)}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConferenceMap;