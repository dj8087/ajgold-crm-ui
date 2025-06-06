import React from 'react';

interface TimelineConnectorProps {
  timeDifference: string;
}

const TimelineConnector: React.FC<TimelineConnectorProps> = ({ timeDifference }) => {
  return (
    <div className="absolute -left-8 top-8 bottom-0 w-0 border-l-2 border-dashed border-gray-200 flex items-center">
      <div className="absolute -left-[48px] bg-gray-50 text-xs text-gray-500 py-1 px-2 rounded-md whitespace-nowrap">
        {timeDifference}
      </div>
    </div>
  );
};

export default TimelineConnector;