
export interface Position {
  x: number;
  y: number;
}

export interface CardItem {
  id: number;
  imageUrl: string;
  message: string;
}

export enum AppState {
  PROPOSING = 'PROPOSING',
  ACCEPTED = 'ACCEPTED'
}
