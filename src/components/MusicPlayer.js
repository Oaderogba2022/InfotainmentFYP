import React, { useState, useRef, useEffect } from 'react';
import { FaBackward, FaPlay, FaPause, FaForward, FaVolumeDown, FaVolumeUp } from 'react-icons/fa';
import '../styles/MusicPlayer.css';

const musicFiles = [
  { title: 'Dave Starlight', src: '/Dave.mp3', image: '/Dave.jpeg' },
  { title: 'Journey Dont Stop Believin', src: '/Journey.mp3', image: '/journey.jpg' },
  { title: 'Eugy x Mr Eazi Dance For Me', src: 'Eugy.mp3', image: 'Eugy.jpeg' },
  { title: 'Michael Jackson Billie Jean', src: '/BillieJean.mp3', image: '/Thriller.png' },
  { title: 'Wiz Khalifa Charlie Puth See You Again', src: '/ff7.mp3', image: 'ff7.jpeg' },
  { title: 'Oxlade Ku Lo Sa', src: '/kulosa.mp3', image: '/oxlade.jpeg' },
  { title: 'Joé Dwèt Filé & Burna Boy- 4 Kampe II', src: '/Kampe.mp3', image: '/kampee.png' },
  { title: 'Michael Jackson Man In The Mirror', src: '/ManintheMirror.mp3', image: '/MichaelJackson.jpg' },
];

function MusicPlayer({ gesture }) {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [lastGesture, setLastGesture] = useState('Unknown');
  const [canTriggerOpenHand, setCanTriggerOpenHand] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    audio.src = musicFiles[currentSongIndex].src;
    if (isPlaying) {
      audio.play().catch(err => console.error('Play error:', err));
    } else {
      audio.pause();
    }
  }, [currentSongIndex, isPlaying]);

  // Effect for volume changes
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    audio.volume = volume / 100;
  }, [volume]);

  // Event listeners for voice commands
  useEffect(() => {
    const handleVolumeUp = () => setVolume(prev => Math.min(prev + 10, 100));
    const handleStopMusic = () => setIsPlaying(false);
    const handlePlayMusic = () => setIsPlaying(true);
    const handleTogglePlay = () => setIsPlaying(prev => !prev);
    const handleNextSong = () => {
      setCurrentSongIndex((prev) => (prev + 1) % musicFiles.length);
      audioRef.current.currentTime = 0; // Restart song
      setIsPlaying(true);
    };
    const handlePrevSong = () => {
      setCurrentSongIndex((prev) => (prev - 1 + musicFiles.length) % musicFiles.length);
      setIsPlaying(true);
    };

    window.addEventListener('volumeUp', handleVolumeUp);
    window.addEventListener('stopMusic', handleStopMusic);
    window.addEventListener('playMusic', handlePlayMusic);
    window.addEventListener('togglePlay', handleTogglePlay);
    window.addEventListener('nextSong', handleNextSong);
    window.addEventListener('prevSong', handlePrevSong);

    return () => {
      window.removeEventListener('volumeUp', handleVolumeUp);
      window.removeEventListener('stopMusic', handleStopMusic);
      window.removeEventListener('playMusic', handlePlayMusic);
      window.removeEventListener('togglePlay', handleTogglePlay);
      window.removeEventListener('nextSong', handleNextSong);
      window.removeEventListener('prevSong', handlePrevSong);
    };
  }, []);

  const togglePlay = () => setIsPlaying(prev => !prev);

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % musicFiles.length);
    setIsPlaying(true);
  };

  const prevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + musicFiles.length) % musicFiles.length);
    setIsPlaying(true);
  };

  const volumeUp = () => setVolume(prev => Math.min(prev + 10, 100));
  const volumeDown = () => setVolume(prev => Math.max(prev - 10, 0));

  
  useEffect(() => {
    if (!gesture || gesture === lastGesture || !canTriggerOpenHand) return;

    switch (gesture) {
      case 'Thumbs Up':
        volumeUp();
        break;
      case 'Fist':
        setIsPlaying(false);
        console.log('Fist detected: Music stopped');
        break;
      case 'Peace Sign':
        setIsPlaying(true);
        break;
      case 'Pointing':
        togglePlay();
        break;
      case 'Open Hand':
        if (lastGesture !== 'Open Hand') {
          nextSong();
          audioRef.current.currentTime = 0;
          setCanTriggerOpenHand(false);
          setTimeout(() => setCanTriggerOpenHand(true), 1000);
        }
        break;
      case 'OK Sign':
        prevSong();
        break;
      default:
        break;
    }
    setLastGesture(gesture);
  }, [gesture, canTriggerOpenHand, lastGesture]); 

  useEffect(() => {
    if (gesture === 'Unknown') {
      setCanTriggerOpenHand(true);
    }
  }, [gesture]);

  return (
    <div className="music-player">
      <div className="control-card">
        <img src={musicFiles[currentSongIndex].image} alt={musicFiles[currentSongIndex].title} className="song-image" />
        <h3 className="song-title">{musicFiles[currentSongIndex].title}</h3>
        <audio ref={audioRef} />
        <div className="music-controls">
          <button onClick={prevSong}><FaBackward /></button>
          <button onClick={togglePlay}>{isPlaying ? <FaPause /> : <FaPlay />}</button>
          <button onClick={nextSong}><FaForward /></button>
        </div>
        <div className="volume-controls">
          <button onClick={volumeDown}><FaVolumeDown /></button>
          <span>Volume: {volume}%</span>
          <button onClick={volumeUp}><FaVolumeUp /></button>
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;