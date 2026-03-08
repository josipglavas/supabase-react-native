import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { useAuth } from "@/provider/AuthProvider";
import { Spool } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VStack } from "@/components/ui/vstack";
import {
  Images,
  Camera,
  Sticker,
  Mic,
  Hash,
  MapPin,
} from "lucide-react-native";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import User from "@/models/User";

export default () => {
  const { user } = useAuth() as unknown as { user: User };
  return (
    <SafeAreaView>
      <HStack className="items-center justify-center">
        <Spool size={48} color="#000" className="mb-4" />
      </HStack>
      <Pressable
        onPress={() => {
          // navigate to post
          router.push("/post");
        }}
      >
        <VStack>
          <HStack className="items-center px-5">
            <Avatar size="md">
              <AvatarFallbackText>{user?.username}</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: user?.avatar,
                }}
              />
              <AvatarBadge />
            </Avatar>
            <Card size="md" variant="ghost" className="m-3">
              <VStack className="justify-start px-3" space="lg">
                <VStack>
                  <Heading size="md" className="mb-1">
                    {user?.username}
                  </Heading>
                  <Text size="md">What's new?</Text>
                </VStack>
              </VStack>
            </Card>
          </HStack>
          <HStack className="items-center justify-center" space="3xl">
            <View className="px-2" />
            <Images size={24} color={"gray"} strokeWidth={1.5} />
            <Camera size={24} color={"gray"} strokeWidth={1.5} />
            <Sticker size={24} color={"gray"} strokeWidth={1.5} />
            <Mic size={24} color={"gray"} strokeWidth={1.5} />
            <Hash size={24} color={"gray"} strokeWidth={1.5} />
            <MapPin size={24} color={"gray"} strokeWidth={1.5} />
          </HStack>
        </VStack>
      </Pressable>
    </SafeAreaView>
  );
};
