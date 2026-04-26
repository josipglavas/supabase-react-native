import { useState, useCallback, useRef, useEffect } from "react";
import { HStack } from "@/components/ui/hstack";
import { Switch } from "@/components/ui/switch";
import { Icon, MoonIcon, SunIcon } from "@/components/ui/icon";
import { useAppTheme } from "@/hooks/useAppTheme";
import { InteractionManager } from "react-native";

export const ThemeToggle = () => {
  const { colorScheme, toggleTheme } = useAppTheme();
  const isDark = colorScheme === "dark";

  const [optimisticDark, setOptimisticDark] = useState(isDark);
  const isToggling = useRef(false); // guard against external sync mid-animation

  // Sync optimistic state if theme changes externally (system theme, etc.)
  useEffect(() => {
    if (!isToggling.current) {
      setOptimisticDark(isDark);
    }
  }, [isDark]);

  const handleToggle = useCallback(() => {
    isToggling.current = true;
    setOptimisticDark((prev) => !prev); // animate immediately

    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        toggleTheme();
        // Release guard after theme settles
        requestAnimationFrame(() => {
          isToggling.current = false;
        });
      }, 240); // extra buffer after interactions clear
    });
  }, [toggleTheme]);

  return (
    <HStack space="md" className="items-center">
      <Icon
        as={SunIcon}
        size="sm"
        className={!optimisticDark ? "text-warning-400" : "text-typography-400"}
      />
      <Switch
        size="md"
        value={optimisticDark}
        onToggle={handleToggle}
      />
      <Icon
        as={MoonIcon}
        size="sm"
        className={optimisticDark ? "text-primary-300" : "text-typography-400"}
      />
    </HStack>
  );
};