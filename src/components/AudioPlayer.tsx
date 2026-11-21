import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { useAudio, formatTime, hasAudio } from '../hooks/useAudio';
import { useTheme } from '../theme';

interface Props {
  mezmurId: number;
  mezmurTitle: string;
}

export function AudioPlayer({ mezmurId, mezmurTitle }: Props) {
  const { colors } = useTheme();

  // Hide entirely for mezmurs that have no audio uploaded yet
  if (!hasAudio(mezmurId)) return null;

  return <AudioPlayerInner mezmurId={mezmurId} mezmurTitle={mezmurTitle} />;
}

// Inner component so the hook always runs (Rules of Hooks)
function AudioPlayerInner({ mezmurId, mezmurTitle }: Props) {
  const { colors } = useTheme();
  const {
    downloadStatus, downloadProgress, errorMessage,
    isPlaying, isLoading, positionMs, durationMs,
    download, cancelDownload, deleteAudio, play, pause, seekTo,
  } = useAudio(mezmurId);

  const handleDelete = () => {
    Alert.alert(
      'ድምፅ ሰርዝ',
      `"${mezmurTitle}" ያወረዱትን ድምፅ ይሰርዙ?`,
      [
        { text: 'አይ', style: 'cancel' },
        { text: 'ሰርዝ', style: 'destructive', onPress: deleteAudio },
      ]
    );
  };

  const progressPct = durationMs > 0 ? positionMs / durationMs : 0;

  // ── Not downloaded ──────────────────────────────────────────────────────────
  if (downloadStatus === 'not_downloaded') {
    return (
      <View style={[styles.container, { backgroundColor: colors.cardBg, borderColor: colors.accentBar }]}>
        <View style={styles.row}>
          <Text style={styles.noteIcon}>🎵</Text>
          <View style={styles.flex}>
            <Text style={[styles.label, { color: colors.title }]}>የድምፅ ፋይል አለ</Text>
            <Text style={[styles.sublabel, { color: colors.preview }]}>ለማዳመጥ ያወርዱ</Text>
          </View>
          <TouchableOpacity
            style={[styles.downloadBtn, { backgroundColor: colors.accent }]}
            onPress={download}
            activeOpacity={0.75}
          >
            <Text style={styles.downloadBtnText}>⬇  ያወርዱ</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Downloading ─────────────────────────────────────────────────────────────
  if (downloadStatus === 'downloading') {
    const pct = Math.round(downloadProgress * 100);
    return (
      <View style={[styles.container, { backgroundColor: colors.cardBg, borderColor: colors.countLine }]}>
        <View style={styles.row}>
          <ActivityIndicator color={colors.accent} style={{ marginRight: 12 }} />
          <View style={styles.flex}>
            <Text style={[styles.label, { color: colors.title }]}>በማውረድ ላይ... {pct}%</Text>
            <View style={[styles.progressTrack, { backgroundColor: colors.countLine, marginTop: 8 }]}>
              <View style={[styles.progressFill, { backgroundColor: colors.accent, width: `${pct}%` as any }]} />
            </View>
          </View>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.appBg }]}
            onPress={cancelDownload}
            activeOpacity={0.7}
          >
            <Text style={{ color: colors.preview, fontSize: 16 }}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (downloadStatus === 'error') {
    return (
      <View style={[styles.container, { backgroundColor: colors.cardBg, borderColor: '#ff6b6b' }]}>
        <View style={styles.row}>
          <Text style={styles.noteIcon}>⚠️</Text>
          <View style={styles.flex}>
            <Text style={[styles.label, { color: '#ff6b6b' }]}>ማውረድ አልተቻለም</Text>
            <Text style={[styles.sublabel, { color: colors.preview }]} numberOfLines={1}>
              {errorMessage ?? 'እባክዎ እንደገና ይሞክሩ'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.downloadBtn, { backgroundColor: colors.accent }]}
            onPress={download}
            activeOpacity={0.75}
          >
            <Text style={styles.downloadBtnText}>↺  ደግም</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Player ──────────────────────────────────────────────────────────────────
  return (
    <View style={[styles.container, { backgroundColor: colors.cardBg, borderColor: colors.accentBar }]}>
      {/* Title + delete */}
      <View style={styles.playerTitleRow}>
        <Text style={styles.noteIcon}>🎵</Text>
        <Text style={[styles.playerTitle, { color: colors.title }]} numberOfLines={1}>
          {mezmurTitle}
        </Text>
        <TouchableOpacity onPress={handleDelete} activeOpacity={0.7} style={styles.deleteBtn}>
          <Text style={{ color: colors.preview, fontSize: 18 }}>🗑</Text>
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View style={[styles.progressTrack, { backgroundColor: colors.countLine }]}>
        <View
          style={[
            styles.progressFill,
            { backgroundColor: colors.accentBar, width: `${Math.min(100, Math.round(progressPct * 100))}%` as any },
          ]}
        />
      </View>

      {/* Time */}
      <View style={styles.timeRow}>
        <Text style={[styles.timeText, { color: colors.preview }]}>{formatTime(positionMs)}</Text>
        <Text style={[styles.timeText, { color: colors.preview }]}>{formatTime(durationMs)}</Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.ctrlBtn, { backgroundColor: colors.appBg }]}
          onPress={() => seekTo(Math.max(0, positionMs - 10000))}
          activeOpacity={0.7}
        >
          <Text style={[styles.ctrlIcon, { color: colors.secondary }]}>⏪</Text>
          <Text style={[styles.ctrlLabel, { color: colors.preview }]}>10s</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.playBtn, { backgroundColor: colors.accent }]}
          onPress={isPlaying ? pause : play}
          activeOpacity={0.75}
          disabled={isLoading}
        >
          {isLoading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.ctrlBtn, { backgroundColor: colors.appBg }]}
          onPress={() => seekTo(Math.min(durationMs, positionMs + 10000))}
          activeOpacity={0.7}
        >
          <Text style={[styles.ctrlIcon, { color: colors.secondary }]}>⏩</Text>
          <Text style={[styles.ctrlLabel, { color: colors.preview }]}>10s</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16, borderWidth: 1.5,
    padding: 16, marginBottom: 16,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
  noteIcon: { fontSize: 24, marginRight: 12 },
  label: { fontFamily: 'Nyala', fontSize: 15, fontWeight: 'bold', lineHeight: 22 },
  sublabel: { fontFamily: 'Nyala', fontSize: 12, lineHeight: 18, marginTop: 2 },
  downloadBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, marginLeft: 8 },
  downloadBtnText: { color: '#fff', fontFamily: 'Nyala', fontSize: 13, fontWeight: 'bold' },
  iconBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  progressTrack: { height: 5, borderRadius: 3, overflow: 'hidden', marginVertical: 10 },
  progressFill: { height: 5, borderRadius: 3 },
  playerTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  playerTitle: { flex: 1, fontFamily: 'Nyala', fontSize: 14, fontWeight: 'bold', lineHeight: 20 },
  deleteBtn: { padding: 4 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  timeText: { fontFamily: 'Nyala', fontSize: 11 },
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16 },
  ctrlBtn: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  ctrlIcon: { fontSize: 18 },
  ctrlLabel: { fontFamily: 'Nyala', fontSize: 9, marginTop: -2 },
  playBtn: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  playIcon: { fontSize: 24, color: '#fff' },
});
