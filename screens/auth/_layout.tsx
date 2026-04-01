import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { ChevronLeftIcon } from "@/components/ui/icon";

import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { router, useSegments } from "expo-router";
import { Spool } from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default ({
  children,
  onPress,
  buttonText,
  buttonDisabled,
}: {
  children: React.ReactNode;
  onPress: () => Promise<void> | void;
  buttonText: string;
  buttonDisabled: boolean;
}) => {
  const segments = useSegments();

  // state for loading for button
  const [loading, setLoading] = useState(false);

  // handle button press with loading state
  const handlePress = async () => {
    setLoading(true);
    try {
      await onPress();
    } finally {
      setLoading(false);
    }
  };

  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#fff" : "#000";
  const isUsernameScreen = segments[0] === "(auth)" && segments[1] === "username";

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <VStack className="justify-between h-full w-full">
            <VStack className="items-center justify-center">
              <HStack className="justify-between w-full p-3">
                {/* Dont show button if first screen / we have nothing to go back to */}
                {!isUsernameScreen && router.canGoBack() ? (
                  <Button
                    onPress={() => router.back()}
                    size="lg"
                    variant="link"
                  >
                    {/* Back icon */}
                    <ButtonIcon as={ChevronLeftIcon} color={iconColor} />
                    <ButtonText variant="outline" className="">
                      Back
                    </ButtonText>
                  </Button>
                ) : (
                  <View className="w-12 h-12 opacity-0" />
                )}
                <Spool size={48} color={iconColor} className="mb-4" />
                <View className="w-12 h-12 opacity-0" />
                {/* Placeholder for spacing */}
              </HStack>
            </VStack>
            <VStack space="md" className="p-3">
              {children}
            </VStack>
            <VStack className="items-center justify-center p-3">
              <Button
                onPress={handlePress}
                isDisabled={buttonDisabled}
                size="lg"
                className="w-full rounded-xl"
                variant="solid"
                action="primary"
              >
                <ButtonText>{buttonText}</ButtonText>
                {loading && <ButtonSpinner />}
              </Button>
            </VStack>
          </VStack>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
