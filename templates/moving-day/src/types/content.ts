export interface Room {
  id: string;
  name: string;
  short: string;
  icon: string;
  volume: number;
  description: string;
}

export interface Van {
  id: string;
  name: string;
  maxVolume: number;
  label: string;
  note: string;
}

export type RoomCounts = Record<string, number>;
