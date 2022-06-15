import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSpotify from '../hooks/useSpotify';
import { milliToMinutesAndSeconds } from '../lib/time';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

interface SongProps {
  order: number;
  track: any;
}

export const Song = ({ order, track }: SongProps) => {
  const spotifyApi = useSpotify();
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [currentStateId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = () => {
    setCurrentTrackId(track.track.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [track.track.uri],
    });
  };

  return (
    <div
      className='grid grid-cols-2 text-[#B3B3B3] py-4 px-5 hover:bg-gray-900 rounded-lg'
      onClick={playSong}
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
    >
      <div className='flex items-center space-x-4'>
        <p>
          {isMouseOver ? (
            <FontAwesomeIcon icon={faPlay} className='text-white w-3 h-3' />
          ) : (
            order + 1
          )}
        </p>
        <div className='h-10 w-10 relative'>
          <Image
            layout='fill'
            src={
              track.track.album.images[0].url ||
              'https://ik.imagekit.io/36athv2v82c8/spotify_qV8MX8wFKBo.png?ik-sdk-version=javascript-1.4.3&updatedAt=1637078191744'
            }
            alt=''
          />
        </div>
        <div>
          <p
            className={
              currentStateId === track.track.id
                ? `text-green-500`
                : `` + `w-36 lg:w-64 text-white truncate`
            }
          >
            {track.track.name}
          </p>
          <p className='w-40 font-medium'>{track.track.artists[0].name}</p>
        </div>
      </div>
      <div className='flex items-center ml-auto justify-between md:ml-0 font-medium leading-4 text-sm tracking-normal'>
        <p className='hidden md:inline-block w-40 hover:underline cursor-pointer'>
          {track.track.album.name}
        </p>
        <p>{milliToMinutesAndSeconds(track.track.duration_ms)}</p>
      </div>
    </div>
  );
};
