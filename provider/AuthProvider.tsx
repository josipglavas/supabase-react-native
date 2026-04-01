import { supabase } from "@/lib/supabase";
import { createProfileIfMissing, updateUsername } from "@/lib/auth/profile";
import {
  loginWithApple,
  loginWithEmail,
  loginWithGoogle,
  registerWithEmail,
  signOut,
} from "@/lib/auth/supabaseAuth";
import User from "@/models/User";
import { Session } from "@supabase/supabase-js";
import { useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isInitializing: boolean;
  authError: string | null;
  loginEmail: (email: string, password: string) => Promise<void>;
  registerEmail: (email: string, password: string) => Promise<void>;
  loginGoogle: () => Promise<void>;
  loginApple: () => Promise<void>;
  completeUsername: (username: string) => Promise<void>;
  logOut: () => Promise<void>;
  clearAuthError: () => void;
};

const defaultContext: AuthContextType = {
  user: null,
  session: null,
  isInitializing: true,
  authError: null,
  loginEmail: async () => {},
  registerEmail: async () => {},
  loginGoogle: async () => {},
  loginApple: async () => {},
  completeUsername: async () => {},
  logOut: async () => {},
  clearAuthError: () => {},
};

export const AuthContext = React.createContext<AuthContextType>(defaultContext);

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [isInitializing, setIsInitializing] = React.useState(true);
  const [isSyncingProfile, setIsSyncingProfile] = React.useState(true);
  const router = useRouter();
  const segments = useSegments();

  const clearAuthError = () => setAuthError(null);

  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      if (
        message.includes("duplicate key") ||
        message.includes("already exists") ||
        message.includes("unique constraint") ||
        message.includes("duplicate")
      ) {
        return "That username is already taken. Please choose another.";
      }
      return error.message;
    }

    return "Something went wrong. Please try again.";
  };

  const resolveSessionEmail = (sessionUser: Session["user"]) => {
    const emailCandidates = [
      sessionUser.email,
      (sessionUser as any).user_metadata?.email,
      (sessionUser as any).raw_user_meta_data?.email,
      (sessionUser as any).app_metadata?.provider_email,
      (sessionUser as any).identities?.[0]?.identity_data?.email,
    ];

    const resolved = emailCandidates.find(
      (candidate) => typeof candidate === "string" && candidate.length > 0,
    );

    console.log("[AuthProvider] resolved session email", {
      sessionUser,
      resolved,
      emailCandidates,
    });

    return resolved ?? null;
  };

  const syncProfile = async (activeSession: Session | null) => {
    console.log("[AuthProvider] syncProfile start", { activeSession });

    if (!activeSession) {
      setUser(null);
      setIsSyncingProfile(false);
      return;
    }

    setIsSyncingProfile(true);

    try {
      const profile = await createProfileIfMissing(
        activeSession.user.id,
        resolveSessionEmail(activeSession.user),
      );
      console.log("[AuthProvider] syncProfile result", { profile });
      setUser(profile);
    } catch (error) {
      console.log("[AuthProvider] Error syncing profile:", error);
      setAuthError(getErrorMessage(error));
    } finally {
      setIsSyncingProfile(false);
    }
  };

  const registerEmail = async (email: string, password: string) => {
    clearAuthError();
    const { data, error } = await registerWithEmail(email, password);

    if (error) {
      setAuthError(error.message);
      throw error;
    }

    if (!data.session && data.user) {
      setAuthError(
        "Check your email to confirm your account before logging in.",
      );
    }
  };

  const loginEmail = async (email: string, password: string) => {
    clearAuthError();
    const { error } = await loginWithEmail(email, password);
    if (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const loginGoogleProvider = async () => {
    console.log("[AuthProvider] loginGoogleProvider start");
    clearAuthError();
    try {
      await loginWithGoogle();
      console.log("[AuthProvider] loginGoogleProvider success");
    } catch (error) {
      console.log("[AuthProvider] loginGoogleProvider error", { error });
      setAuthError(getErrorMessage(error));
      throw error;
    }
  };

  const loginAppleProvider = async () => {
    console.log("[AuthProvider] loginAppleProvider start");
    clearAuthError();
    try {
      await loginWithApple();
      console.log("[AuthProvider] loginAppleProvider success");
    } catch (error) {
      console.log("[AuthProvider] loginAppleProvider error", { error });
      setAuthError(getErrorMessage(error));
      throw error;
    }
  };

  const completeUsername = async (username: string) => {
    const profileId = user?.id ?? session?.user.id;
    console.log("[AuthProvider] completeUsername start", {
      username,
      profileId,
      currentUser: user,
      sessionUserId: session?.user.id,
    });

    if (!profileId) {
      return;
    }

    clearAuthError();

    try {
      const updatedUser = await updateUsername(profileId, username);
      console.log("[AuthProvider] completeUsername success", { updatedUser });
      setUser(updatedUser);
    } catch (error) {
      console.log("[AuthProvider] completeUsername error", { error });
      setAuthError(getErrorMessage(error));
      throw error;
    }
  };

  const logOut = async () => {
    clearAuthError();
    await signOut();
    setUser(null);
    setSession(null);
  };

  useEffect(() => {
    let isMounted = true;

    const bootstrapAuth = async () => {
      setIsInitializing(true);
      setIsSyncingProfile(true);

      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      console.log("[AuthProvider] bootstrapAuth session", { initialSession });
      setSession(initialSession);
      await syncProfile(initialSession);
      if (isMounted) {
        setIsInitializing(false);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      console.log("[AuthProvider] onAuthStateChange", { event: _event, newSession });
      setSession(newSession);
      setIsInitializing(true);
      await syncProfile(newSession);
      setIsInitializing(false);
    });

    bootstrapAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isInitializing || isSyncingProfile) {
      console.log("[AuthProvider] route check skipped", {
        isInitializing,
        isSyncingProfile,
        sessionExists: Boolean(session),
        username: user?.username,
        segments,
      });
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";
    const inUsernameScreen = inAuthGroup && segments[1] === "username";

    console.log("[AuthProvider] route check", {
      inAuthGroup,
      inUsernameScreen,
      sessionExists: Boolean(session),
      username: user?.username,
      segments,
    });

    if (!session) {
      if (!inAuthGroup) {
        router.replace("/(auth)");
      }
      return;
    }

    const usernameMissing = !user?.username;

    if (usernameMissing) {
      if (!inUsernameScreen) {
        router.replace("/(auth)/username");
      }
      return;
    }

    if (inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isInitializing, isSyncingProfile, router, segments, session, user?.username]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isInitializing,
        authError,
        loginEmail,
        registerEmail,
        loginGoogle: loginGoogleProvider,
        loginApple: loginAppleProvider,
        completeUsername,
        logOut,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
