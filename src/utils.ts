import { SongType } from "./types/models";

export function prettifyString(str: string): string {
  let prettified = str.replace(/[^a-zA-Z0-9]+/g, "-");
  prettified = prettified.replace(/-+/g, "-");
  prettified = prettified.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
  return prettified.trim();
}

export function getAudioSrc(song: SongType) {
  const parts = song.audio.split("/");
  const lastPart = parts[parts.length - 1].split("?");
  lastPart[0] = encodeURIComponent(lastPart[0]);
  parts[parts.length - 1] = lastPart.join("?");
  return parts.join("/");
}

export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}
