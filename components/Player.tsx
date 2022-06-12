import { VolumeUpIcon as VolumeDownIcon } from '@heroicons/react/outline';
import {
  RewindIcon,
  SwitchHorizontalIcon,
  PauseIcon,
  FastForwardIcon,
  PlayIcon,
  ReplyIcon,
  VolumeUpIcon,
} from '@heroicons/react/solid';
import { debounce } from 'lodash';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify';

const Player = () => {

  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentIdTrack, setCurrentIdTrack] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  const songInfo = useSongInfo() as any;

  const fetchCurrentSong = async () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentIdTrack(data.body?.item?.id as any);
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume);
    }, 500),
    []
  );
  
  const handleKeyPress = useCallback((event: any) => {
    if (event.keyCode === 32) {
      handlePlayPause();
    }
  }, []);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentIdTrack) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentIdTrack, spotifyApi, session]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  useEffect(() => {
    // attach the event listener
    document.addEventListener('keydown', handleKeyPress);
    // remove the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className='h-24 bg-gradient-to-b from-black to-gray-900 text-white text-xs md:text-base grid grid-cols-3 px-2 md:px-8'>
      <div className='flex items-center space-x-4'>
        <img
          className='hidden md:inline h-10 w-10'
          src={songInfo?.album.images?.[0].url}
          alt=''
        />
        <div>
          <h3 className=''>{songInfo?.name}</h3>
          <p className='text-gray-500 text-xs'>
            {songInfo?.artists?.[0]?.name}
          </p>
        </div>
      </div>

      <div className='flex items-center justify-evenly'>
        <SwitchHorizontalIcon className='button' />
        <RewindIcon
          // onClick={() => spotifyApi.skipToPrevious()}
          className='button'
        />
        {isPlaying ? (
          <PauseIcon
            onClick={() => handlePlayPause()}
            className='button w-10 h-10'
          />
        ) : (
          <PlayIcon
            onClick={() => handlePlayPause()}
            className='button w-10 h-10'
          />
        )}
        <FastForwardIcon className='button' />
        <ReplyIcon className='button' />
      </div>

      <div className='flex items-center space-x-3 md:space-x-4 justify-end pr-5'>
        <VolumeDownIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className='button'
        />
        <input
          className='w-14 md:w-28'
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          type='range'
          min={0}
          max={100}
        />
        <VolumeUpIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className='button'
        />
      </div>
    </div>
  );
};

export default Player;
