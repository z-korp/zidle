import { useState, useEffect } from 'react';
import { useCharacter } from "@/hooks/useCharacter";
import { ReconnectionData } from '@/types/types';
import useAccountCustom from './useAccountCustom';
import { calculateResourceGain, formatTimePassed } from '@/utils/resource';

export const useReconnectionData = (token_id: string) => {
  const { account } = useAccountCustom();
  const [reconnectionData, setReconnectionData] = useState<ReconnectionData | null>(null);
  const { character } = useCharacter(token_id);

  useEffect(() => {
    if (character) {
      const currentMiner = character.miners.find(miner => miner.timestamp !== 0);
      if (currentMiner?.resource) {
        const { timePassed, resourcesGained } = calculateResourceGain(
          currentMiner.resource,
          character,
          character.startTimestamp
        );
        
        setReconnectionData({
          timePassed: formatTimePassed(timePassed),
          resourcesGained: [
            { name: currentMiner.resource.getName(), quantity: resourcesGained }
          ]
        });
      }
    }
  }, [character, account]);

  return reconnectionData;
};