export type SongType = {
  id: string;
  name: string;
  artist: string;
  cover: string;
  audio: string;
  album: string;
  color: string[];
  active: boolean;
};

export type SongInfoType = {
  currentTime: number;
  duration: number;
};
