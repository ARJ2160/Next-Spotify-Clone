import { useSession } from 'next-auth/react';
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
      <div className='text-4xl py-5'>Shortcuts</div>
      <div className='grid grid-cols-3 gap-5'>
        {playlists &&
          playlists.slice(0, 6).map((playlist: any) => (
            <div className='w-full h-20 flex justify-start items-center bg-[#303030] rounded-md '>
              <img
                className='object-contain w-16 h-16'
                src={playlist.images[0].url}
              />
              <p className='ml-5'>{playlist.name}</p>
            </div>
          ))}
      </div>
      <div className='text-3xl py-5'>Jump Back In</div>
      <div className='grid grid-cols-6'>
        {recentlyPlayed &&
          recentlyPlayed.slice(0, 6).map((track: any, i: number) => (
            <div className='w-full h-20 flex justify-start items-center bg-[#303030] rounded-md '>
              <img
                className='object-contain w-16 h-16'
                src={track.context.track?.album.images[0].url}
              />
              <p key={i}>{track.track.name}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default hero;
