import { useColorScheme as useNativewindScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const THEME_KEY = "APP_THEME";

export function useAppTheme() {
  const { colorScheme, setColorScheme } = useNativewindScheme();
  const [isReady, setIsReady] = useState(false);

  // Load theme before render
  useEffect(() => {
    const loadTheme = async () => {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      if (saved === "dark" || saved === "light") {
        setColorScheme(saved);
      }
      setIsReady(true);
    };

    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = colorScheme === "dark" ? "light" : "dark";
    setColorScheme(newTheme);
    await AsyncStorage.setItem(THEME_KEY, newTheme);
  };

  return {
    colorScheme,
    toggleTheme,
    isReady,
  };
}