'use client';
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Upload } from 'lucide-react';

const VideoPlayer = () => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setVideoSrc(fileUrl);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipBack = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, videoRef.current.duration);
    }
  };

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(event.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = (newProgress / 100) * videoRef.current.duration;
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const updateProgress = () => {
        if (video.duration) {
          setProgress((video.currentTime / video.duration) * 100);
        }
      };

      video.addEventListener('timeupdate', updateProgress);

      return () => {
        video.removeEventListener('timeupdate', updateProgress);
      };
    }
  }, []);

  useEffect(() => {
    // Set initial progress if video is loaded and ready
    if (videoRef.current && videoSrc) {
      videoRef.current.addEventListener('loadedmetadata', () => {
        setProgress(0); // Resets progress when a new video is loaded
      });
    }
  }, [videoSrc]);

  return (
    <div className="flex flex-col items-center relative h-screen" style={{ height: '100vh' }}>
      {videoSrc ? (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          style={{
            width: '100%',
            height: '86vh',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      ) : (
        <p className="text-gray-500">Selecciona un video para reproducir</p>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          padding: '8px',
          backgroundColor: '#121212',
          color: 'white',
          alignItems: 'center'
        }}
      >
        {/* Barra de progreso */}
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          disabled={!videoSrc} // Desactiva la barra si no hay video
          style={{
            width: '90%',
            margin: '10px 0',
            cursor: videoSrc ? 'pointer' : 'not-allowed',
          }}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            color: 'white',
          }}
        >
          <label style={{ cursor: 'pointer' }}>
            <Upload />
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              style={{
                display: 'none',
              }}
            />
          </label>
          <button
            style={{
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={skipBack}
          >
            <SkipBack size={24} />
          </button>

          <button
            style={{
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          <button
            style={{
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={skipForward}
          >
            <SkipForward size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
