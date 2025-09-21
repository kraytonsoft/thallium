import React from 'react';
import {
  ActivityIndicator,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme as useRestyleTheme, type BaseTheme } from '@shopify/restyle';
import { resolveColor } from '../theme';

export function makeSpinner<const TTheme extends BaseTheme>() {
  type Props = {
    size?: number | 'small' | 'large';
    color?: keyof TTheme['colors'] | string;
    style?: StyleProp<ViewStyle>;
  };

  const Spinner: React.FC<Props> = ({
    size = 'small',
    color: colorToken,
    style,
  }) => {
    const theme = useRestyleTheme<TTheme>() as any;
    const fallback =
      ('brand' in theme.colors && 'brand') ||
      ('foreground' in theme.colors && 'foreground') ||
      (Object.keys(theme.colors)[0] as string);
    const color = resolveColor(theme.colors, colorToken ?? fallback);
    return <ActivityIndicator size={size} color={color} style={style} />;
  };

  return Spinner;
}
