import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import Constants from 'expo-constants';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSearch, TAGS } from '../hooks/useSearch';
import { MezmurCard } from '../components/MezmurCard';
import type { Mezmur } from '../data/types';
import type { HomeStackParamList } from '../../App';
import { useTheme } from '../theme';

interface Props {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'MezmurList'>;
  history: Mezmur[];
  onOpenMezmur: (mezmur: Mezmur) => void;
  favorites: number[];
  toggleFavorite: (id: number) => void;
}

export function HomeScreen({ navigation, history, onOpenMezmur, favorites, toggleFavorite }: Props) {
  const { query, setQuery, results, total, authorCount, activeTag, setActiveTag } = useSearch();
  const { colors } = useTheme();
  const [showHistory, setShowHistory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  const handleSelect = (mezmur: Mezmur) => {
    onOpenMezmur(mezmur);
    navigation.navigate('Detail', { mezmur });
  };

  // Get favorited mezmurs
  const allMezmurs = results;
  const favoriteMezmurs = allMezmurs.filter((m) => favorites.includes(m.id));

  const renderList = (data: Mezmur[], onPress: (m: Mezmur) => void) => (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <MezmurCard mezmur={item} onPress={onPress} />}
      contentContainerStyle={styles.listContent}
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={
        <View style={styles.emptyWrap}>
          <Text style={[styles.emptyIcon, { color: colors.emptyIcon }]}>♪</Text>
          <Text style={[styles.emptyText, { color: colors.emptyText }]}>ምንም ውጤት አልተገኘም።</Text>
        </View>
      }
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.appBg }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.headerBg} translucent={false} />

      {/* Header */}
      <SafeAreaView style={{ backgroundColor: colors.headerBg }}>
        <View style={styles.headerInner}>
          <View style={styles.headerTop}>
            <View style={{ flex: 1 }} />
            <Text style={[styles.headerTitle, { color: colors.headerTitle }]}>ቤተ-ዕንዚራ</Text>

            {/* Icons: favorites + history */}
            <View style={styles.iconRow}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => setShowFavorites(true)} activeOpacity={0.6}>
                <Text style={styles.iconEmoji}>⭐</Text>
                {favorites.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{favorites.length > 99 ? '99+' : favorites.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => setShowHistory(true)} activeOpacity={0.6}>
                <Text style={styles.iconEmoji}>🕘</Text>
                {history.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{history.length > 99 ? '99+' : history.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <Text style={[styles.headerSubtitle, { color: colors.headerSubtitle }]}>የበገና መዝሙሮች</Text>

          {/* Search bar */}
          <View style={[styles.searchWrap, { backgroundColor: colors.searchBg }]}>
            <Text style={[styles.searchIconText, { color: colors.headerSubtitle }]}>🔍</Text>
            <TextInput
              style={[styles.searchInput, { color: colors.headerTitle }]}
              placeholder="ርዕስ፣ ደራሲ ወይም ግጥም ይፈልጉ..."
              placeholderTextColor="rgba(255,255,255,0.45)"
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
              autoCapitalize="none"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.6} style={styles.clearBtn}>
                <Text style={[styles.clearIcon, { color: colors.headerSubtitle }]}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>

      {/* Tag filter pills */}
      <View style={[styles.tagBarWrapper, { backgroundColor: colors.headerBg }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tagBar}
          contentContainerStyle={styles.tagBarContent}
        >
        {TAGS.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.tagPill,
              activeTag === tag
                ? { backgroundColor: colors.accent, borderColor: colors.accent }
                : { backgroundColor: 'transparent', borderColor: colors.accentBar },
            ]}
            onPress={() => setActiveTag(tag)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.tagPillText,
              { color: activeTag === tag ? '#ffffff' : colors.headerSubtitle },
            ]}>
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
        </ScrollView>
      </View>

      {/* Result count bar */}
      <View style={[styles.countBar, { backgroundColor: colors.appBg }]}>
        <Text style={[styles.resultCount, { color: colors.sectionLabel }]}>
          {query.trim()
            ? `${results.length} ውጤት${authorCount > 1 ? `  •  በ ${authorCount} ደራሲያን` : ''}`
            : `${results.length} መዝሙሮች`}
        </Text>
        <View style={[styles.countLine, { backgroundColor: colors.countLine }]} />
      </View>

      {/* List */}
      {renderList(results, handleSelect)}

      {/* History Modal */}
      <Modal visible={showHistory} animationType="slide" transparent={false}>
        <View style={[styles.modalContainer, { backgroundColor: colors.appBg }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.headerBg }]}>
            <View style={[styles.modalHeaderInner, { paddingTop: Constants.statusBarHeight + 10 }]}>
              <Text style={[styles.modalTitle, { color: colors.headerTitle }]}>የአሁን ታሪክ</Text>
              <TouchableOpacity onPress={() => setShowHistory(false)} activeOpacity={0.6}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
          {history.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={[styles.emptyIcon, { color: colors.emptyIcon }]}>🕘</Text>
              <Text style={[styles.emptyText, { color: colors.emptyText }]}>እስካሁን ምንም መዝሙር አልተከፈተም።</Text>
            </View>
          ) : (
            <FlatList
              data={history}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <MezmurCard mezmur={item} onPress={(m) => { setShowHistory(false); handleSelect(m); }} />
              )}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      </Modal>

      {/* Favorites Modal */}
      <Modal visible={showFavorites} animationType="slide" transparent={false}>
        <View style={[styles.modalContainer, { backgroundColor: colors.appBg }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.headerBg }]}>
            <View style={[styles.modalHeaderInner, { paddingTop: Constants.statusBarHeight + 10 }]}>
              <Text style={[styles.modalTitle, { color: colors.headerTitle }]}>⭐ እገዛዎች</Text>
              <TouchableOpacity onPress={() => setShowFavorites(false)} activeOpacity={0.6}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
          {favoriteMezmurs.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={[styles.emptyIcon, { color: colors.emptyIcon }]}>⭐</Text>
              <Text style={[styles.emptyText, { color: colors.emptyText }]}>
                እስካሁን ምንም እገዛ አልተደረገም።{'\n'}የመዝሙር ገጽ ላይ ⭐ ይጫኑ።
              </Text>
            </View>
          ) : (
            <FlatList
              data={favoriteMezmurs}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <MezmurCard
                  mezmur={item}
                  onPress={(m) => { setShowFavorites(false); handleSelect(m); }}
                />
              )}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerInner: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: Constants.statusBarHeight + 4,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  headerTitle: { flex: 1, fontFamily: 'Nyala', fontSize: 24, fontWeight: 'bold', lineHeight: 36, textAlign: 'center' },
  iconRow: { flexDirection: 'row' },
  iconBtn: { padding: 6, position: 'relative' },
  iconEmoji: { fontSize: 22 },
  badge: {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: '#ef4444', borderRadius: 8,
    minWidth: 16, height: 16, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 3,
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  headerSubtitle: { fontFamily: 'Nyala', fontSize: 13, fontStyle: 'italic', lineHeight: 20, textAlign: 'center', marginBottom: 14 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, paddingHorizontal: 14, height: 46 },
  searchIconText: { fontSize: 15, marginRight: 8 },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, fontFamily: 'Nyala', height: 46, padding: 0 },
  clearBtn: { padding: 4 },
  clearIcon: { fontSize: 14 },
  // Tag bar
  tagBarWrapper: { paddingBottom: 8 },
  tagBar: { maxHeight: 48 },
  tagBarContent: { paddingHorizontal: 16, paddingVertical: 8, gap: 8, flexDirection: 'row', alignItems: 'center' },
  tagPill: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, marginRight: 2 },
  tagPillText: { fontFamily: 'Nyala', fontSize: 13, fontWeight: 'bold' },
  // Count bar
  countBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 8 },
  resultCount: { fontFamily: 'Nyala', fontSize: 12, fontWeight: 'bold' },
  countLine: { flex: 1, height: 1, marginLeft: 12 },
  // List
  listContent: { paddingHorizontal: 16, paddingBottom: 30 },
  // Empty
  emptyWrap: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontFamily: 'Nyala', fontSize: 16, lineHeight: 26, textAlign: 'center' },
  // Modal
  modalContainer: { flex: 1 },
  modalHeader: {},
  modalHeaderInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, paddingHorizontal: 20 },
  modalTitle: { fontFamily: 'Nyala', fontSize: 22, fontWeight: 'bold' },
  modalClose: { fontSize: 22, color: '#c4a8ed', fontWeight: '300' },
});
