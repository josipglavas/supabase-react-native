import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";

type EmailPasswordFieldsProps = {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
};

export const EmailPasswordFields = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
}: EmailPasswordFieldsProps) => {
  return (
    <VStack space="md">
      <Input
        variant="outline"
        size="xl"
        className="bg-gray-50 dark:bg-gray-800"
      >
        <InputField
          placeholder="Email"
          value={email}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          onChangeText={onEmailChange}
        />
      </Input>

      <Input
        variant="outline"
        size="xl"
        className="bg-gray-50 dark:bg-gray-800"
      >
        <InputField
          placeholder="Password"
          value={password}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={onPasswordChange}
        />
      </Input>
    </VStack>
  );
};
