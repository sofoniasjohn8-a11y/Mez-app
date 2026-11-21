import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import Constants from 'expo-constants';
import { useTheme, type ThemeColors } from '../theme';
import type { Settings } from '../hooks/useSettings';

interface Props {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
}

type FontSize = 'small' | 'medium' | 'large';

export function SettingsScreen({ settings, update }: Props) {
  const { colors, mode, toggle } = useTheme();

  const fontOptions: { label: string; value: FontSize }[] = [
    { label: 'ትንሽ', value: 'small' },
    { label: 'መካከለኛ', value: 'medium' },
    { label: 'ትልቅ', value: 'large' },
  ];

  const handleClearCache = () => {
    Alert.alert(
      'ማጽዳት',
      'የፍለጋ ታሪክ ይጸዳ?',
      [
        { text: 'አይ', style: 'cancel' },
        { text: 'እሺ', onPress: () => Alert.alert('ተሠርቷል', 'ታሪኩ ተጽድቷል።') },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.appBg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <Text style={[styles.headerTitle, { color: colors.headerTitle }]}>ቅንብሮች</Text>
        <Text style={[styles.headerSubtitle, { color: colors.headerSubtitle }]}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>

        {/* Theme section — now functional */}
        <Text style={[styles.sectionLabel, { color: colors.sectionLabel }]}>ቀለም</Text>
        <View style={[styles.card, { backgroundColor: colors.cardBg, shadowColor: colors.tabBarShadow }]}>
          <View style={styles.themeRow}>
            <TouchableOpacity
              style={[
                styles.themePill,
                { backgroundColor: settings.theme === 'light' ? colors.accent : colors.appBg },
              ]}
              onPress={() => update({ theme: 'light' })}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.themePillText,
                { color: settings.theme === 'light' ? '#fff' : colors.secondary },
              ]}>
                ☀️  ብርሃን
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themePill,
                { backgroundColor: settings.theme === 'dark' ? colors.accent : colors.appBg },
              ]}
              onPress={() => update({ theme: 'dark' })}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.themePillText,
                { color: settings.theme === 'dark' ? '#fff' : colors.secondary },
              ]}>
                🌙  ጨለማ
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Font size section */}
        <Text style={[styles.sectionLabel, { color: colors.sectionLabel }]}>የጽሑፍ መጠን</Text>
        <View style={[styles.card, { backgroundColor: colors.cardBg, shadowColor: colors.tabBarShadow }]}>
          <View style={styles.fontRow}>
            {fontOptions.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.fontPill,
                  { backgroundColor: settings.fontSize === opt.value ? colors.accent : colors.appBg },
                ]}
                onPress={() => update({ fontSize: opt.value })}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.fontPillText,
                  { color: settings.fontSize === opt.value ? '#fff' : colors.secondary },
                ]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={[styles.previewBox, { backgroundColor: colors.appBg, borderColor: colors.countLine }]}>
            <Text style={[
              styles.previewText,
              { color: colors.body },
              settings.fontSize === 'small' && { fontSize: 13 },
              settings.fontSize === 'medium' && { fontSize: 16 },
              settings.fontSize === 'large' && { fontSize: 20 },
            ]}>
              ስሙን ሲጠሩት የሚያምር።
            </Text>
          </View>
        </View>

        {/* Display section */}
        <Text style={[styles.sectionLabel, { color: colors.sectionLabel }]}>ማሳያ</Text>
        <View style={[styles.card, { backgroundColor: colors.cardBg, shadowColor: colors.tabBarShadow }]}>
          <View style={styles.switchRow}>
            <View style={styles.switchInfo}>
              <Text style={[styles.switchLabel, { color: colors.title }]}>የግጥም ቅኝት አሳይ</Text>
              <Text style={[styles.switchDesc, { color: colors.preview }]}>ዝርዝሩ ውስጥ የመዝሙር ቅኝት ያሳያል</Text>
            </View>
            <Switch
              value={settings.showPreview}
              onValueChange={(v) => update({ showPreview: v })}
              trackColor={{ false: colors.countLine, true: colors.accent }}
              thumbColor={settings.showPreview ? '#ffffff' : colors.preview}
            />
          </View>
        </View>

        {/* App info */}
        <Text style={[styles.sectionLabel, { color: colors.sectionLabel }]}>ስለ መተግበሪያው</Text>
        <View style={[styles.card, { backgroundColor: colors.cardBg, shadowColor: colors.tabBarShadow }]}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.secondary }]}>ስሪት</Text>
            <Text style={[styles.infoValue, { color: colors.accent }]}>1.0.0</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.secondary }]}>የመዝሙሮች ብዛት</Text>
            <Text style={[styles.infoValue, { color: colors.accent }]}>335</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.secondary }]}>ምንጭ</Text>
            <Text style={[styles.infoValue, { color: colors.accent }]}>ቤተ-ዕንዚራ</Text>
          </View>
        </View>

        {/* Clear cache */}
        <TouchableOpacity
          style={[styles.dangerBtn, { backgroundColor: colors.dangerBtnBg, borderColor: colors.dangerBtnBorder }]}
          onPress={handleClearCache}
          activeOpacity={0.7}
        >
          <Text style={[styles.dangerBtnText, { color: colors.dangerBtnText }]}>🗑  ታሪክ አጽዳ</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: Constants.statusBarHeight + 10,
    paddingBottom: 20, paddingHorizontal: 20, alignItems: 'center',
  },
  headerTitle: { fontFamily: 'Nyala', fontSize: 26, fontWeight: 'bold', lineHeight: 38 },
  headerSubtitle: { fontFamily: 'Nyala', fontSize: 13, fontStyle: 'italic', lineHeight: 20, marginTop: 2 },
  body: { padding: 16, paddingBottom: 40 },
  sectionLabel: { fontFamily: 'Nyala', fontSize: 12, fontWeight: 'bold', letterSpacing: 0.5, marginBottom: 8, marginLeft: 4, marginTop: 8 },
  card: { borderRadius: 16, padding: 16, marginBottom: 10, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 1 },
  themeRow: { flexDirection: 'row', gap: 10 },
  themePill: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  themePillText: { fontFamily: 'Nyala', fontSize: 14, fontWeight: 'bold' },
  fontRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  fontPill: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  fontPillText: { fontFamily: 'Nyala', fontSize: 14 },
  previewBox: { borderRadius: 10, padding: 12, borderWidth: 1 },
  previewText: { fontFamily: 'Nyala', lineHeight: 30 },
  switchRow: { flexDirection: 'row', alignItems: 'center' },
  switchInfo: { flex: 1 },
  switchLabel: { fontFamily: 'Nyala', fontSize: 15, fontWeight: 'bold', lineHeight: 24 },
  switchDesc: { fontFamily: 'Nyala', fontSize: 12, lineHeight: 20, marginTop: 2 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  infoLabel: { fontFamily: 'Nyala', fontSize: 15, lineHeight: 24 },
  infoValue: { fontFamily: 'Nyala', fontSize: 15, fontWeight: 'bold', lineHeight: 24 },
  divider: { height: 1 },
  dangerBtn: { marginTop: 8, borderRadius: 14, padding: 15, alignItems: 'center', borderWidth: 1 },
  dangerBtnText: { fontFamily: 'Nyala', fontSize: 15, fontWeight: 'bold' },
});
