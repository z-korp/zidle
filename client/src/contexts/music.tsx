import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import useSound from "use-sound";
import { useTheme } from "@/ui/elements/theme-provider";

type Track = {
  name: string;
  url: string;
};

const MusicPlayerContext = createContext({
  isPlaying: false,
  volume: 0.2,
  setVolume: (volume: number) => {
    volume;
  },
  setTheme: (theme: boolean) => {
    theme;
  },
});

export const MusicPlayerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { themeTemplate } = useTheme();
  const soundAssets = null; //SoundAssets(themeTemplate);

  /*const menuTracks: Track[] = [
    { name: "Intro", url: soundAssets.jungle2 },
    { name: "Intro", url: soundAssets.jungle2 },
  ];

  const playTracks: Track[] = [
    { name: "Play", url: soundAssets.jungle3 },
    { name: "Play", url: soundAssets.jungle3 },
  ];

  const effectTracks: Track[] = [
    { name: "Start", url: soundAssets.start },
    { name: "Start", url: soundAssets.start },
    { name: "Over", url: soundAssets.over },
  ];*/

  /*const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentEffectIndex, setCurrentEffectIndex] = useState(0);
  const [tracks, setTracks] = useState(menuTracks);
  const [theme, setTheme] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2);

  const goToNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => {
      return (prevIndex + 1) % tracks.length;
    });
  };

  const playStart = useCallback(() => {
    setCurrentEffectIndex(1);
  }, []);

  const playOver = useCallback(() => {
    setCurrentEffectIndex(2);
  }, []);

  const [playTheme, { stop: stopTheme }] = useSound(
    tracks[currentTrackIndex].url,
    {
      volume,
      onplay: () => setIsPlaying(true),
      onstop: () => setIsPlaying(false),
      onend: () => {
        setIsPlaying(false);
        goToNextTrack();
      },
    },
  );

  const [playEffect, { stop: stopEffect }] = useSound(
    effectTracks[currentEffectIndex].url,
    {
      volume,
    },
  );

  useEffect(() => {
    playTheme();
    return () => stopTheme();
  }, [currentTrackIndex, playTheme, stopTheme]);

  useEffect(() => {
    if (currentEffectIndex === 0) return;
    playEffect();
    return () => stopEffect();
  }, [currentEffectIndex, playEffect, stopEffect]);

  useEffect(() => {
    setTracks(theme ? menuTracks : playTracks);
    setCurrentTrackIndex(0);
  }, [theme, themeTemplate]);*/

  return <></>;
};

export const useMusicPlayer = () => {
  return useContext(MusicPlayerContext);
};
