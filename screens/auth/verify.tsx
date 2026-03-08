import React from "react";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { supabase } from "@/lib/supabase";
import Layout from "./_layout";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { router } from "expo-router";
import { useColorScheme } from "react-native";

export default () => {
  const [token, setToken] = React.useState("");
  const { phone } = useLocalSearchParams();

  const handleVerify = async (verificationCode?: string) => {
    const codeToVerify = verificationCode || token;
    console.log("Verifying OTP with code:", codeToVerify, "for phone:", phone);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: phone as string,
        token: codeToVerify,
        type: "sms",
      });
      if (error) {
        console.log("Error verifying OTP:", error);
        return;
      }
      router.push("/(auth)/username");
    } catch (error) {
      console.log("Error verifying OTP:", error);
    }
  };

  const colorScheme = useColorScheme();
  const inputColor = colorScheme === "dark" ? "#fff" : "#000";

  return (
    <Layout
      onPress={handleVerify}
      buttonText="Verify"
      buttonDisabled={token.length !== 6}
    >
      <Text className="text-lg font-bold text-typography-900">Verify</Text>
      <OTPInputView
        pinCount={6}
        autoFocusOnLoad
        onCodeChanged={setToken}
        onCodeFilled={(code) => {
          handleVerify(code);
        }}
        style={{ height: 40 }}
        codeInputFieldStyle={{
          borderWidth: 1,
          borderColor: inputColor,
          borderRadius: 10,
          color: inputColor,
        }}
      />
      {/* <Input variant="outline" size="md">
        <InputField
          placeholder="Token"
          value={token}
          onChangeText={setToken}
          keyboardType="phone-pad"
          //   secureTextEntry
        />
      </Input> */}
    </Layout>
  );
};
