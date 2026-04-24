import { useState } from "react";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import { Pressable } from "react-native";
import Layout from "./_layout";
import { EmailPasswordFields } from "@/components/auth/EmailPasswordFields";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { useAuth } from "@/provider/AuthProvider";
import { Center } from "@/components/ui/center";

export default () => {
  const router = useRouter();
  const { registerEmail, loginGoogle, loginAzure, authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingProvider, setLoadingProvider] = useState<
    "google"| "azure" | null
  >(null);

  const handleRegister = async () => {
    await registerEmail(email, password);
  };

  const handleGoogle = async () => {
    setLoadingProvider("google");
    try {
      await loginGoogle();
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleAzure = async () => {
    setLoadingProvider("azure");
    try {
      await loginAzure();
    } finally {
      setLoadingProvider(null);
    }
  }

  // const handleApple = async () => {
  //   setLoadingProvider("apple");
  //   try {
  //     await loginApple();
  //   } finally {
  //     setLoadingProvider(null);
  //   }
  // };

  return (
    <Layout
      onPress={handleRegister}
      buttonText="Create Account"
      buttonDisabled={!email.trim() || password.length < 6}
    >
      <Text className="text-lg font-bold text-typography-900">Register</Text>
      <Text className="text-typography-700">
        Create an account with email and password.
      </Text>

      <EmailPasswordFields
        email={email}
        password={password}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
      />  
      
      <Center>
        <Text className="font-semibold">Or Continue with</Text>
      </Center>
      
      <OAuthButtons
        onGooglePress={handleGoogle}
        onAzurePress={handleAzure}
        // onApplePress={handleApple}
        loadingProvider={loadingProvider}
      />

      {authError ? <Text className="text-error-600">{authError}</Text> : null}

      <Pressable onPress={() => router.replace("/(auth)")}>
        <Text className="text-center text-typography-700">
          Already have an account? Log in
        </Text>
      </Pressable>
    </Layout>
  );
};
