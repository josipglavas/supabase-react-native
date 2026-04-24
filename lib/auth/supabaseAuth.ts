import { Platform } from "react-native";
import { supabase } from "@/lib/supabase";
import { Provider } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const getRedirectUrl = () => Linking.createURL("auth/callback");

const applyOAuthSessionFromUrl = async (url: string) => {
  const parsed = Linking.parse(url);
  const queryParams = parsed.queryParams ?? {};
  const code = queryParams.code;

  if (typeof code === "string" && code.length > 0) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      throw error;
    }
    return;
  }

  const hashPart = url.split("#")[1];
  if (!hashPart) {
    return;
  }

  const hashParams = new URLSearchParams(hashPart);
  const accessToken = hashParams.get("access_token");
  const refreshToken = hashParams.get("refresh_token");

  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) {
      throw error;
    }
  }
};

const signInWithOAuthProvider = async (provider: Provider) => {
  const redirectTo = getRedirectUrl();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      skipBrowserRedirect: Platform.OS !== "web",
    },
  });

  if (error) {
    throw error;
  }

  if (!data?.url) {
    throw new Error("OAuth URL was not returned.");
  }

  console.log("[supabaseAuth] signInWithOAuthProvider", {
    provider,
    url: data.url,
    platform: Platform.OS,
  });

  if (Platform.OS === "web") {
    window.location.assign(data.url);
    return;
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type === "success" && result.url) {
    await applyOAuthSessionFromUrl(result.url);
    return;
  }

  if (result.type === "cancel") {
    throw new Error("OAuth flow was cancelled.");
  }

  if (result.type === "dismiss") {
    throw new Error("OAuth flow was dismissed.");
  }

  throw new Error("OAuth flow failed.");
};

export const registerWithEmail = async (email: string, password: string) => {
  const normalizedEmail = email.trim();
  return supabase.auth.signUp({
    email: normalizedEmail,
    password,
  });
};

export const loginWithEmail = async (email: string, password: string) => {
  const normalizedEmail = email.trim();
  return supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });
};

export const loginWithGoogle = async () => signInWithOAuthProvider("google");

export const loginWithApple = async () => signInWithOAuthProvider("apple");

export const loginWithAzure = async () => signInWithOAuthProvider("azure");

export const signOut = async () => supabase.auth.signOut();
