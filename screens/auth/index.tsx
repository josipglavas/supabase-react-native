import { EmailPasswordFields } from "@/components/auth/EmailPasswordFields";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { useAuth } from "@/provider/AuthProvider";
import { useRouter } from "expo-router";
import { useState } from "react";
import Layout from "./_layout";
import { Text } from "@/components/ui/text";
import { Pressable } from "react-native";
import { Center } from "@/components/ui/center";

export default () => {
  const { loginEmail, loginGoogle, loginAzure, authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [loadingProvider, setLoadingProvider] = useState<
  //   "google" | "apple" | null
  // >(null);
    const [loadingProvider, setLoadingProvider] = useState<
    "google" | "azure" | null
  >(null);
  const router = useRouter();

  const handleLogin = async () => {
    await loginEmail(email, password);
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
      onPress={handleLogin}
      buttonText="Log In"
      buttonDisabled={!email.trim() || password.length < 6}
    >
      <Text className="text-lg font-bold text-typography-900">
        Welcome back
      </Text>
      <Text className="text-typography-700">
        Log in with email and password.
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

      <Pressable onPress={() => router.navigate("/register")}>
        <Text className="text-center text-typography-700">
          New here? Create an account
        </Text>
      </Pressable>
    </Layout>
  );
};
