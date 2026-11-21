import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import type { ThemeColors } from '../theme';

export type TabName = 'Home' | 'Contact' | 'Settings';

interface Props {
  active: TabName;
  onChange: (tab: TabName) => void;
  colors: ThemeColors;
}

const TABS: { name: TabName; icon: string; label: string }[] = [
  { name: 'Home',     icon: '🎵', label: 'መዝሙሮች' },
  { name: 'Contact',  icon: '✉️', label: 'ያግኙን'   },
  { name: 'Settings', icon: '⚙️', label: 'ቅንብሮች'  },
];

export function TabBar({ active, onChange, colors }: Props) {
  return (
    <View style={[styles.bar, { backgroundColor: colors.tabBarBg, borderTopColor: colors.tabBarBorder }]}>
      {TABS.map((tab) => {
        const focused = active === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => onChange(tab.name)}
            activeOpacity={0.7}
          >
            <Text style={[styles.icon, { opacity: focused ? 1 : 0.4 }]}>{tab.icon}</Text>
            <Text style={[
              styles.label,
              { color: focused ? colors.tabBarActive : colors.tabBarInactive },
              focused && { fontWeight: 'bold' as const },
            ]}>
              {tab.label}
            </Text>
            {focused && <View style={[styles.dot, { backgroundColor: colors.tabBarActive }]} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 20 : 6,
    paddingTop: 6,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  icon: {
    fontSize: 22,
  },
  label: {
    fontFamily: 'Nyala',
    fontSize: 11,
    marginTop: 3,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 3,
  },
});
