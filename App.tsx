import React, { useState, useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';

import { HomeScreen } from './src/screens/HomeScreen';
import { DetailScreen } from './src/screens/DetailScreen';
import { ContactScreen } from './src/screens/ContactScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { TabBar, TabName } from './src/components/TabBar';
import { ThemeContext, lightColors, darkColors, type ThemeMode } from './src/theme';
import { useSettings } from './src/hooks/useSettings';
import { useHistory } from './src/hooks/useHistory';
import { useFavorites } from './src/hooks/useFavorites';
import type { Mezmur } from './src/data/types';

export type HomeStackParamList = {
  MezmurList: undefined;
  Detail: { mezmur: Mezmur };
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('Home');
  const [fontsLoaded] = useFonts({ Nyala: require('./assets/fonts/Nyala.ttf') });
  const { settings, update } = useSettings();
  const historyHook = useHistory();
  const favoritesHook = useFavorites();

  const themeMode: ThemeMode = settings.theme;
  const colors = themeMode === 'dark' ? darkColors : lightColors;

  const themeValue = useMemo(
    () => ({
      colors,
      mode: themeMode,
      toggle: () => update({ theme: themeMode === 'light' ? 'dark' : 'light' }),
    }),
    [colors, themeMode, update]
  );

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.headerBg }}>
        <ActivityIndicator size="large" color={colors.headerSubtitle} />
      </View>
    );
  }

  return (
    <ThemeContext.Provider value={themeValue}>
      <View style={{ flex: 1, backgroundColor: colors.appBg }}>
        <View style={{ flex: 1 }}>
          {activeTab === 'Home' && (
            <NavigationContainer>
              <HomeStack.Navigator screenOptions={{ headerShown: false }}>
                <HomeStack.Screen name="MezmurList">
                  {(props) => (
                    <HomeScreen
                      {...props}
                      history={historyHook.history}
                      onOpenMezmur={historyHook.add}
                      favorites={favoritesHook.favorites}
                      toggleFavorite={favoritesHook.toggle}
                    />
                  )}
                </HomeStack.Screen>
                <HomeStack.Screen name="Detail" options={{ animation: 'slide_from_right' }}>
                  {(props) => (
                    <DetailScreen
                      {...props}
                      onOpenMezmur={historyHook.add}
                      isFavorite={favoritesHook.isFavorite}
                      toggleFavorite={favoritesHook.toggle}
                    />
                  )}
                </HomeStack.Screen>
              </HomeStack.Navigator>
            </NavigationContainer>
          )}
          {activeTab === 'Contact' && <ContactScreen />}
          {activeTab === 'Settings' && (
            <SettingsScreen settings={settings} update={update} />
          )}
        </View>
        <TabBar active={activeTab} onChange={setActiveTab} colors={colors} />
      </View>
    </ThemeContext.Provider>
  );
}
