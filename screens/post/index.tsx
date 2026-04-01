import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { useAuth } from "@/provider/AuthProvider";
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
import { View } from "react-native";
import { Input, InputField } from "@/components/ui/input";

export default () => {
  const { user } = useAuth();
  const displayUsername = user?.username || "You";
  return (
    <SafeAreaView className="py-4">
      <VStack>
        <HStack className="items-center px-5 py-0">
          <Avatar size="md">
            <AvatarFallbackText>{displayUsername}</AvatarFallbackText>
            <AvatarImage
              source={user?.avatar ? { uri: user.avatar } : undefined}
            />
          </Avatar>
          <Card size="md" variant="ghost" className="mx-3 py-1 w-full">
            <VStack className="justify-start px-3" space="lg">
              <VStack>
                <Heading size="md">{displayUsername}</Heading>
                <Input
                  className="bg-transparent border-0 w-[90%] p-0"
                  size="md"
                >
                  <InputField
                    placeholder="What's new?"
                    className="p-0"
                    autoFocus
                  />
                </Input>
              </VStack>
            </VStack>
          </Card>
        </HStack>
        <HStack className="items-center justify-center p-0 mt-1" space="3xl">
          <View className="px-2" />
          <Images size={24} color={"gray"} strokeWidth={1.5} />
          <Camera size={24} color={"gray"} strokeWidth={1.5} />
          <Sticker size={24} color={"gray"} strokeWidth={1.5} />
          <Mic size={24} color={"gray"} strokeWidth={1.5} />
          <Hash size={24} color={"gray"} strokeWidth={1.5} />
          <MapPin size={24} color={"gray"} strokeWidth={1.5} />
        </HStack>
      </VStack>
    </SafeAreaView>
  );
};
