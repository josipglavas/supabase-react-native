import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import GoogleIcon from "./GoogleIcon";
import MicrosoftIcon from "./MicrosoftIcon";


type OAuthButtonsProps = {
  onGooglePress: () => Promise<void>;
  onAzurePress: () => Promise<void>;
  // onApplePress: () => Promise<void>;
  // loadingProvider: "google" | "apple" | null;
  loadingProvider: "google"| "azure" | null;
};

export const OAuthButtons = ({
  onGooglePress,
  onAzurePress,
  // onApplePress,
  loadingProvider,
}: OAuthButtonsProps) => {
  return (
    <VStack space="sm" className="w-full">
      <Button
        size="lg"
        className="w-full rounded-xl group"
        variant="outline"
        action="secondary"
        onPress={onGooglePress}
        isDisabled={loadingProvider !== null}
      >
        {/* google icon, make it opacity if button is not hovered onto. Added spcaes so the icons align */}
        <GoogleIcon className="opacity-50 group-hover:opacity-100" />
        <ButtonText>Continue with Google    </ButtonText>
        {loadingProvider === "google" && <ButtonSpinner />}
      </Button>

      <Button
        size="lg"
        className="w-full rounded-xl group"
        variant="outline"
        action="secondary"
        onPress={onAzurePress}
        isDisabled={loadingProvider !== null}
      >
        <MicrosoftIcon className="opacity-50 group-hover:opacity-100" />
        <ButtonText>Continue with Microsoft</ButtonText>
        {loadingProvider === "azure" && <ButtonSpinner />}
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
    </VStack>
  );
};
