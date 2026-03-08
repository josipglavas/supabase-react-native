import { Input, InputField } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useState } from "react";
import Layout from "./_layout";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import CountryPicker from "@avaiyakapil/react-native-country-picker";
import { CountryCode, Country } from "@avaiyakapil/react-native-country-picker";
import { useColorScheme } from "@/components/useColorScheme";

export default () => {
  const [countryCode, setCountryCode] = useState<CountryCode>("US");
  const [countryCallingCode, setCountryCallingCode] = useState("1");
  const [phone, setPhone] = useState("");
  const router = useRouter();

  const colorScheme = useColorScheme();
  const borderColor = colorScheme === "dark" ? "#747474" : "#D5D4D4";
  const pickerColors = {
    grayLight: colorScheme === "dark" ? "#404040" : "#E5E5E5",
    white: colorScheme === "dark" ? "#1F1F1F" : "#FFFFFF",
    grayBackground: colorScheme === "dark" ? "#2A2A2A" : "#F5F5F5",
    gray: colorScheme === "dark" ? "#888888" : "#999999",
    dark: colorScheme === "dark" ? "#FFFFFF" : "#000000",
  };

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: `+${countryCallingCode}${phone}`,
    });

    if (!error) {
      router.push({
        pathname: "/(auth)/verify",
        params: { phone: `+${countryCallingCode}${phone}` },
      });
    }
  };

  return (
    <Layout
      onPress={handleSignIn}
      buttonText="Sign In"
      buttonDisabled={phone.length < 7}
    >
      <Text className="text-lg font-bold text-typography-900">
        Enter your phone number
      </Text>
      <HStack className="w-full items-center">
        <CountryPicker
          countryCode={countryCode}
          onSelect={(code: CountryCode, country: Country) => {
            setCountryCode(code);
            setCountryCallingCode(country.callingCode[0]);
          }}
          autoFocusSearch
          showCallingCode
          enableSearch
          flagSize={20}
          dropdownIconSize={20}
          theme={colorScheme === "dark" ? "dark" : "light"}
          colors={pickerColors}
          iconColor={colorScheme === "dark" ? "#FFFFFF" : "#000000"}
          containerStyle={{
            marginRight: 6,
            height: 42,
            borderRadius: 4,
            borderColor: borderColor,
            backgroundColor: colorScheme === "dark" ? "#1F1F1F" : "#FFFFFF",
          }}
          headerStyle={{
            backgroundColor: colorScheme === "dark" ? "#1F1F1F" : "#FFFFFF",
          }}
          headerTextStyle={{
            color: colorScheme === "dark" ? "#FFFFFF" : "#000000",
          }}
          listContainerStyle={{
            backgroundColor: colorScheme === "dark" ? "#1F1F1F" : "#FFFFFF",
          }}
          listItemStyle={{
            backgroundColor: colorScheme === "dark" ? "#1F1F1F" : "#FFFFFF",
          }}
          modalStyle={{
            backgroundColor: colorScheme === "dark" ? "#1F1F1F" : "#FFFFFF",
          }}
        />
        <Input
          variant="outline"
          size="xl"
          className="bg-gray-50 dark:bg-gray-800 flex-1 !transition-all !duration-1000"
        >
          <InputField
            placeholder="234-567-8901"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoFocus
            //   secureTextEntry
          />
        </Input>
      </HStack>
    </Layout>
  );
};
