import { ChevronDownIcon } from '@heroicons/react/outline';
import { BookmarkIcon } from '@heroicons/react/solid';
import { signOut, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { playlistIdState } from '../atoms/playlistAtoms';
import useSpotify from '../hooks/useSpotify';
import Player from '../components/Player';
import { useRouter } from 'next/router';

const library = () => {
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

  const handlePlaylistClick = (id: string) => {
    router.push('/');
    setPlaylistId(id);
  };

  return (
    <div className='h-screen overflow-y-scroll scrollbar-hide bg-black text-white library'>
      <div className='flex justify-start items-center my-7'>
        <button className='libraryButton' onClick={() => router.push('/')}>
          Home
        </button>
        <button className='libraryButton' onClick={() => signOut()}>
          Logout
        </button>
      </div>
      <div className='flex flex-col flex-grow space-x-7'>
        <header className='absolute top-8 right-8'>
          <div className='flex items-center space-x-1 opacity-90 hover:opacity-70 cursor-pointer rounded-full pr-4'>
            <img
              className='rounded-full w-10 h-10 object-cover'
              src={session?.user?.image || undefined}
              alt=''
            />
            <span className='text-base'>{session?.user?.name}</span>
            <ChevronDownIcon className='h-5 w-5' />
          </div>
        </header>
        <div className='ml-8 mb-10 text-4xl'>Playlists</div>
        <div className='flex flex-col md:flex-row'>
          <div className='justify-start'>
            <div className='card h-60 md:w-[20rem] w-4/5 rounded-md flex justify-center items-center'>
              <div className='text-3xl'>Liked Songs</div>
            </div>
          </div>
          <div className='h-60 w-52 rounded-md flex flex-col md:mt-0 mt-10 justify-evenly items-center ml-0 md:ml-10 bg-[#181818]'>
            <div className='bg-green-700 w-36 h-36 flex justify-center items-center rounded-md'>
              <BookmarkIcon className='w-20 h-20 text-[#1ED760]' />
            </div>
            <div className='mr-10'>
              <p>Your Episodes</p>
              <p className='text-gray-500'>9 episodes</p>
            </div>
          </div>
        </div>
        <div className='grid lg:grid-cols-5  md:grid-cols-3 grid-cols-2 gap-4 mt-10 cursor-pointer'>
          {playlists.map((playlist: any) => (
            <div
              key={playlist.id}
              onClick={() => handlePlaylistClick(playlist.id)}
              className='h-60 w-56 mr-5 my-2 rounded-md flex flex-col justify-evenly items-center bg-[#181818]'
            >
              <img
                className='w-36 h-36 rounded-sm'
                src={playlist.images[0].url}
                alt=''
              />
              <div className='flex flex-col items-center justify-start'>
                <p className='w-36 truncate'>{playlist.name}</p>
                <p className='w-36 truncate text-gray-500'>
                  Made by {playlist.owner.display_name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Player />
    </div>
  );
};

export default library;
