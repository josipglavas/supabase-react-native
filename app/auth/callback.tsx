import { useEffect } from "react";
import { router } from "expo-router";

export default function AuthCallback() {
  useEffect(() => {
    router.replace("/(auth)");
  }, []);

  return null;
}
