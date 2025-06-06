import React from 'react';
import CallBubble from './CallBubble';
import TimelineConnector from './TimelineConnector';
import { Call } from '../types';
import { formatDateDifference } from '../utils/dateUtils';

interface CallTimelineProps {
  calls: Call[];
  selectedCallId: string | null;
  onCallSelect: (callId: string) => void;
}

const CallTimeline: React.FC<CallTimelineProps> = ({ calls, selectedCallId, onCallSelect }) => {
  if (calls.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No call history available for this customer.
      </div>
    );
  }

  return (
    <div className="relative pl-8">
      {calls.map((call, index) => (
        <div key={call.id} className="relative">
          <CallBubble 
            call={call} 
            isSelected={selectedCallId === call.id}
            onSelect={() => onCallSelect(call.id)}
          />
          
          {index < calls.length - 1 && (
            <TimelineConnector 
              timeDifference={formatDateDifference(calls[index + 1].completedDate, call.completedDate)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default CallTimeline;