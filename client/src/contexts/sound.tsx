import { usePlayer } from "@/hooks/usePlayer";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useMusicPlayer } from "./music";
import useAccountCustom from "@/hooks/useAccountCustom";

const SoundPlayerContext = createContext({});

export const SoundPlayerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { setTheme } = useMusicPlayer();
  const [over, setOver] = useState(false);
  const [start, setStart] = useState(false);

  const { account } = useAccountCustom();

  return (
    <SoundPlayerContext.Provider value={{}}>
      {children}
    </SoundPlayerContext.Provider>
  );
};

export const useSoundPlayer = () => {
  return useContext(SoundPlayerContext);
};
