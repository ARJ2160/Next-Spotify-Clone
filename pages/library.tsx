import { ChevronDownIcon } from '@heroicons/react/outline';
import { BookmarkIcon, PlayIcon } from '@heroicons/react/solid';
import { signOut, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { playlistIdState } from '../atoms/playlistAtoms';
import useSpotify from '../hooks/useSpotify';
import { Player } from '../components/index';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

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
    <div className='h-screen overflow-y-scroll bg-black text-white library pr-7'>
      <div className='flex justify-start items-center my-7'>
        <Link href='/'>
          <p className='libraryButton'>Playlists</p>
        </Link>
        <Link href='/hero'>
          <p className='libraryButton'>Home</p>
        </Link>
        <button className='libraryButton' onClick={() => signOut()}>
          Logout
        </button>
      </div>
      <div className='flex flex-col flex-grow space-x-7'>
        <header className='absolute top-8 right-8'>
          <div className='flex items-center opacity-90 hover:opacity-70 cursor-pointer rounded-full pr-4'>
            <div className='relative w-10 h-10'>
              <Image
                layout='fill'
                className='rounded-full object-cover p-1'
                src={
                  session?.user?.image ||
                  'https://ik.imagekit.io/36athv2v82c8/spotify_qV8MX8wFKBo.png?ik-sdk-version=javascript-1.4.3&updatedAt=1637078191744'
                }
                alt=''
              />
            </div>
            <span className='text-base'>{session?.user?.name}</span>
            <ChevronDownIcon className='h-5 w-5' />
          </div>
        </header>
        <div className='ml-8 mb-10 text-4xl'>Playlists</div>
        <div className='grid grid-cols-6 gap-5'>
          <div className='card h-60 w-full row-span-2 col-span-2 rounded-md flex justify-center items-center'>
            <div className='text-3xl'>Liked Songs</div>
          </div>
          <div className='h-60 rounded-md flex flex-col justify-evenly items-center ml-0 bg-[#181818]'>
            <div className='bg-green-700 w-36 h-36 flex justify-center items-center rounded-md'>
              <BookmarkIcon className='w-20 h-20 text-[#1ED760]' />
            </div>
            <div className='mr-10'>
              <p>Your Episodes</p>
              <p className='text-gray-500'>9 episodes</p>
            </div>
          </div>
          <>
            {playlists.slice(0, 3).map((playlist: any) => (
              <div
                key={playlist.id}
                onClick={() => handlePlaylistClick(playlist.id)}
                className='group relative col-span-1 h-60 rounded-md flex flex-col justify-evenly cursor-pointer items-center bg-[#181818]'
              >
                <div className='relative w-36 h-36'>
                  <Image
                    layout='fill'
                    className='rounded-sm'
                    src={playlist.images[0].url}
                    alt=''
                  />
                </div>
                <div className='flex flex-col items-center justify-start'>
                  <p className='w-36 truncate'>{playlist.name}</p>
                  <p className='w-36 truncate text-gray-500'>
                    By {playlist.owner.display_name}
                  </p>
                  <PlayIcon className='group-hover:scale-100 libraryPlayButton text-green-500' />
                </div>
              </div>
            ))}
          </>
        </div>
        <div className='grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-4 pb-10 cursor-pointer'>
          {playlists.slice(3).map((playlist: any) => (
            <div
              key={playlist.id}
              onClick={() => handlePlaylistClick(playlist.id)}
              className='group relative h-60 rounded-md flex flex-col justify-evenly items-center bg-[#181818]'
            >
              <div className='relative w-36 h-36'>
                <Image
                  layout='fill'
                  className='rounded-sm'
                  src={playlist.images[0].url}
                  alt=''
                />
              </div>
              <div className='flex flex-col items-center justify-start'>
                <p className='w-36 truncate'>{playlist.name}</p>
                <p className='w-36 truncate text-gray-500'>
                  By {playlist.owner.display_name}
                </p>
                <PlayIcon className='group-hover:scale-100 libraryPlayButton text-green-500' />
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
