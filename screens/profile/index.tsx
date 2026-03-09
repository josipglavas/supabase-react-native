import { Button, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/provider/AuthProvider";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { ThemeToggle } from "@/components/ThemeToggle";

export default () => {
  const { logOut } = useAuth();
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <SafeAreaView className="flex-1">
      <Heading className="font-bold text-2xl">Profile</Heading>
      <Divider className="my-[30px] w-[80%]" />
      <Button className="mt-4" onPress={logOut}>
        <ButtonText>Sign Out</ButtonText>
      </Button>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Text className="text-typography-700 font-medium">Appearance</Text>
      <ThemeToggle />
    </SafeAreaView>
  );
};
