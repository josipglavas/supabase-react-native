import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import GoogleIcon from "./GoogleIcon";


type OAuthButtonsProps = {
  onGooglePress: () => Promise<void>;
  // onApplePress: () => Promise<void>;
  // loadingProvider: "google" | "apple" | null;
  loadingProvider: "google" | null;
};

export const OAuthButtons = ({
  onGooglePress,
  // onApplePress,
  loadingProvider,
}: OAuthButtonsProps) => {
  return (
    <HStack space="sm" className="w-full">
      <Button
        className="flex-1 group"
        variant="outline"
        action="secondary"
        size="lg"
        onPress={onGooglePress}
        isDisabled={loadingProvider !== null}
      >
        {/* google icon, make it opacity if button is not hovered onto */}
        <GoogleIcon className="opacity-50 group-hover:opacity-100" />
        <ButtonText>Continue with Google</ButtonText>
        {loadingProvider === "google" && <ButtonSpinner />}
      </Button>

      {/* <Button
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
      </Button> */}
    </HStack>
  );
};
