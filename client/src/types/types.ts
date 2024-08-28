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

export interface ReconnectionData {
  timePassed: string;
  resourcesGained: { name: string; quantity: number }[];
}
