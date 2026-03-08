import React from "react";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import Layout from "./_layout";
import { useAuth } from "@/provider/AuthProvider";

export default () => {
  const [username, setUsername] = React.useState("");
  const { createUser } = useAuth();

  return (
    <Layout
      onPress={() => createUser(username)}
      buttonText="Create Account"
      buttonDisabled={!username}
    >
      <Text className="text-typography-900 mb-2">Create Account</Text>
      <Input variant="outline" size="md">
        <InputField
          placeholder="Enter username"
          value={username}
          onChangeText={setUsername}
        />
      </Input>
    </Layout>
  );
};
