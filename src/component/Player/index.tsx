"use client";

import { getTracks } from "@/app/api/searchTrack";
import { useEffect, useState } from "react";
import style from "./styles.module.css";
import SpotifyPlayer from 'react-spotify-web-playback';

export default function Player() {
  const accessToken = sessionStorage.getItem("access_token");
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const fetchTracks = async () => {
    if (accessToken) {
      if (searchInput) {
        const response = await getTracks(searchInput, accessToken);
        setSearchResults(response.tracks.items.map((track: {
          name: '',
          uri: '',
          album: { name: '', images: [{ url: '' }] },
        }) => {
          return {
            name: track.name,
            uri: track.uri,
            images: track.album.images[0],
            albumName: track.album.name,
          }
        }) || {});
      }
    }
  }

  useEffect(() => {
    if (accessToken) {
      let debounced = setTimeout(async () => {
        fetchTracks();
      }, 1000);

      return () => clearTimeout(debounced);
    }
  }, [searchInput, accessToken]);

  console.log(searchResults);

  //reproducir contenido
  const [track, setTrack] = useState("");
  const currentTrack = (uri: string) =>{
    setTrack(uri);
  }
  console.log(track)
  

  return (
    <>
      <div className={` py-2 px-8`}>
        <input
          type="search"
          className={`${style.search} p-4 focus:outline-none w-full `}
          placeholder="Buscador de musica"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      <div className={style.grid}>
        {searchResults.map((track: { name: string, images: { url: string }, uri: string }) => {
          return (
            <div className={style.inner} key={track.uri} onClick={() => currentTrack(track.uri)}>
              <img className={style.trackImage} src={track.images.url} alt={track.name} />
              <p>{track.name}</p>
            </div>
          );
        })}
      </div>
      <div className={style.spotifyPlayer}>
        {accessToken ?(
          <SpotifyPlayer
          play
          token={accessToken}
          uris={[track]}
        />
        ): (<></>)

        }
      </div>
    </>
  );
}