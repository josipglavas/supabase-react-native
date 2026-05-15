import React from "react";
import { Platform, type ColorValue } from "react-native";
import { useRouter } from "expo-router";
import { Heart, Home, Plus, Search, User } from "lucide-react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { isLiquidGlassSupported } from "@callstack/liquid-glass";
import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import HomeScreen from "./index";
import SearchScreen from "./search";
import ActivityScreen from "./activity";
import ProfileScreen from "./profile";

const Tab = createBottomTabNavigator();

const tabImplementation =
  Platform.OS === "ios" || Platform.OS === "android" ? "native" : "custom";

type TabIconProps = { focused: boolean; color: ColorValue; size: number };

function lucideTabIcon(
  Icon: typeof Home,
): NonNullable<BottomTabNavigationOptions["tabBarIcon"]> {
  return ({ color, size }: TabIconProps) => (
    <Icon size={size} color={String(color)} />
  );
}

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tab.Navigator
      implementation={tabImplementation}
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: isLiquidGlassSupported ? "transparent" : undefined,
        },
        tabBarLabelVisibilityMode:
          Platform.OS === "android" ? "unlabeled" : undefined,
      }}
    >
      <Tab.Screen
        name="index"
        component={HomeScreen}
        options={{
          title: "",
          tabBarAccessibilityLabel: "Home",
          tabBarIcon:
            tabImplementation === "native"
              ? Platform.select({
                  ios: { type: "sfSymbol" as const, name: "house.fill" },
                  android: { type: "materialSymbol" as const, name: "home" },
                })
              : lucideTabIcon(Home),
        }}
      />
      <Tab.Screen
        name="search"
        component={SearchScreen}
        options={{
          title: "",
          tabBarAccessibilityLabel: "Search",
          tabBarIcon:
            tabImplementation === "native"
              ? Platform.select({
                  ios: { type: "sfSymbol" as const, name: "magnifyingglass" },
                  android: { type: "materialSymbol" as const, name: "search" },
                })
              : lucideTabIcon(Search),
        }}
      />
      <Tab.Screen
        name="empty"
        component={() => null}
        options={{
          title: "",
          tabBarAccessibilityLabel: "New post",
          tabBarIcon:
            tabImplementation === "native"
              ? Platform.select({
                  ios: { type: "sfSymbol" as const, name: "plus.circle.fill" },
                  android: {
                    type: "materialSymbol" as const,
                    name: "add_circle",
                  },
                })
              : lucideTabIcon(Plus),
          tabBarSelectionEnabled: false,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push("/post");
          },
        }}
      />
      <Tab.Screen
        name="activity"
        component={ActivityScreen}
        options={{
          title: "",
          tabBarAccessibilityLabel: "Activity",
          tabBarIcon:
            tabImplementation === "native"
              ? Platform.select({
                  ios: { type: "sfSymbol" as const, name: "heart.fill" },
                  android: { type: "materialSymbol" as const, name: "favorite" },
                })
              : lucideTabIcon(Heart),
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          title: "",
          tabBarAccessibilityLabel: "Profile",
          tabBarIcon:
            tabImplementation === "native"
              ? Platform.select({
                  ios: { type: "sfSymbol" as const, name: "person.fill" },
                  android: { type: "materialSymbol" as const, name: "person" },
                })
              : lucideTabIcon(User),
        }}
      />
    </Tab.Navigator>
  );
}
