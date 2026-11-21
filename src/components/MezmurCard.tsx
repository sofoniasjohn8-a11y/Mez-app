import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Mezmur } from '../data/types';
import { useTheme } from '../theme';

interface Props {
  mezmur: Mezmur;
  onPress: (mezmur: Mezmur) => void;
}

export function MezmurCard({ mezmur, onPress }: Props) {
  const { colors } = useTheme();
  const previewLines = mezmur.lyrics.split('\n').filter((l) => l.trim()).slice(0, 1);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.cardBg, shadowColor: colors.tabBarShadow }]}
      onPress={() => onPress(mezmur)}
      activeOpacity={0.65}
    >
      <View style={[styles.accentBar, { backgroundColor: colors.accentBar }]} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.title }]} numberOfLines={1}>{mezmur.title}</Text>
        <View style={[styles.authorBadge, { backgroundColor: colors.authorBadgeBg }]}>
          <Text style={[styles.authorText, { color: colors.authorBadgeText }]} numberOfLines={1}>
            {mezmur.author}
          </Text>
        </View>
        {previewLines.length > 0 && (
          <Text style={[styles.preview, { color: colors.preview }]} numberOfLines={1}>
            {previewLines[0]}
          </Text>
        )}
      </View>
      <Text style={[styles.chevron, { color: colors.chevron }]}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  accentBar: {
    width: 5,
    alignSelf: 'stretch',
  },
  content: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  title: {
    fontFamily: 'Nyala',
    fontSize: 17,
    fontWeight: 'bold',
    lineHeight: 26,
    marginBottom: 6,
  },
  authorBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 6,
  },
  authorText: {
    fontFamily: 'Nyala',
    fontSize: 12.5,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  preview: {
    fontFamily: 'Nyala',
    fontSize: 12.5,
    lineHeight: 20,
  },
  chevron: {
    fontSize: 28,
    fontWeight: '300',
    paddingRight: 14,
  },
});
