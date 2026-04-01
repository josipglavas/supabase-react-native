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
  const router = useRouter();
  const segments = useSegments();

  const clearAuthError = () => setAuthError(null);

  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
      return error.message;
    }

    return "Something went wrong. Please try again.";
  };

  const syncProfile = async (activeSession: Session | null) => {
    if (!activeSession) {
      setUser(null);
      return;
    }

    try {
      const profile = await createProfileIfMissing(
        activeSession.user.id,
        activeSession.user.email,
      );
      setUser(profile);
    } catch (error) {
      console.log("Error syncing profile:", error);
      setAuthError(getErrorMessage(error));
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
    clearAuthError();
    try {
      await loginWithGoogle();
    } catch (error) {
      setAuthError(getErrorMessage(error));
      throw error;
    }
  };

  const loginAppleProvider = async () => {
    clearAuthError();
    try {
      await loginWithApple();
    } catch (error) {
      setAuthError(getErrorMessage(error));
      throw error;
    }
  };

  const completeUsername = async (username: string) => {
    if (!session) {
      return;
    }

    clearAuthError();

    try {
      const updatedUser = await updateUsername(session.user.id, username);
      setUser(updatedUser);
    } catch (error) {
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
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      setSession(initialSession);
      await syncProfile(initialSession);
      if (isMounted) {
        setIsInitializing(false);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
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
    if (isInitializing) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";
    const inUsernameScreen = inAuthGroup && segments[1] === "username";

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
  }, [isInitializing, router, segments, session, user?.username]);

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
