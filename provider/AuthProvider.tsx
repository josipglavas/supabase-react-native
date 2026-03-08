import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";
import React, { useEffect } from "react";

export const AuthContext = React.createContext({
  user: {},
  setUser: ({}) => {},
  logOut: () => {},
  createUser: (username: string) => {},
});

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState({});
  const [session, setSession] = React.useState<Session | null>(null);

  const createUser = async (username: string) => {
    const { data, error } = await supabase
      .from("User")
      .insert({ id: session?.user.id, username })
      .select()
      .maybeSingle();

    if (!error && data) {
      setUser(data);
      // router.push("/(tabs)");
    }
  };

  const getUser = async (session: Session | null) => {
    if (session) {
      // get user from database
      const { data, error } = await supabase
        .from("User")
        .select()
        .eq("id", session.user.id)
        .maybeSingle();
      if (error) {
        console.log("Error fetching user:", error);
        return;
      }
      // set user in state
      if (data) {
        setUser(data);
        router.push("/(tabs)");
      }
    }
  };

  const logOut = async () => {
    await supabase.auth.signOut();
    setUser({});
    router.push("/(auth)");
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      getUser(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      getUser(session);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logOut, createUser }}>
      {children}
    </AuthContext.Provider>
  );
};
