// import { Button, ButtonText } from "@/components/ui/button";
// import { Divider } from "@/components/ui/divider";
// import { Heading } from "@/components/ui/heading";
// import { Text } from "@/components/ui/text";
// import { useAuth } from "@/provider/AuthProvider";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { StatusBar } from "expo-status-bar";
// import { useColorScheme } from "nativewind";
// import { ThemeToggle } from "@/components/ThemeToggle";
// import { VStack } from "@/components/ui/vstack";

// export default () => {
//   const { logOut } = useAuth();
//   const { colorScheme } = useColorScheme();

//   return (
//     <SafeAreaView className="flex-1">
//       <Heading className="font-bold text-2xl">Profile</Heading>
//       <Divider className="my-[30px] w-[80%]" />
//       <VStack>

//       </VStack>
//       <Button className="mt-4" onPress={logOut}>
//         <ButtonText>Sign Out</ButtonText>
//       </Button>
//       <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
//       <Text className="text-typography-700 font-medium">Appearance</Text>
//       <ThemeToggle />
//     </SafeAreaView>
//   );
// };
import { Button, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/provider/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { ThemeToggle } from "@/components/ThemeToggle";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";

type ProfileRowProps = {
  label: string;
  value: string | null | undefined;
};

const ProfileRow = ({ label, value }: ProfileRowProps) => (
  <HStack className="justify-between items-center py-3">
    <Text className="text-typography-500 text-sm font-medium">{label}</Text>
    <Text className="text-typography-900 dark:text-typography-50 text-sm font-semibold">
      {value ?? "—"}
    </Text>
  </HStack>
);

export default () => {
  const { user, logOut } = useAuth();
  const { colorScheme } = useColorScheme();

  const displayName =
    user?.firstName || user?.lastName
      ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
      : "You";

  const formattedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <SafeAreaView className="flex-1 bg-background-0 px-5">
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <Heading className="font-bold text-2xl mt-2">Profile</Heading>
      <Divider className="my-5" />

      <VStack className="flex-1">
        {/* Avatar + Name */}
        <HStack className="items-center gap-4 mb-6">
          <Avatar size="md">
            <AvatarFallbackText>{displayName}</AvatarFallbackText>
            <AvatarImage
              source={user?.avatar ? { uri: user.avatar } : undefined}
            />
            <AvatarBadge />
          </Avatar>
          <VStack>
            <Heading className="text-xl font-bold">{displayName}</Heading>
            <Text className="text-typography-500 text-sm">{user?.email}</Text>
          </VStack>
        </HStack>

        {/* Info Card */}
        <Box className="bg-background-50 dark:bg-background-100 rounded-2xl px-4 mb-6">
          <ProfileRow label="First Name" value={user?.firstName} />
          <Divider />
          <ProfileRow label="Last Name" value={user?.lastName} />
          <Divider />
          <ProfileRow label="Email" value={user?.email} />
          <Divider />
          <ProfileRow label="Phone" value={user?.phone} />
          <Divider />
          <ProfileRow label="Member Since" value={formattedDate} />
        </Box>

        {/* Appearance */}
        <Box className="bg-background-50 dark:bg-background-100 rounded-2xl px-4 py-3 mb-6">
          <HStack className="justify-between items-center">
            <Text className="text-typography-700 font-medium">Appearance</Text>
            <ThemeToggle />
          </HStack>
        </Box>

        {/* Sign Out */}
        <Button
          className="mt-auto mb-4"
          variant="outline"
          action="negative"
          onPress={logOut}
        >
          <ButtonText>Sign Out</ButtonText>
        </Button>
      </VStack>
    </SafeAreaView>
  );
};