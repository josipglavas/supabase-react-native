type User = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  avatar?: string | null;
  email?: string | null;
  created_at: string;
};

export default User;
