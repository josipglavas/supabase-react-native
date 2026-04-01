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

export const getProfileByEmail = async (
  email: string,
): Promise<User | null> => {
  const normalizedEmail = email.trim().toLowerCase();

  const { data, error } = await supabase
    .from("User")
    .select()
    .ilike("email", normalizedEmail)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as User | null) ?? null;
};

export const createProfileIfMissing = async (
  id: string,
  email?: string | null,
): Promise<User> => {
  const normalizedEmail = email?.trim().toLowerCase() ?? null;
  console.log("[profile] createProfileIfMissing", { id, normalizedEmail });

  const existing = await getProfileByAuthId(id);
  if (existing) {
    console.log("[profile] found by id", { existing });
    if (normalizedEmail && existing.email !== normalizedEmail) {
      const { data, error } = await supabase
        .from("User")
        .update({ email: normalizedEmail })
        .eq("id", id)
        .select()
        .maybeSingle();

      if (error) {
        throw error;
      }

      return (data as User) ?? existing;
    }

    return existing;
  }

  if (normalizedEmail) {
    const existingByEmail = await getProfileByEmail(normalizedEmail);
    if (existingByEmail) {
      console.log("[profile] found by email", { existingByEmail });
      return existingByEmail;
    }
  }

  const { data, error } = await supabase
    .from("User")
    .insert({ id, email: normalizedEmail })
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }

  console.log("[profile] created new profile", { data });
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

  if (!data) {
    throw new Error("Failed to update username for the authenticated user.");
  }

  return data as User;
};
