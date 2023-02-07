import React, { useState, useEffect, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./app/navigation/AuthNavigator";
import NavigationTheme from "./app/navigation/NavigationTheme";
import OfflineNotice from "./app/components/OfflineNotice";
import AuthContext from "./app/auth/context";
import AppNavigator from "./app/navigation/AppNavigator";
import authStorage from "./app/auth/storage";
import AppLoading from "expo-app-loading";
import * as SplashScreen from "expo-splash-screen";
import { View, Text } from "react-native";
import { navigationRef } from "./app/navigation/rootNavigation";

export default function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);

  const restoreUser = async () => {
    const user = await authStorage.getUser();
    if (user) setUser(user);
  };

  async function prepare() {
    try {
      restoreUser();
      await SplashScreen.preventAutoHideAsync();
    } catch (e) {
      console.warn(e);
    } finally {
      setIsReady(true);
    }
  }

  useEffect(() => {
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return <OfflineNotice />;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <AuthContext.Provider value={{ user, setUser }}>
        <OfflineNotice />
        <NavigationContainer ref={navigationRef} theme={NavigationTheme}>
          {user ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      </AuthContext.Provider>
    </View>
  );
}
