import { ChevronDownIcon } from '@heroicons/react/outline';
import { PlayIcon } from '@heroicons/react/solid';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { playlistIdState } from '../atoms/playlistAtoms';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import { Player } from '../components';
import useSpotify from '../hooks/useSpotify';

const hero = () => {
  const spotifyApi = useSpotify();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  const [currentStateId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = (uri: any) => {
    setCurrentTrackId(uri);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [uri],
    });
  };

  const handlePlaylistClick = (id: string) => {
    router.push('/');
    setPlaylistId(id);
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getMyRecentlyPlayedTracks().then((data: any) => {
        setRecentlyPlayed(data.body.items);
      });
      spotifyApi.getUserPlaylists().then((data: any) => {
        setPlaylists(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  return (
    <div className='hero bg-black h-screen text-white overflow-y-scroll'>
      <div className='px-7'>
        <header className='absolute top-8 z-10 right-8'>
          <div className='flex bg-black items-center opacity-90 hover:opacity-70 cursor-pointer rounded-full pr-4'>
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
            playlists.slice(0, 6).map((playlist: any, i: number) => (
              <div
                onClick={() => handlePlaylistClick(playlist.id)}
                key={i}
                className='w-full h-32 flex justify-start items-center bg-[#303030] rounded-md cursor-pointer'
              >
                <div className='relative h-32 aspect-square'>
                  <Image
                    layout='fill'
                    className='rounded-sm'
                    src={playlist.images[0].url}
                    alt=''
                  />
                </div>
                <p className='w-3/4 truncate ml-5 pr-4'>{playlist.name}</p>
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
                  onClick={() => playSong(track.track.uri)}
                  key={i}
                  className='h-52 flex flex-col relative group justify-evenly items-center bg-[#303030] rounded-md  cursor-pointer'
                >
                  <div className='relative w-36 h-36 shadow-2xl'>
                    <Image
                      layout='fill'
                      className='rounded-sm'
                      src={album.images[0].url}
                      alt=''
                    />
                  </div>
                  <p className='w-40 truncate ml-1'>{name}</p>
                  <PlayIcon className='group-hover:scale-100 playButton text-green-500' />
                </div>
              );
            })}
        </div>
      </div>
      <Player />
    </div>
  );
};

export default hero;
