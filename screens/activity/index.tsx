import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { SafeAreaView } from "react-native-safe-area-context";

export default () => {
  return (
    <SafeAreaView className="flex-1">
      <Heading className="font-bold text-2xl">Activity</Heading>
      <Divider className="my-[30px] w-[80%]" />
    </SafeAreaView>
  );
};
