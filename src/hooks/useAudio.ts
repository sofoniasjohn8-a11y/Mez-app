/**
 * useAudio — manages download, offline storage, and playback for a mezmur.
 * Uses expo-audio which is included in Expo Go (SDK 58).
 *
 * Files stored at: <documentDirectory>/mezmur_audio/<id>.mp3
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import * as FileSystem from 'expo-file-system/legacy';

// ── Audio map ─────────────────────────────────────────────────────────────────
// Add a line here each time you upload a new audio file to Google Drive.
// Format: mezmurId: 'https://drive.usercontent.google.com/download?id=FILE_ID&export=download'
const AUDIO_MAP: Record<number, string> = {
  16: 'https://drive.usercontent.google.com/download?id=1CbVKxPwliK7WcOaiDnOIIs4irDYbrQKd&export=download',
};

export function hasAudio(id: number): boolean {
  return id in AUDIO_MAP;
}

// ── Storage helpers ───────────────────────────────────────────────────────────
const AUDIO_DIR = (FileSystem.documentDirectory ?? '') + 'mezmur_audio/';

function localUri(id: number) { return AUDIO_DIR + id + '.mp3'; }

async function ensureDir() {
  const info = await FileSystem.getInfoAsync(AUDIO_DIR);
  if (!info.exists) await FileSystem.makeDirectoryAsync(AUDIO_DIR, { intermediates: true });
}

// ── Types ─────────────────────────────────────────────────────────────────────
export type DownloadStatus = 'not_downloaded' | 'downloading' | 'downloaded' | 'error';

export function formatTime(ms: number): string {
  if (!ms || ms < 0) return '0:00';
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useAudio(mezmurId: number) {
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>('not_downloaded');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localFile, setLocalFile] = useState<string | null>(null);

  const downloadRef = useRef<FileSystem.DownloadResumable | null>(null);

  // Create player — it will be loaded with the local URI once downloaded
  const player = useAudioPlayer(localFile ? { uri: localFile } : null);
  const status = useAudioPlayerStatus(player);

  // Check if already downloaded on mount
  useEffect(() => {
    (async () => {
      await ensureDir();
      const uri = localUri(mezmurId);
      const info = await FileSystem.getInfoAsync(uri);
      if (info.exists && (info as any).size > 0) {
        setLocalFile(uri);
        setDownloadStatus('downloaded');
      }
    })();
    return () => {
      player.remove();
    };
  }, [mezmurId]);

  // ── Download ────────────────────────────────────────────────────────────────
  const download = useCallback(async () => {
    setDownloadStatus('downloading');
    setDownloadProgress(0);
    setErrorMessage(null);
    try {
      await ensureDir();
      const uri = localUri(mezmurId);
      const url = AUDIO_MAP[mezmurId];

      const resumable = FileSystem.createDownloadResumable(
        url, uri, {},
        (p) => {
          const pct = p.totalBytesExpectedToWrite > 0
            ? p.totalBytesWritten / p.totalBytesExpectedToWrite
            : 0;
          setDownloadProgress(pct);
        }
      );
      downloadRef.current = resumable;
      const result = await resumable.downloadAsync();

      if (result?.status === 200 || result?.status === 206) {
        setLocalFile(uri);
        setDownloadStatus('downloaded');
        setDownloadProgress(1);
      } else {
        throw new Error('HTTP ' + (result?.status ?? 'unknown'));
      }
    } catch (e: any) {
      await FileSystem.deleteAsync(localUri(mezmurId), { idempotent: true }).catch(() => {});
      setDownloadStatus('error');
      setDownloadProgress(0);
      setErrorMessage(e?.message ?? 'Download failed');
    }
  }, [mezmurId]);

  const cancelDownload = useCallback(async () => {
    await downloadRef.current?.cancelAsync().catch(() => {});
    downloadRef.current = null;
    await FileSystem.deleteAsync(localUri(mezmurId), { idempotent: true }).catch(() => {});
    setDownloadStatus('not_downloaded');
    setDownloadProgress(0);
  }, [mezmurId]);

  const deleteAudio = useCallback(async () => {
    player.pause();
    await FileSystem.deleteAsync(localUri(mezmurId), { idempotent: true }).catch(() => {});
    setLocalFile(null);
    setDownloadStatus('not_downloaded');
    setDownloadProgress(0);
  }, [mezmurId, player]);

  // ── Playback ─────────────────────────────────────────────────────────────────
  const play = useCallback(async () => {
    await setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: true });
    player.play();
  }, [player]);

  const pause = useCallback(() => { player.pause(); }, [player]);

  const seekTo = useCallback((ms: number) => {
    player.seekTo(ms / 1000);
  }, [player]);

  return {
    downloadStatus,
    downloadProgress,
    errorMessage,
    isPlaying: status.playing,
    isLoading: !status.isLoaded && downloadStatus === 'downloaded',
    positionMs: (status.currentTime ?? 0) * 1000,
    durationMs: (status.duration ?? 0) * 1000,
    download,
    cancelDownload,
    deleteAudio,
    play,
    pause,
    seekTo,
  };
}
