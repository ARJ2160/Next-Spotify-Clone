import React, { useEffect, useState } from 'react';
import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusSmIcon,
  RssIcon,
} from '@heroicons/react/outline';
import { HeartIcon } from '@heroicons/react/solid';
import { useSession } from 'next-auth/react';
import useSpotify from '../hooks/useSpotify';
import { useRecoilState } from 'recoil';
import { playlistIdState } from '../atoms/playlistAtoms';
import { useRouter } from 'next/router';
import Link from 'next/link';

export const Sidebar = () => {
  const spotifyApi = useSpotify();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data: any) => {
        setPlaylists(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  return (
    <div className='sidebar text-gray-500 p-5 lg:text-sm text-xs border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex mb-40'>
      <div className='space-y-4'>
        <button
          onClick={() => router.push('/hero')}
          className='flex items-center space-x-2 hover:text-white'
        >
          <HomeIcon className='h-5 w-5' />
          <p>Home</p>
        </button>
        <button className='flex items-center space-x-2 hover:text-white'>
          <SearchIcon className='h-5 w-5' />
          <p>Search</p>
        </button>
        <Link href='/library'>
          <button className='flex items-center space-x-2 hover:text-white'>
            <LibraryIcon className='h-5 w-5' />
            <p>Library</p>
          </button>
        </Link>
        <hr className='border-t-[0.1px] border-gray-900' />
        <button className='flex items-center space-x-2 hover:text-white'>
          <PlusSmIcon className='h-5 w-5 rounded-sm text-black bg-white' />
          <p>Create Playlist</p>
        </button>
        <button className='flex items-center space-x-2 hover:text-white'>
          <HeartIcon className='h-5 w-5 text-blue-700' />
          <p>Liked Songs</p>
        </button>
        <button className='flex items-center space-x-2 hover:text-white'>
          <RssIcon className='h-5 w-5 text-green-500' />
          <p>Your Episodes</p>
        </button>
        <hr className='border-t-[0.1px] border-gray-900' />
        {playlists.map((playlist: any) => (
          <p
            key={playlist.id}
            onClick={() => setPlaylistId(playlist.id)}
            className='cursor-pointer hover:text-white'
          >
            {playlist.name}
          </p>
        ))}
      </div>
    </div>
  );
};
