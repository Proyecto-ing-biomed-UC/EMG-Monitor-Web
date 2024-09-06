// src/components/ChannelControls.tsx
import React from 'react';

interface ChannelControlsProps {
  selectedChannels: Record<string, boolean>;
  channelNames: Record<string, string>;
  handleChannelToggle: (channel: string) => void;
  handleChannelNameChange: (channel: string, newName: string) => void;
}

const ChannelControls: React.FC<ChannelControlsProps> = ({ selectedChannels, channelNames, handleChannelToggle, handleChannelNameChange }) => {
  return (
    <div className="flex flex-wrap space-x-4 mb-4">
      {Object.keys(selectedChannels).map((channel) => (
        <div key={channel} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedChannels[channel]}
            onChange={() => handleChannelToggle(channel)}
            className="form-checkbox h-5 w-5 text-teal-600"
          />
          <input
            type="text"
            value={channelNames[channel]}
            onChange={(e) => handleChannelNameChange(channel, e.target.value)}
            className="border-b-2 bg-transparent border-teal-400 text-white p-1 focus:outline-none"
          />
        </div>
      ))}
    </div>
  );
};

export default ChannelControls;
