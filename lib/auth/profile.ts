import User from "@/models/User";
import { supabase } from "@/lib/supabase";

export const getProfileByAuthId = async (id: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from("User")
    .select()
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as User | null) ?? null;
};

export const createProfileIfMissing = async (
  id: string,
  _email?: string | null,
): Promise<User> => {
  const existing = await getProfileByAuthId(id);
  if (existing) {
    return existing;
  }

  const { data, error } = await supabase
    .from("User")
    .insert({ id })
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as User;
};

export const updateUsername = async (
  id: string,
  username: string,
): Promise<User> => {
  const normalizedUsername = username.trim();

  const { data, error } = await supabase
    .from("User")
    .update({ username: normalizedUsername })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as User;
};
