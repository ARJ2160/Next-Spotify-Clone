import { DeviceMobileIcon } from '@heroicons/react/outline';
import Image from 'next/image';
import React from 'react';

interface myDeviceProps {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
}

export const PlaybackState = (myDevices: myDeviceProps) => {
  return (
    <div className='playback flex flex-col justify-center items-center'>
      <div>Connect to a Device</div>
      <div
        style={{
          width: '15rem',
          height: '15rem',
          marginBottom: '1.25rem',
          position: 'relative',
        }}
      >
        <Image
          src='https://open.scdn.co/cdn/images/connect_header@1x.8f827808.png'
          alt=''
          layout='fill'
          objectFit='contain'
        />
      </div>
      <div>
        <div>
          <DeviceMobileIcon className='w-10 h-10' />
        </div>
      </div>
    </div>
  );
};
