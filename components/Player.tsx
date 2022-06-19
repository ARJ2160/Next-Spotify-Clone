import { VolumeUpIcon as VolumeDownIcon } from '@heroicons/react/outline';
import {
  RewindIcon,
  SwitchHorizontalIcon,
  PauseIcon,
  FastForwardIcon,
  PlayIcon,
  ReplyIcon,
  VolumeUpIcon,
  DesktopComputerIcon,
} from '@heroicons/react/solid';
import { debounce } from 'lodash';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify';

export const Player = () => {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentIdTrack, setCurrentIdTrack] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(100);
  const songInfo = useSongInfo() as any;
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const fetchCurrentSong = () => {
    spotifyApi.getMyCurrentPlayingTrack().then((data) => {
      setCurrentIdTrack(data.body?.item?.id as any);
      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        setIsPlaying(data.body?.is_playing);
      });
    });
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

  // const debouncedSeekTrack = useCallback(
  //   debounce(() => {
  //     spotifyApi.seek();
  //   }, 500),
  //   []
  // );

  const handleKeyPress = useCallback((event: any) => {
    if (event.keyCode === 32) {
      handlePlayPause();
    }
  }, []);

  const handleSkipPrevious = () => {
    spotifyApi.skipToPrevious();
    fetchCurrentSong();
  };

  const handleSkipNext = () => {
    spotifyApi.skipToNext();
    fetchCurrentSong();
  };

  const handleShuffle = () => {
    spotifyApi.setShuffle(!isShuffle);
    setIsShuffle(!isShuffle);
  };

  const handleRepeat = () => {
    setIsRepeat(!isRepeat);
    spotifyApi.setRepeat(isRepeat ? 'off' : 'track');
  };

  // const handelSwitchPlaybackState = (myDevices) => {

  //   spotifyApi.transferMyPlayback(deviceIds).then(
  //     function () {
  //       console.log('Transfering playback to ' + deviceIds);
  //     },
  //     function (err) {
  //       //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
  //       console.log('Something went wrong!', err);
  //     }
  //   );
  // };

  // useEffect(() => {
  //   spotifyApi
  //     .getMyDevices()
  //     .then((data) => setMyDevices({ ...data.body.devices}));
  //   console.log(myDevices);
  // }, [session, spotifyApi]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      fetchCurrentSong();
      setVolume(100);
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
    <div className='h-24 bg-gradient-to-b from-black to-gray-900 text-white text-xs md:text-base grid grid-cols-3 px-2 md:px-8 sticky bottom-0'>
      <div className='flex items-center space-x-4'>
        <div className='relative h-10 w-10'>
          <Image
            layout='fill'
            className='hidden md:inline'
            src={
              songInfo?.album?.images?.[0].url ||
              'https://ik.imagekit.io/36athv2v82c8/spotify_qV8MX8wFKBo.png?ik-sdk-version=javascript-1.4.3&updatedAt=1637078191744'
            }
            alt=''
          />
        </div>
        <div>
          <h3>{songInfo?.name}</h3>
          <p className='text-gray-500 text-xs'>
            {songInfo?.artists?.[0]?.name}
          </p>
        </div>
      </div>

      <div className='flex items-center justify-evenly'>
        <SwitchHorizontalIcon
          className={isShuffle ? 'text-green-500 button' : 'button'}
          onClick={() => handleShuffle()}
        />
        <RewindIcon onClick={() => handleSkipPrevious()} className='button' />
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
        <FastForwardIcon onClick={() => handleSkipNext()} className='button' />
        <ReplyIcon
          className={isRepeat ? 'text-green-500 button' : 'button'}
          onClick={() => handleRepeat()}
        />
      </div>

      <div className='flex items-center space-x-3 md:space-x-4 justify-end pr-5'>
        <DesktopComputerIcon className='button' />
        {/* <div className='group relative'>
          <div className='tooltip group-hover:scale-100 transition translate-x-[7.7rem]'>
            <PlaybackState myDevices={myDevices} />
          </div>
        </div> */}
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
