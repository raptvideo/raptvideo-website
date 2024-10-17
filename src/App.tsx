import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import VideoPlayer from './components/VideoPlayer';
import Player from 'video.js/dist/types/player';
import SceneDescription from "./components/SceneDescription";
import { Scene, fetchAndCombineScenes } from './sceneservices'; 
import './App.css';
  
  const App: React.FC = () => {
    const dashSource = 'https://demo.raptvideo.com/TearsOfSteel/manifest/dash.mpd';
    const dashMimeType = 'application/dash+xml';

    const hlsSource = 'https://demo.raptvideo.com/TearsOfSteel/manifest/master.m3u8';
    const hlsMimeType = 'application/x-mpegURL';

    const poster = 'https://demo.raptvideo.com/TearsOfSteel/poster/TearsOfSteelPoster.png';
    const summary = 'https://demo.raptvideo.com/TearsOfSteel/summary/summary.txt';
  
    const playerRef = React.useRef<Player | null>(null);  

    const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);

    const isMac = () => /Macintosh|MacIntel|MacPPC|Mac68K/.test(navigator.platform);
    
    var source = dashSource;
    var mimeType = dashMimeType;

    if (isIOS() || isMac()) {
      source = hlsSource;
      mimeType = hlsMimeType;
    }

    const videoJsOptions = React.useMemo(() => ({
      enableSourceset: true,
      autoplay: false,
      controls: true,
      responsive: true,
      fluid: true,
      poster: poster || null,
      playsinline: true,
      html5: {
        nativeTextTracks: true
      },
      sources: [{
        src: source,
        type: mimeType
      }]
    }), [dashSource, mimeType]); 
  
    const handlePlayerReady = (player: Player) => {
      playerRef.current = player;
  
      // You can handle player events here, for example:
      player.on('waiting', () => {
        console.log('player is waiting');
      });
  
      player.on('dispose', () => {
        console.log('player will dispose');
      });
    };
  
    const [title, setTitle] = useState<string>("");
    const [scenes, setScenes] = useState<Scene[]>([]);
    const [currentDescription, setCurrentDescription] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
  
    React. useEffect(() => {
      const fetchData = async () => {
        try {
          setCurrentDescription("Loading");
          const combinedScenes = await fetchAndCombineScenes();
          setScenes(combinedScenes);
          setTitle('Summary by RaptVideo');
          const descriptionResponse = await fetch(summary);
          const descriptionText = await descriptionResponse.text();
          setCurrentDescription(descriptionText);
        } catch (err) {
          setError('Failed to load scene data');
        }
      };
      
      setCurrentDescription("Loading");

      fetchData();
    }, []);
  
    const handleTimeUpdate = useCallback((currentTime: number) => {
      console.log('Current time:' + currentTime)
      
      const currentScene = scenes.find((scene) => {
        return currentTime >= scene.start && currentTime < scene.end;
      });
  
      if (currentScene) {
        setTitle('Scene description by RaptVideo');
        setCurrentDescription(currentScene.description);
      }
    }, [scenes]);
    
    if (error) {
      return <div>Error loading scenes: {error}</div>;
    }
  
    return (
      <div className="app">
        <Header />
        <MainContent />
        <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} onTimeUpdate={handleTimeUpdate}/>
        <SceneDescription title={title} description={currentDescription} />
        <Footer />
      </div>
    );
  }
  
  export default App;