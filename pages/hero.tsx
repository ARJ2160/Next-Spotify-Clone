import { ChevronDownIcon } from '@heroicons/react/outline';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import useSpotify from '../hooks/useSpotify';

const hero = () => {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getMyRecentlyPlayedTracks().then((data: any) => {
        setRecentlyPlayed(data.body.items);
      });
      spotifyApi.getUserPlaylists().then((data: any) => {
        setPlaylists(data.body.items);
      });
    }
    console.log(recentlyPlayed);
  }, [session, spotifyApi]);

  return (
    <div className='hero bg-black h-screen text-white p-10 overflow-y-scroll scrollbar-hide'>
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
      <div className='flex justify-start items-center my-5'>
        <Link href='/'>
          <p className='libraryButton ml-0'>Home</p>
        </Link>
        <Link href='/library'>
          <p className='libraryButton'>Library</p>
        </Link>
        <button className='libraryButton' onClick={() => signOut()}>
          Logout
        </button>
      </div>
      <div className='text-4xl py-5'>Shortcuts</div>
      <div className='grid grid-cols-3 gap-5'>
        {playlists &&
          playlists.slice(0, 6).map((playlist: any) => (
            <div className='w-full h-32 flex justify-start items-center bg-[#303030] rounded-md'>
              <div className='relative h-32 aspect-square'>
                <Image
                  layout='fill'
                  className='rounded-sm'
                  src={playlist.images[0].url}
                  alt=''
                />
              </div>
              <p className='w-3/4 truncate ml-5'>{playlist.name}</p>
            </div>
          ))}
      </div>
      <div className='text-3xl py-5'>Jump Back In</div>
      <div className='grid grid-cols-6 gap-5'>
        {recentlyPlayed &&
          recentlyPlayed.map((track: any, i: number) => {
            const {
              track: { album, name },
            } = track;
            return (
              <div
                key={i}
                className='h-52 flex flex-col justify-evenly items-center bg-[#303030] rounded-md '
              >
                <div className='relative w-36 h-36'>
                  <Image
                    layout='fill'
                    className='rounded-sm'
                    src={album.images[0].url}
                    alt=''
                  />
                </div>
                <p className='w-40 truncate ml-1'>{name}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default hero;
