import React from 'react';
import {
  Pressable,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {
  createText,
  createBox,
  useTheme as useRestyleTheme,
  type BaseTheme,
} from '@shopify/restyle';
import {
  resolveColor,
  type ButtonVariantNameFrom,
  type ButtonSizeNameFrom,
  type TextVariantNameFrom,
} from '../theme';

export function makeButton<const TTheme extends BaseTheme>() {
  const Text = createText<TTheme>();
  const Box = createBox<TTheme>(); // ← use Box instead of View
  type LabelProps = React.ComponentProps<typeof Text>;

  type Props = {
    variant?: ButtonVariantNameFrom<TTheme>;
    size?: ButtonSizeNameFrom<TTheme>;
    labelVariant?: TextVariantNameFrom<TTheme>;
    disabled?: boolean;
    isLoading?: boolean;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    fullWidth?: boolean;
    left?: React.ReactNode;
    right?: React.ReactNode;
  } & Omit<LabelProps, 'variant' | 'children' | 'color'> & {
      children?: React.ReactNode;
    };

  const Button: React.FC<Props> = ({
    variant,
    size,
    labelVariant = 'body' as any,
    disabled,
    isLoading,
    onPress,
    style,
    fullWidth,
    left,
    right,
    children,
    ...labelRest
  }) => {
    const theme = useRestyleTheme<TTheme>() as any;

    const defaults = theme.buttons?.defaults ?? {};
    const vKey = (
      disabled ? 'disabled' : variant ?? defaults.variant ?? 'primary'
    ) as string;
    const sKey = (size ?? defaults.size ?? 'md') as string;
    const pressedOpacity =
      typeof defaults.pressedOpacity === 'number'
        ? defaults.pressedOpacity
        : 0.85;

    const v =
      theme.buttons?.variants?.[vKey] ?? theme.buttons?.variants?.primary;
    const s = theme.buttons?.sizes?.[sKey] ?? theme.buttons?.sizes?.md;

    const backgroundColor = resolveColor(theme.colors, v?.bg ?? 'transparent');
    const borderColor = resolveColor(theme.colors, v?.border ?? 'transparent');
    const textColorToken = v?.text ?? ('foreground' as any);
    const borderRadius = theme.borderRadii?.[v?.radius ?? ('sm' as any)] ?? 8;

    const paddingH = s?.paddingH ?? v?.padding ?? 12;
    const paddingV = s?.paddingV ?? v?.padding ?? 10;
    const gap = s?.gap ?? 8;
    const minHeight = s?.minHeight ?? undefined;
    const borderWidth = s?.borderWidth ?? v?.borderWidth ?? 1;

    const isPlain =
      typeof children === 'string' || typeof children === 'number';
    const content = isPlain ? (
      <Text
        variant={labelVariant as any}
        color={textColorToken as any}
        {...labelRest}
      >
        {children as any}
      </Text>
    ) : (
      children
    );

    const spinnerColor = resolveColor(theme.colors, textColorToken as any);
    const leftNode = isLoading ? (
      <ActivityIndicator size="small" color={spinnerColor} />
    ) : (
      left
    );

    return (
      <Pressable
        accessibilityRole="button"
        disabled={!!disabled || !!isLoading}
        onPress={onPress}
        style={({ pressed }) => [
          styles.base,
          fullWidth ? styles.block : null,
          {
            backgroundColor,
            borderColor,
            borderWidth,
            borderRadius,
            paddingHorizontal: paddingH,
            paddingVertical: paddingV,
            minHeight,
            opacity: disabled ? 0.6 : pressed ? pressedOpacity : 1,
          },
          style,
        ]}
      >
        <Box flexDirection="row" alignItems="center">
          {leftNode ? (
            <Box style={{ marginRight: content ? gap : 0 }}>{leftNode}</Box>
          ) : null}
          {content}
          {right ? (
            <Box style={{ marginLeft: content ? gap : 0 }}>{right}</Box>
          ) : null}
        </Box>
      </Pressable>
    );
  };

  return Button;
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  block: { alignSelf: 'stretch' },
});
