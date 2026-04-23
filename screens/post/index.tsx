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
import { Alert, Image } from "react-native";
import { useState } from "react";
import { ButtonText, Button } from "@/components/ui/button";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/lib/supabase";

export default () => {
  const { user } = useAuth();

  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library.
    // Manually request permissions for videos on iOS when `allowsEditing` is set to `false`
    // and `videoExportPreset` is `'Passthrough'` (the default), ideally before launching the picker
    // so the app users aren't surprised by a system dialog after picking a video.
    // See "Invoke permissions for videos" sub section for more details.
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required.",
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (
      !result.canceled &&
      result.assets.length > 0 &&
      result.assets[0].uri &&
      result.assets[0].mimeType
    ) {
      setImage(result.assets[0].uri);
      // upload file name without "/" and .pop()
      let fileName = result.assets[0].uri.split("/").pop();
      if (!fileName) {
        Alert.alert("Error", "Could not get file name from URI.");
        return;
      }
      uploadFile(result.assets[0].uri, result.assets[0].mimeType, fileName);
    }
  };

  const uploadFile = async (uri: string, type: string, name: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(`${user?.id}/${name}`, blob, {
          contentType: type,
        });

      console.log("Upload result:", { data, error });
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const displayName =
    user?.firstName || user?.lastName
      ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
      : "You";
  return (
    <SafeAreaView className="py-4">
      <VStack>
        <HStack className="items-center px-5 py-0">
          <Avatar size="md">
            <AvatarFallbackText>{displayName}</AvatarFallbackText>
            <AvatarImage
              source={user?.avatar ? { uri: user.avatar } : undefined}
            />
          </Avatar>
          <Card size="md" variant="ghost" className="mx-3 py-1 w-full">
            <VStack className="justify-start px-3" space="lg">
              <VStack>
                <Heading size="md">{displayName}</Heading>
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
        <Button
          onPress={pickImage}
          size="lg"
          className="w-full rounded-xl"
          variant="solid"
          action="primary"
        >
          <ButtonText>Pick an image</ButtonText>
        </Button>
        {image && (
          <Image
            source={{ uri: image }}
            style={{ width: 200, height: 200, borderRadius: 10 }}
          />
        )}
      </VStack>
    </SafeAreaView>
  );
};
