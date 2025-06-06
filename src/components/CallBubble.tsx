import React from 'react';
import { Call, CallStatus } from '../types';
import { formatTime, formatDate, formatDate2 } from '../utils/dateUtils';
import { getStatusIcon, getStatusColor } from '../utils/statusUtils';
import { Phone, Clock, User, MessageCircle } from 'lucide-react';

interface CallBubbleProps {
  call: Call;
  isSelected: boolean;
  onSelect: () => void;
}

const CallBubble: React.FC<CallBubbleProps> = ({ call, isSelected, onSelect }) => {
  const StatusIcon = getStatusIcon(call.status);
  const statusColor = getStatusColor(call.status);
  
  return (
    <div className="relative mb-6">
      {/* Timeline dot */}
      <div 
        className={`absolute -left-10 top-4 w-4 h-4 rounded-full border-2 ${statusColor.border}`}
        style={{ backgroundColor: statusColor.background }}
      />
      
      {/* Call bubble */}
      <div 
        className={`
          relative rounded-lg shadow-sm border-l-4 transition-all duration-300 ease-in-out
          ${statusColor.border} ${isSelected ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}
        `}
        onClick={onSelect}
      >
        <div className="p-4 cursor-pointer">
          {/* Header with status and time */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
              <StatusIcon className={`${statusColor.text} mr-2`} size={18} />
              <span className={`font-medium ${statusColor.text}`}>{call.status}</span>
            </div>
            <div className="text-sm text-gray-500 text-right">
              <div>{formatDate2(call.completedDate)}</div>
              <div>{formatTime(call.completedDate)}</div>
            </div>
          </div>

          {/* Middle row: Agent, Duration, Purpose */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <div className="flex flex-col text-gray-700 text-sm">
              <div className="flex items-center">
                <User size={16} className="mr-2 text-gray-400" />
                <span>Agent: {call.agentName}</span>
              </div>
              <div className="flex items-center mt-1">
                <Clock size={16} className="mr-2 text-gray-400" />
                <span>Duration: {call.duration} minutes</span>
              </div>
            </div>
            <div className="flex items-center text-gray-700 text-sm">
              <MessageCircle size={16} className="mr-2 text-gray-400" />
              <span>Purpose: {call.purpose}</span>
            </div>
          </div>
          
          {/* Expanded details */}
          <div className={`mt-3 overflow-hidden transition-all duration-300 ${isSelected ? 'max-h-96' : 'max-h-0'}`}>
            {isSelected && (
              <div className="border-t pt-3 text-sm text-gray-700">
                <h4 className="font-medium mb-1">Call Notes:</h4>
                <p className="whitespace-pre-wrap">{call.operatorNotes}</p>
                
                {call.outcomes && (
                  <>
                    <h4 className="font-medium mt-3 mb-1">Outcomes:</h4>
                    <ul className="list-disc list-inside">
                      {call.outcomes.map((outcome, idx) => (
                        <li key={idx}>{outcome}</li>
                      ))}
                    </ul>
                  </>
                )}
                
                {call.nextActions && (
                  <>
                    <h4 className="font-medium mt-3 mb-1">Next Actions:</h4>
                    <ul className="list-disc list-inside">
                      {call.nextActions.map((action, idx) => (
                        <li key={idx}>{action}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Expand/collapse indicator */}
        <div 
          className={`absolute bottom-2 right-2 w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 transition-transform duration-300 ${isSelected ? 'rotate-180' : ''}`}
        >
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CallBubble;