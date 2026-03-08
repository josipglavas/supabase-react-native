import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useColorScheme } from "@/components/useColorScheme";
import { Stack } from "expo-router";
import { AuthProvider } from "@/provider/AuthProvider";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<"system" | "light" | "dark">("system");

  // Determine effective color scheme
  const effectiveColorScheme =
    mode === "system" ? (systemColorScheme ?? "light") : mode;

  return (
    <GluestackUIProvider mode={effectiveColorScheme}>
      <AuthProvider>
        <ThemeProvider
          value={effectiveColorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack initialRouteName="(auth)">
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen
              name="post"
              options={{ headerShown: false, presentation: "modal" }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </AuthProvider>
    </GluestackUIProvider>
  );
}
