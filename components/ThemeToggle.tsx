import { HStack } from "@/components/ui/hstack";
import { Switch } from "@/components/ui/switch";
import { Icon, MoonIcon, SunIcon } from "@/components/ui/icon";
import { useColorScheme } from "nativewind";

export const ThemeToggle = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <HStack space="md" className="items-center">
      <Icon
        as={SunIcon}
        size="sm"
        className={!isDark ? "text-warning-400" : "text-typography-400"}
      />

      <Switch
        size="md"
        value={isDark}
        onToggle={toggleColorScheme}
        trackColor={{
          false: isDark ? "#404040" : "#d4d4d4",
          true: "#525252",
        }}
        thumbColor="#fafafa"
        ios_backgroundColor={isDark ? "#404040" : "#d4d4d4"}
      />

      <Icon
        as={MoonIcon}
        size="sm"
        className={isDark ? "text-primary-300" : "text-typography-400"}
      />
    </HStack>
  );
};
