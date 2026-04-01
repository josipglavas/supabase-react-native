import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Platform } from "react-native";

type OAuthButtonsProps = {
  onGooglePress: () => Promise<void>;
  onApplePress: () => Promise<void>;
  loadingProvider: "google" | "apple" | null;
};

export const OAuthButtons = ({
  onGooglePress,
  onApplePress,
  loadingProvider,
}: OAuthButtonsProps) => {
  return (
    <HStack space="sm" className="w-full">
      <Button
        className="flex-1"
        variant="outline"
        action="secondary"
        size="lg"
        onPress={onGooglePress}
        isDisabled={loadingProvider !== null}
      >
        <ButtonText>Google</ButtonText>
        {loadingProvider === "google" && <ButtonSpinner />}
      </Button>

      <Button
        className="flex-1"
        variant="outline"
        action="secondary"
        size="lg"
        onPress={onApplePress}
        isDisabled={loadingProvider !== null || Platform.OS === "android"}
      >
        <ButtonText>
          {Platform.OS === "android" ? "Apple (iOS)" : "Apple"}
        </ButtonText>
        {loadingProvider === "apple" && <ButtonSpinner />}
      </Button>
    </HStack>
  );
};
