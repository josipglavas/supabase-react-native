import { HStack } from "@/components/ui/hstack";
import { Switch } from "@/components/ui/switch";
import { Icon, MoonIcon, SunIcon } from "@/components/ui/icon";
import { useAppTheme } from "@/hooks/useAppTheme";

export const ThemeToggle = () => {
  const { colorScheme, toggleTheme } = useAppTheme();
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
        onToggle={toggleTheme}
      />

      <Icon
        as={MoonIcon}
        size="sm"
        className={isDark ? "text-primary-300" : "text-typography-400"}
      />
    </HStack>
  );
};