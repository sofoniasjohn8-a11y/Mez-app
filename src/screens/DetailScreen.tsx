import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
} from 'react-native';
import Constants from 'expo-constants';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { HomeStackParamList } from '../../App';
import { useTheme } from '../theme';
import type { Mezmur } from '../data/types';
import { AudioPlayer } from '../components/AudioPlayer';

interface Props {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'Detail'>;
  route: RouteProp<HomeStackParamList, 'Detail'>;
  onOpenMezmur: (mezmur: Mezmur) => void;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
}

const FONT_SIZES = [14, 16, 18, 20, 24];

export function DetailScreen({ navigation, route, onOpenMezmur, isFavorite, toggleFavorite }: Props) {
  const { mezmur } = route.params;
  const { colors } = useTheme();
  const [fontSizeIdx, setFontSizeIdx] = useState(1);
  const fav = isFavorite(mezmur.id);

  useEffect(() => { onOpenMezmur(mezmur); }, [mezmur.id]);

  const fontSize = FONT_SIZES[fontSizeIdx];

  return (
    <View style={[styles.container, { backgroundColor: colors.appBg }]}>
      {/* Header */}
      <View style={{ backgroundColor: colors.headerBg }}>
        <View style={[styles.header, { paddingTop: Constants.statusBarHeight + 8 }]}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6} style={[styles.backBtn, { backgroundColor: colors.backBtnBg }]}>
              <Text style={[styles.backIcon, { color: colors.headerTitle }]}>‹</Text>
              <Text style={[styles.backText, { color: colors.headerTitle }]}>ተመለስ</Text>
            </TouchableOpacity>

            {/* Favorite star button */}
            <TouchableOpacity
              onPress={() => toggleFavorite(mezmur.id)}
              activeOpacity={0.6}
              style={[styles.favBtn, { backgroundColor: colors.backBtnBg }]}
            >
              <Text style={styles.favIcon}>{fav ? '⭐' : '☆'}</Text>
              <Text style={[styles.favText, { color: colors.headerTitle }]}>{fav ? 'እገዛዎች' : 'እገዛ አድርግ'}</Text>
            </TouchableOpacity>
          </View>

          {/* Tag badge */}
          {mezmur.tag && mezmur.tag !== 'ሌላ' && (
            <View style={[styles.tagBadge, { backgroundColor: colors.backBtnBg }]}>
              <Text style={[styles.tagBadgeText, { color: colors.headerSubtitle }]}>{mezmur.tag}</Text>
            </View>
          )}

          <Text style={[styles.title, { color: colors.headerTitle }]} numberOfLines={2}>{mezmur.title}</Text>
          <View style={styles.authorRow}>
            <Text style={{ color: colors.headerSubtitle, fontSize: 8, marginRight: 7 }}>●</Text>
            <Text style={[styles.author, { color: colors.headerSubtitle }]} numberOfLines={1}>{mezmur.author}</Text>
          </View>

          {/* Font size pills */}
          <View style={styles.fontControls}>
            <TouchableOpacity
              style={[styles.fontBtn, { backgroundColor: colors.fontBtnBg }, fontSizeIdx === 0 && styles.fontBtnDisabled]}
              onPress={() => setFontSizeIdx((i) => Math.max(0, i - 1))}
              disabled={fontSizeIdx === 0}
              activeOpacity={0.6}
            >
              <Text style={[styles.fontBtnIcon, { color: colors.headerTitle }]}>A−</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.fontBtn, { backgroundColor: colors.fontBtnBg }, fontSizeIdx === FONT_SIZES.length - 1 && styles.fontBtnDisabled]}
              onPress={() => setFontSizeIdx((i) => Math.min(FONT_SIZES.length - 1, i + 1))}
              disabled={fontSizeIdx === FONT_SIZES.length - 1}
              activeOpacity={0.6}
            >
              <Text style={[styles.fontBtnIcon, { color: colors.headerTitle }]}>A+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Lyrics */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.lyricsContent} showsVerticalScrollIndicator={false}>
        {/* Audio player — optional, shows download button if not yet downloaded */}
        <AudioPlayer mezmurId={mezmur.id} mezmurTitle={mezmur.title} />

        <View style={[styles.lyricsCard, { backgroundColor: colors.lyricsCardBg, shadowColor: colors.tabBarShadow }]}>
          <Text
            style={[styles.lyrics, { color: colors.body }, { fontSize, lineHeight: fontSize * 1.7 }]}
            selectable
          >
            {mezmur.lyrics}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 16 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  backBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 12, borderRadius: 16 },
  backIcon: { fontSize: 22, fontWeight: '600', marginRight: 4, marginTop: -2 },
  backText: { fontFamily: 'Nyala', fontSize: 13 },
  favBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 12, borderRadius: 16 },
  favIcon: { fontSize: 16, marginRight: 5 },
  favText: { fontFamily: 'Nyala', fontSize: 13 },
  tagBadge: { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 6 },
  tagBadgeText: { fontFamily: 'Nyala', fontSize: 12, fontStyle: 'italic' },
  title: { fontFamily: 'Nyala', fontSize: 24, fontWeight: 'bold', lineHeight: 36, paddingHorizontal: 4 },
  authorRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  author: { fontFamily: 'Nyala', fontSize: 14, fontStyle: 'italic', lineHeight: 22 },
  fontControls: { flexDirection: 'row', marginTop: 14, gap: 10 },
  fontBtn: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20 },
  fontBtnDisabled: { opacity: 0.3 },
  fontBtnIcon: { fontWeight: 'bold', fontSize: 14 },
  scroll: { flex: 1 },
  lyricsContent: { padding: 16, paddingBottom: 48 },
  lyricsCard: { borderRadius: 16, paddingHorizontal: 20, paddingVertical: 24, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 2 },
  lyrics: { fontFamily: 'Nyala' },
});
