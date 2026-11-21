import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, Alert,
} from 'react-native';
import Constants from 'expo-constants';
import { useTheme } from '../theme';

const CONTACT = {
  email: 'sofoniasjohn8@gmail.com',
  phone: '+251923871527',
  telegram: 'sj5john',
};

function openLink(url: string) {
  Linking.openURL(url).catch(() =>
    Alert.alert('አልተከፈተም', 'ሊንኩን ማስከፈት አልተቻለም።')
  );
}

export function ContactScreen() {
  const { colors } = useTheme();

  const contactBtns = [
    { icon: '✉️', label: 'በኢሜይል ያግኙን', action: () => openLink(`mailto:${CONTACT.email}`), bg: colors.authorBadgeBg },
    { icon: '📞', label: 'በስልክ ያግኙን', action: () => openLink(`tel:${CONTACT.phone}`), bg: colors.authorBadgeBg },
    { icon: '💬', label: 'በቴሌግራም ያግኙን', action: () => openLink(`https://t.me/${CONTACT.telegram}`), bg: colors.authorBadgeBg },
    { icon: '📝', label: 'አስተያየት ላኩ', action: () => openLink(`mailto:${CONTACT.email}?subject=Feedback&body=`), bg: colors.authorBadgeBg },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.appBg }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <Text style={[styles.headerTitle, { color: colors.headerTitle }]}>ያግኙን</Text>
        <Text style={[styles.headerSubtitle, { color: colors.headerSubtitle }]}>Contact Us</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={[styles.aboutCard, { backgroundColor: colors.cardBg, borderLeftColor: colors.accentBar, shadowColor: colors.tabBarShadow }]}>
          <Text style={[styles.aboutTitle, { color: colors.accent }]}>ቤተ-ዕንዚራ</Text>
          <Text style={[styles.aboutText, { color: colors.secondary }]}>
            ይህ መተግበሪያ የበገና መዝሙሮችን ለማሰባሰብ፣ ለመፈለግና ለማንበብ
            ተዘጋጅቷል። ጥያቄ፣ አስተያየት ወይም አዲስ መዝሙሮችን ለመጨመር
            ቀጥሎ ያሉ አዝራሮችን ይጠቀሙ።
          </Text>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.sectionLabel }]}>አድራሻ</Text>

        {contactBtns.slice(0, 3).map((btn, i) => (
          <TouchableOpacity key={i} style={[styles.contactBtn, { backgroundColor: colors.cardBg, shadowColor: colors.tabBarShadow }]} activeOpacity={0.75} onPress={btn.action}>
            <View style={[styles.iconBox, { backgroundColor: btn.bg }]}>
              <Text style={styles.iconText}>{btn.icon}</Text>
            </View>
            <Text style={[styles.btnLabel, { color: colors.title }]}>{btn.label}</Text>
            <Text style={[styles.arrow, { color: colors.chevron }]}>›</Text>
          </TouchableOpacity>
        ))}

        <Text style={[styles.sectionLabel, { color: colors.sectionLabel }]}>አስተያየት ወይም ጥቆማ</Text>

        <TouchableOpacity style={[styles.contactBtn, { backgroundColor: colors.cardBg, shadowColor: colors.tabBarShadow }]} activeOpacity={0.75} onPress={contactBtns[3].action}>
          <View style={[styles.iconBox, { backgroundColor: colors.authorBadgeBg }]}>
            <Text style={styles.iconText}>{contactBtns[3].icon}</Text>
          </View>
          <Text style={[styles.btnLabel, { color: colors.title }]}>{contactBtns[3].label}</Text>
          <Text style={[styles.arrow, { color: colors.chevron }]}>›</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.emptyText }]}>ስሪት 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: Constants.statusBarHeight + 10, paddingBottom: 20, paddingHorizontal: 20, alignItems: 'center' },
  headerTitle: { fontFamily: 'Nyala', fontSize: 26, fontWeight: 'bold', lineHeight: 38 },
  headerSubtitle: { fontFamily: 'Nyala', fontSize: 13, fontStyle: 'italic', lineHeight: 20, marginTop: 2 },
  body: { padding: 16, paddingBottom: 40 },
  aboutCard: { borderRadius: 16, padding: 18, marginBottom: 20, borderLeftWidth: 5, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2 },
  aboutTitle: { fontFamily: 'Nyala', fontSize: 18, fontWeight: 'bold', marginBottom: 8, lineHeight: 28 },
  aboutText: { fontFamily: 'Nyala', fontSize: 15, lineHeight: 26 },
  sectionLabel: { fontFamily: 'Nyala', fontSize: 12, fontWeight: 'bold', letterSpacing: 0.5, marginBottom: 8, marginLeft: 4, marginTop: 4 },
  contactBtn: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 16, marginBottom: 10, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 1 },
  iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  iconText: { fontSize: 20 },
  btnLabel: { flex: 1, fontFamily: 'Nyala', fontSize: 16, fontWeight: 'bold', lineHeight: 24 },
  arrow: { fontSize: 26, fontWeight: '300' },
  version: { fontFamily: 'Nyala', fontSize: 13, textAlign: 'center', marginTop: 24, fontStyle: 'italic' },
});
