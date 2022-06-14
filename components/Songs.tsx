import { ClockIcon, HashtagIcon } from '@heroicons/react/outline';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { playlistState } from '../atoms/playlistAtoms';
import { Song } from './index';

export const Songs = () => {
  const playlist = useRecoilValue<any>(playlistState);
  return (
    <>
      <div className='text-white px-8 py-3 grid grid-cols-3'>
        <div className='flex justify-start'>
          <HashtagIcon className='w-5 h-5 ml-4 mr-14' />
          <p className='ml-1'>Title</p>
        </div>
        <div className='flex justify-center'>
          <p className='ml-12 hidden md:block'>Album</p>
        </div>
        <div className='flex justify-end'>
          <ClockIcon className='w-5 h-5 mr-3' />
        </div>
      </div>
      <hr className='border-t-[1px] mx-5 my-1 border-white' />
      <div className='text-white px-8 flex flex-col space-y-1 pb-28'>
        {playlist?.tracks?.items.map((track: any, i: number) => (
          <Song key={track.track.id} order={i as number} track={track} />
        ))}
      </div>
    </>
  );
};
