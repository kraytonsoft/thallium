import React from 'react';
import { theme, type AppTheme } from './theme';
import { bindTheme } from '@bvno/ui/theme';
import { StatusBar } from 'react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootStack from './screens/root-stack';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './constants/navigation-ref';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@bvno/ui/helpers';

const { Provider } = bindTheme<AppTheme>(theme);

export default function App() {
  return (
    <Provider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <BottomSheetModalProvider>
            <NavigationContainer ref={navigationRef}>
              <ErrorBoundary>
                <StatusBar />
                <RootStack />
                {/*<ToastProvider />*/}
              </ErrorBoundary>
            </NavigationContainer>
          </BottomSheetModalProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
