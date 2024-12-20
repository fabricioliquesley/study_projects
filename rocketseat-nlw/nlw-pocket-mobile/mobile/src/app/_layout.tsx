import { Stack } from "expo-router";
import {
  useFonts,
  Rubik_600SemiBold,
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_700Bold
} from "@expo-google-fonts/rubik";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { COLORS } from "@/styles/theme";
import { Loading } from "@/components/Loading";

export default function Layout() { 
  const [fontsLoaded] = useFonts({
    Rubik_600SemiBold,
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_700Bold
  });

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack 
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.gray[100] }
        }}
      />
    </GestureHandlerRootView>
  )
}