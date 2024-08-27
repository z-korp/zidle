export interface Cell {
  id: string;
  pieceId: number | null;
  isStart: boolean;
  pieceIndex: number | null;
}

export interface Piece {
  id: number;
  width: number;
  element: string;
}

export interface Character {
  id: string;
  name: string;
  playerXp: number;
  health: number;
  woodCut: number;
  attack: number;
  rockMine: number;
  critical: number;
  forging: number;
  woodProgress: number;
  rockProgress: number;
  forgeProgress: number;
}

export interface ReconnectionData {
  timePassed: string;
  resourcesGained: { name: string; quantity: number }[];
}
