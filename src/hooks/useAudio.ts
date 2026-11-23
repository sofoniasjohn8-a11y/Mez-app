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
  // አባታችን — መጋቤ ስብሐት ዓለሙ አጋ
  16: 'https://drive.usercontent.google.com/download?id=1imJzUkLxxgMjFmsteQ0k3EJ9IIFo6tJT&export=download',
  // እስመ አንተ — መጋቤ ስብሐት ዓለሙ አጋ
  17: 'https://drive.usercontent.google.com/download?id=1LT1Cp_CMPP6IpVixqJ2MztiHx81IjHpq&export=download',
  // ሰላም ለኪ ቁ ፩ — መጋቤ ስብሐት ዓለሙ አጋ
  18: 'https://drive.usercontent.google.com/download?id=1Vodnc6LxxJXMXQKRxZ1xyONCbusFfNRi&export=download',
  // ሰላም ለኪ ቁ ፪ — መጋቤ ስብሐት ዓለሙ አጋ
  19: 'https://drive.usercontent.google.com/download?id=1mYzkCa13goU47_AsLXCtLt9jr9dcGlpz&export=download',
  // ይበላሃላ ቁ ፩ — መጋቤ ስብሐት ዓለሙ አጋ
  20: 'https://drive.usercontent.google.com/download?id=1ofrvZHRbk9cvaosxjao1Yn1D8bKLqu9l&export=download',
  // ይበላሃላ ቁ ፪ — መጋቤ ስብሐት ዓለሙ አጋ
  21: 'https://drive.usercontent.google.com/download?id=1e3IMkVnxLCRwmS1e5VC4rGapFcRGrykf&export=download',
  // አባ ግራኝ ሞተ ቁ ፩ — መጋቤ ስብሐት ዓለሙ አጋ
  22: 'https://drive.usercontent.google.com/download?id=1XVGln-ljpUqEgxSsd1AhVySaauB0NJpT&export=download',
  // አባ ግራኝ ሞተ ቁ ፫ — መጋቤ ስብሐት ዓለሙ አጋ
  24: 'https://drive.usercontent.google.com/download?id=10QDQkOzcYNrv-WzOMy_Kz-kzSH7LER4H&export=download',
  // ማን ይመራመር ቁ ፩ — መጋቤ ስብሐት ዓለሙ አጋ
  25: 'https://drive.usercontent.google.com/download?id=1Ez44pooe1IEskaJOOPiwjNE9oU471Kv3&export=download',
  // ማን ይመራመር ቁ ፪ — መጋቤ ስብሐት ዓለሙ አጋ
  26: 'https://drive.usercontent.google.com/download?id=17lwcc-c8LvfsHolwH8QVBH_MvXx6Km1h&export=download',
  // የበገና አካላት — መጋቤ ስብሐት ዓለሙ አጋ
  27: 'https://drive.usercontent.google.com/download?id=12qLQViqG02gz2bQoe_gd6FRpD3f6c5p9&export=download',
  // እራሴን አሞኝ — መጋቤ ስብሐት ዓለሙ አጋ
  29: 'https://drive.usercontent.google.com/download?id=1m5djilRgLnQV2QPdy9RQNahp68rHCt3m&export=download',
  // ዓለም ማረፊያ ናት — መጋቤ ስብሐት ዓለሙ አጋ
  30: 'https://drive.usercontent.google.com/download?id=1Qb5j_BqtiN7rEXOjSN8y09G16h7gozmP&export=download',
  // አላየንም በሉ — መጋቤ ስብሐት ዓለሙ አጋ
  31: 'https://drive.usercontent.google.com/download?id=1keVjE4S-Tn15jE0dYlEnrDZ3fE1vFo2q&export=download',
  // ወንድሜ ጠፍቶ — መጋቤ ስብሐት ዓለሙ አጋ
  32: 'https://drive.usercontent.google.com/download?id=1f-xs4vQwbQOGCJ92IkXW9UU5obf3j9x0&export=download',
  // ርግብና ዋኔን ቁ ፩ — ዘማሪ ታፈሰ ተስፋዬ
  58: 'https://drive.usercontent.google.com/download?id=14cVBF5-2y8BifcgNgL75_cwcl3Gicn4X&export=download',
  // ወዳጄ ወዳጄ ቁ ፩ — ዘማሪ ታፈሰ ተስፋዬ
  61: 'https://drive.usercontent.google.com/download?id=1fi4M5sTSMkbk1tuRcJe0pYoPLlPFATF_&export=download',
  // እስመ አንተ — ዘማሪ ታፈሰ ተስፋዬ
  64: 'https://drive.usercontent.google.com/download?id=1EDj62LtwOWJ4S07RaguKWqc3ZBRwktVJ&export=download',
  // ገብረ መንፈስ ቅዱስ — ዘማሪ ታፈሰ ተስፋዬ
  65: 'https://drive.usercontent.google.com/download?id=1Yyqz-TUegEtnKNjnVJkF3KjTZgqFrZ53&export=download',
  // አየሁኝ በሕልሜ — ዘማሪ ታፈሰ ተስፋዬ
  67: 'https://drive.usercontent.google.com/download?id=1endxxvjhrXMYQFmr1TqDWjMylWgLw1Ic&export=download',
  // ስለ ሥነ ፍጥረት — ዘማሪ ታፈሰ ተስፋዬ
  69: 'https://drive.usercontent.google.com/download?id=1C4nscBbGQSkub0MQzMzsRwb3pj_y5H61&export=download',
  // ስለ ልደት — ዘማሪ ታፈሰ ተስፋዬ
  70: 'https://drive.usercontent.google.com/download?id=151STO8zbx7a_DPvhukri5e4QFDTOn0QD&export=download',
  // ስለ ጥምቀት — ዘማሪ ታፈሰ ተስፋዬ
  71: 'https://drive.usercontent.google.com/download?id=1TUAaIMqDLebdmzQWzeXOiJptJ-BXAyDD&export=download',
  // ስለ ስቅለት — ዘማሪ ታፈሰ ተስፋዬ
  72: 'https://drive.usercontent.google.com/download?id=1KSRUrjldIz6F-j4-Im2fF16J10WPXG5N&export=download',
  // ከደጇ ይፈልቃል — ዘማሪ ታፈሰ ተስፋዬ
  74: 'https://drive.usercontent.google.com/download?id=1Vs5I0lf7LtrHb0YT0Tg1Bw7UkCSVoJ9C&export=download',
  // የብርሃን እናት — ሊቀ መዘምር ይልማ ኃይሉ
  145: 'https://drive.usercontent.google.com/download?id=12URlTYAYJ5T4xgNnUBQAXrIE5FEw38rT&export=download',
  // አቤቱ ደግ ሰው — ሊቀ መዘምር ይልማ ኃይሉ
  150: 'https://drive.usercontent.google.com/download?id=1peA8ajYAHspGcZUUAI02GsBA37uLFL0W&export=download',
  // ሰላም ለማርያም — ዘማሪት ሶስና ገ/ኢየሱስ
  170: 'https://drive.usercontent.google.com/download?id=18ak9xZgp_Y5BNwp4zCVZ2Kdb5LSloVzo&export=download',
  // ድንግል ስልሽ — ዘማሪት ሶስና ገ/ኢየሱስ
  172: 'https://drive.usercontent.google.com/download?id=15C0yqAmbMi49ygobue0oybanz_Zn7SmW&export=download',
  // ስቀለው ስቀለው — ዘማሪት ሶስና ገ/ኢየሱስ
  173: 'https://drive.usercontent.google.com/download?id=1gzF5PbG3z4WQ0ZGsrM2dWvhs9SZTJxzV&export=download',
  // ዐሥር አውታር ባለው — ዘማሪት ሶስና ገ/ኢየሱስ
  174: 'https://drive.usercontent.google.com/download?id=1uhu1biKizxO1PMOIZs-3E0GpovqLTSyD&export=download',
  // ስምሽ ጉልበት ሆኖኝ — ዘማሪ ዲ/ን አቤል ተስፋዬ
  190: 'https://drive.usercontent.google.com/download?id=1HuIbKYb2DR6CYYgCwOBGwyUAPTaRwgPA&export=download',
  // መች ይረሳል — ዘማሪ ዲ/ን አቤል ተስፋዬ
  192: 'https://drive.usercontent.google.com/download?id=16q6pcPBxQTFCEAqxX4EadzqAI1MGkfhO&export=download',
  // ሰላምህ ይብዛላት — ዘማሪ ዲ/ን አቤል ተስፋዬ
  195: 'https://drive.usercontent.google.com/download?id=17x-EpZnMdFJKYlbQ44gbbOma2idOvcvR&export=download',
  // ጥሩልኝ ዳዊትን — ዘማሪ ዲ/ን አቤል ተስፋዬ
  199: 'https://drive.usercontent.google.com/download?id=1OhF_PwUldYh2po7L4EFM2PZ7jl4aoQp6&export=download',
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
  