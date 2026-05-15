import { Stack } from "expo-router";
import { isLiquidGlassSupported } from "@callstack/liquid-glass";

export default () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: isLiquidGlassSupported ? "transparent" : undefined,
        },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
      <Stack.Screen name="userdata" />
    </Stack>
  );
};
