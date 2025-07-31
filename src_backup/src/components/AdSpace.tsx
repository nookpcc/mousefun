import React from 'react';

interface AdSpaceProps {
  size: 'banner' | 'square';
}

const AdSpace: React.FC<AdSpaceProps> = ({ size }) => {
  const dimensions = {
    banner: 'w-full h-24',
    square: 'w-64 h-64'
  };

  return (
    <div className={`${dimensions[size]} bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-lg`}>
      <div className="text-gray-400 text-center">
        <div className="text-2xl mb-2">📢</div>
        <div className="text-sm">Advertisement Space</div>
        <div className="text-xs">{size}</div>
      </div>
    </div>
  );
};

export default AdSpace;
