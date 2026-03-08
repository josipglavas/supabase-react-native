import { Button, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { useAuth } from "@/provider/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";

export default () => {
  const { logOut } = useAuth();

  return (
    <SafeAreaView className="flex-1">
      <Heading className="font-bold text-2xl">Profile</Heading>
      <Divider className="my-[30px] w-[80%]" />
      <Button className="mt-4" onPress={logOut}>
        <ButtonText>Sign Out</ButtonText>
      </Button>
    </SafeAreaView>
  );
};
