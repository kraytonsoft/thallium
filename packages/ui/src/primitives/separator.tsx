import React from 'react';
import {
  createBox,
  useTheme as useRestyleTheme,
  type BaseTheme,
  type BoxProps as RestyleBoxProps,
} from '@shopify/restyle';
import type { StyleProp, ViewStyle } from 'react-native';
import { resolveColor } from '../theme';

export type SeparatorPropsFor<T extends BaseTheme> = Omit<
  RestyleBoxProps<T>,
  'height' | 'width' | 'backgroundColor'
> & {
  direction?: 'horizontal' | 'vertical';
  thickness?: number;
  length?: number | string;
  colorToken?: keyof T['colors'] | string;
  style?: StyleProp<ViewStyle>;
};

export function makeSeparator<const TTheme extends BaseTheme>() {
  const Box = createBox<TTheme>();

  const Separator: React.FC<SeparatorPropsFor<TTheme>> = ({
    direction = 'horizontal',
    thickness = 1,
    length = '100%',
    colorToken,
    style,
    ...rest
  }) => {
    const theme = useRestyleTheme<TTheme>() as any;
    const isHorizontal = direction === 'horizontal';

    // Pick a reasonable default color from the theme if none provided.
    const fallbackToken =
      ('border' in theme.colors && 'border') ||
      ('muted' in theme.colors && 'muted') ||
      ('foreground' in theme.colors && 'foreground') ||
      (Object.keys(theme.colors)[0] as string | undefined);

    const backgroundColor = resolveColor(
      theme.colors,
      (colorToken ?? fallbackToken ?? 'black') as any
    );

    const width = isHorizontal ? length : thickness;
    const height = isHorizontal ? thickness : length;

    return (
      <Box
        width={width as any}
        height={height as any}
        style={[{ backgroundColor }, style]}
        {...rest}
      />
    );
  };

  return Separator;
}
