import React, { useState } from "react";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import Layout from "./_layout";
import { useAuth } from "@/provider/AuthProvider";
import { HStack } from "@/components/ui/hstack";
import CountryPicker from "@avaiyakapil/react-native-country-picker";
import { CountryCode, Country } from "@avaiyakapil/react-native-country-picker";
import { useColorScheme } from "@/components/useColorScheme";

export default () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>("US");
  const [countryCallingCode, setCountryCallingCode] = useState("1");
  const [phone, setPhone] = useState("");
  const { completeUserdata, authError } = useAuth();

  const colorScheme = useColorScheme();
  const borderColor = colorScheme === "dark" ? "#747474" : "#D5D4D4";
  const pickerColors = {
    grayLight: colorScheme === "dark" ? "#404040" : "#E5E5E5",
    white: colorScheme === "dark" ? "#1F1F1F" : "#FFFFFF",
    grayBackground: colorScheme === "dark" ? "#2A2A2A" : "#F5F5F5",
    gray: colorScheme === "dark" ? "#888888" : "#999999",
    dark: colorScheme === "dark" ? "#FFFFFF" : "#000000",
  };

  const handleSubmit = async () => {
    // create phone with country code if phone is provided
    const fullPhone = phone.trim() ? `+${countryCallingCode}${phone.trim()}` : undefined;
    
    await completeUserdata(firstName.trim(), lastName.trim(), fullPhone);
  };

  return (
    <Layout
      onPress={handleSubmit}
      buttonText="Continue"
      buttonDisabled={!firstName.trim() || !lastName.trim()}
    >
      <Text className="text-typography-900 mb-2">Tell us about yourself</Text>
      <Input variant="outline" size="md">
        <InputField
          placeholder="First name"
          value={firstName}
          onChangeText={setFirstName}
          autoFocus
        />
      </Input>
      <Input variant="outline" size="md" className="mt-3">
        <InputField
          placeholder="Last name"
          value={lastName}
          onChangeText={setLastName}
        />
      </Input>
      <Text className="text-typography-900 mb-2 mt-4">Phone (optional)</Text>
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
          />
        </Input>
      </HStack>
      {authError ? <Text className="text-error-600 mt-3">{authError}</Text> : null}
    </Layout>
  );
};
