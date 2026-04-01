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

export const updateProfileDetails = async (
  id: string,
  firstName: string,
  lastName: string,
  phone?: string | null,
): Promise<User> => {
  const normalizedFirstName = firstName.trim();
  const normalizedLastName = lastName.trim();
  const normalizedPhone = phone?.trim() || null;

  const { data, error } = await supabase
    .from("User")
    .update({
      firstName: normalizedFirstName,
      lastName: normalizedLastName,
      phone: normalizedPhone,
    })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Failed to update profile details for the authenticated user.");
  }

  return data as User;
};
