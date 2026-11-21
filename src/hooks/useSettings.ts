import { useState, useEffect, useCallback } from 'react';
import * as FileSystem from 'expo-file-system/legacy';

export type Settings = {
  fontSize: 'small' | 'medium' | 'large';
  theme: 'light' | 'dark';
  showPreview: boolean;
};

const DEFAULTS: Settings = {
  fontSize: 'medium',
  theme: 'light',
  showPreview: true,
};

const FILE = FileSystem.documentDirectory + 'mezmur_settings.json';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    FileSystem.readAsStringAsync(FILE)
      .then((val) => {
        if (val) setSettings({ ...DEFAULTS, ...JSON.parse(val) });
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const update = useCallback(async (patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      FileSystem.writeAsStringAsync(FILE, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  return { settings, update, loaded };
}
