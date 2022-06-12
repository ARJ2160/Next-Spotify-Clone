import { HashtagIcon } from '@heroicons/react/outline';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { playlistState } from '../atoms/playlistAtoms';
import Song from './Song';

const Songs = () => {
  const playlist = useRecoilValue<any>(playlistState);
  return (
    <div>
      <div className='text-white px-8 grid grid-cols-3'>
        <div className='flex justify-start'>
          <HashtagIcon className='w-5 h-5 ml-4 mr-14' />
          <p>Title</p>
        </div>
        <div className='flex justify-center'>
          <p className='ml-10 hidden md:block'>Album</p>
        </div>
        <div className='flex justify-end'>
          <p className='mr-3'>Duration</p>
        </div>
      </div>
      <div className='text-white px-8 flex flex-col space-y-1 pb-28'>
        {playlist?.tracks?.items.map((track: any, i: number) => (
          <Song key={track.track.id} order={i as number} track={track} />
        ))}
      </div>
    </div>
  );
};

export default Songs;
