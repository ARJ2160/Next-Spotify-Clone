import React, { useState } from 'react'
import useSpotify from "../hooks/useSpotify";

const hero = () => {
  const spotifyApi = useSpotify();
  const [playlists, setPlaylists] = useState(null)
  spotifyApi.getUserPlaylists().then((data: any) => {
    setPlaylists(data.body.items);
  });
  return (
    <div className="bg-black h-screen text-white">
      <p className="">
        Shortcuts
      </p>
    </div>
  )
}

export default hero