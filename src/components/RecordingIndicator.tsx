// src/components/RecordingIndicator.tsx
import React from 'react';

interface RecordingIndicatorProps {
  isRecording: boolean;
}

const RecordingIndicator: React.FC<RecordingIndicatorProps> = ({ isRecording }) => {
  return (
    <div className="flex items-center space-x-2 mr-6">
      <div className={`h-4 w-4 rounded-full ${isRecording ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <span className="text-white">{isRecording ? 'Grabando' : 'No Grabando'}</span>
    </div>
  );
};

export default RecordingIndicator;
