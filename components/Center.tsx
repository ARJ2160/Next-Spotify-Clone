import { ChevronDownIcon } from '@heroicons/react/outline';
import { signOut, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { shuffle } from 'lodash';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistState, playlistIdState } from '../atoms/playlistAtoms';
import useSpotify from '../hooks/useSpotify';
import Songs from './Songs';

const colors = [
  'from-indigo-500',
  'from-blue-600',
  'from-green-500',
  'from-red-500',
  'from-yellow-500',
  'from-pink-500',
  'frmo-purple-500',
];

const Center = () => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState<any>(playlistState);

  useEffect(() => {
    setColor(shuffle(colors).pop() as any);
  }, [playlistId]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data: any) => {
        setPlaylist(data.body);
      })
      .catch((err) => console.log(err));
  }, [spotifyApi, playlistId]);

  return (
    <div className='flex flex-grow flex-col h-screen overflow-y-scroll scrollbar-hide center'>
      <header className='absolute top-5 right-8'>
        <div
          className='flex items-center bg-black space-x-1 opacity-90 hover:opacity-80 cursor-pointer rounded-full pr-4'
          onClick={() => signOut()}
        >
          <img
            className='rounded-full w-10 h-10 p-1 object-cover'
            src={session?.user?.image || undefined}
            alt=''
          />
          <span className='text-base text-white'>{session?.user?.name}</span>
          <ChevronDownIcon className='text-white h-5 w-5' />
        </div>
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8 w-full`}
      >
        <img
          src={playlist?.images?.[0]?.url}
          className='h-52 w-52 shadow-2xl'
          alt=''
        />
        <div className='flex flex-col'>
          <p>{playlist?.type.toUpperCase()}</p>
          <h1
            className={`${
              playlist?.name.length > 20
                ? `lg:text-5xl md:text-5xl lg:leading-[75px]`
                : `lg:text-8xl md:text-5xl lg:leading-[96px]`
            } text-4xl playTitle pt-1 mb-5 tracking-tighter `}
          >
            {playlist?.name.charAt(0).toUpperCase() + playlist?.name.slice(1)}
          </h1>
          <div className='flex items-center space-x-2 opacity-90 cursor-pointer p-1 pr-2'>
            <img
              className={`${
                playlist?.owner.display_name === 'XERXES' ? '' : 'hidden'
              } rounded-full w-8 h-8 object-cover`}
              src={session?.user?.image || undefined}
              alt=''
            />
            <p className='text-base'>
              {playlist?.owner.display_name === 'Spotify' ? (
                <>
                  Made for <strong>XERXES</strong>
                </>
              ) : (
                playlist?.owner.display_name
              )}
            </p>
            {playlist?.followers.total !== 0 ? <span>•</span> : null}
            <span>
              {playlist?.followers.total !== 0
                ? `${playlist?.followers.total} likes`
                : null}
            </span>
            <span>•</span>
            <p>{playlist?.tracks?.total} songs</p>
          </div>
        </div>
      </section>
      <div>
        <Songs />
      </div>
    </div>
  );
};

export default Center;
