import React from "react";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import Layout from "./_layout";
import { useAuth } from "@/provider/AuthProvider";

export default () => {
  const [username, setUsername] = React.useState("");
  const { completeUsername, authError } = useAuth();

  return (
    <Layout
      onPress={() => completeUsername(username)}
      buttonText="Continue"
      buttonDisabled={!username.trim()}
    >
      <Text className="text-typography-900 mb-2">Choose a username</Text>
      <Input variant="outline" size="md">
        <InputField
          placeholder="Enter username"
          value={username}
          onChangeText={setUsername}
        />
      </Input>
      {authError ? <Text className="text-error-600">{authError}</Text> : null}
    </Layout>
  );
};
