import React from "react";
import { Tabs, useRouter } from "expo-router";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { Heart, Home, Plus, Search, User } from "lucide-react-native";

// function TabBarIcon(props: {
//   name: React.ComponentProps<typeof FontAwesome>["name"];
//   color: string;
// }) {
//   return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
// }

export default function TabLayout() {
  const router = useRouter();
  return (
    <Tabs
      screenOptions={{
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: false, //useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="empty"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <Plus size={24} color={color} />,
        }}
        listeners={{
          tabPress: (e) => {
            router.push("/post");
            // Prevent default action
            e.preventDefault();
          },
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
