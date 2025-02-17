"use client"; // Enables client-side rendering for this component

import React, { useState, useRef, useEffect } from "react"; 
import {
  ForwardIcon,
  PlayIcon,
  RewindIcon,
  UploadIcon,
  PauseIcon,
  CircleFadingPlus,
  TrashIcon // Import TrashIcon from Lucide
} from "lucide-react"; 
import Image from "next/image"; 
import './AudioPlayer.css'; // Import the updated CSS file

interface AudioPlayerProps {}

interface Track {
  title: string;
  artist: string;
  src: string;
}

interface Playlist {
  name: string;
  tracks: Track[];
}

const AudioPlayer: React.FC<AudioPlayerProps> = () => {
  const [tracks, setTracks] = useState<Track[]>([]); 
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playlists, setPlaylists] = useState<Playlist[]>([]); 
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState<string>(""); 
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newTracks: Track[] = Array.from(files).map((file) => ({
        title: file.name,
        artist: "Unknown Artist",
        src: URL.createObjectURL(file),
      }));
      setTracks((prevTracks) => [...prevTracks, ...newTracks]);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex === 0 ? tracks.length - 1 : prevIndex - 1
    );
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100
      );
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = tracks[currentTrackIndex]?.src || "";
      audioRef.current.load();
      audioRef.current.currentTime = 0;
      setCurrentTime(0); 
      setProgress(0); 
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrackIndex, tracks, isPlaying]);

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      const newPlaylist: Playlist = { name: newPlaylistName, tracks: [] };
      setPlaylists((prevPlaylists) => [...prevPlaylists, newPlaylist]);
      setNewPlaylistName(""); 
    } else {
      alert("Please enter a playlist name.");
    }
  };

  const handleAddToPlaylist = () => {
    if (selectedPlaylist && tracks.length > 0) {
      const updatedPlaylist = {
        ...selectedPlaylist,
        tracks: [...selectedPlaylist.tracks, ...tracks],
      };
      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((playlist) =>
          playlist.name === selectedPlaylist.name ? updatedPlaylist : playlist
        )
      );
      setSelectedPlaylist(updatedPlaylist);
    } else {
      alert("No playlist selected or no tracks to add.");
    }
  };

  // Function to handle deleting a playlist
  const handleDeletePlaylist = (playlistName: string) => {
    setPlaylists((prevPlaylists) =>
      prevPlaylists.filter((playlist) => playlist.name !== playlistName)
    );
  };

  return (
    <div className="audio-player-container">
      <div className="audio-player-left">
        <div className="audio-player-header">
          <label className="audio-player-header-button">
            <UploadIcon />
            <span>Sube tu musica</span>
            <input type="file" accept="audio/*" multiple onChange={handleUpload} className="input"/>
          </label>
        </div>
        <div className="audio-player-main">
          <Image
            src="/music.svg"
            alt="Album Cover"
            width={120}
            height={120}
            className="audio-player-image"
          />
          <div className="audio-player-info">
            <h2>{tracks[currentTrackIndex]?.title || "Titulo pista"}</h2>
            <p>{tracks[currentTrackIndex]?.artist || "Artista"}</p>
          </div>
          <progress value={progress} max="100" className="audio-player-progress-bar"></progress>
          <div className="audio-player-progress">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="audio-player-controls">
            <button onClick={handlePrevTrack} className="audio-player-button">
              <RewindIcon />
            </button>
            <button onClick={handlePlayPause} className="audio-player-button play-pause">
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button onClick={handleNextTrack} className="audio-player-button">
              <ForwardIcon />
            </button>
            <button onClick={handleAddToPlaylist} className="audio-player-button">
              <CircleFadingPlus />
            </button>
          </div>
          <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} />
        </div>
      </div>

      <div className="audio-player-right">
        <div className="audio-player-playlist-creation">
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
          />
          <button onClick={handleCreatePlaylist}>Crear Playlist</button>
        </div>

        <div className="audio-player-playlist-list">
          {playlists.map((playlist) => (
            <div
              key={playlist.name}
              className="audio-player-playlist-item"
              onClick={() => setSelectedPlaylist(playlist)}
            >
              <h3>{playlist.name}</h3>
              {selectedPlaylist?.name === playlist.name && (
                <ul>
                  {playlist.tracks.map((track, index) => (
                    <li key={index}>{track.title}</li>
                  ))}
                </ul>
              )}
              <button
                onClick={() => handleDeletePlaylist(playlist.name)}
                className="audio-player-delete-button"
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
