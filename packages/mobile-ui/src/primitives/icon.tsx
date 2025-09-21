import React from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import { useTheme as useRestyleTheme, type BaseTheme } from '@shopify/restyle';
import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
  // add more sets if you need them later
} from '@expo/vector-icons';
import { resolveColor } from '../theme';

const iconSets = {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} as const;

export type IconType = keyof typeof iconSets;

export function makeIcon<const TTheme extends BaseTheme>() {
  type Theme = TTheme;

  type Props = {
    name: string; // icon name in the chosen set
    type?: IconType; // defaults to "Feather"
    size?: number; // defaults to 18
    colorToken?: keyof Theme['colors'] | string; // token or raw color
    style?: StyleProp<TextStyle>;
  };

  const Icon: React.FC<Props> = ({
    name,
    type = 'Feather',
    size = 18,
    colorToken = 'foreground' as any,
    style,
  }) => {
    const theme = useRestyleTheme<Theme>() as any;
    const Comp = iconSets[type] ?? Feather;
    const color = resolveColor(theme.colors, colorToken as any);

    // vector-icons components accept { name, size, color, style }
    return (
      <Comp name={name as any} size={size} color={color} style={style as any} />
    );
  };

  return Icon;
}
