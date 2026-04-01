import { useEffect } from "react";
import { Platform } from "react-native";
import { router } from "expo-router";

export default function AuthCallback() {
  useEffect(() => {
    if (Platform.OS === "web") {
      window.location.replace("/");
      return;
    }

    router.replace("/");
  }, []);

  return null;
}
