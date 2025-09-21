import React from 'react';
import {
  ThemeProvider as RestyleProvider,
  useTheme as useRestyleTheme,
  type BaseTheme,
} from '@shopify/restyle';

export function bindTheme<const TTheme extends BaseTheme>(theme: TTheme) {
  const Provider: React.FC<React.PropsWithChildren> = ({ children }) => (
    <RestyleProvider theme={theme}>{children}</RestyleProvider>
  );

  const useTheme = () => useRestyleTheme<TTheme>();

  return { Provider, useTheme };
}
