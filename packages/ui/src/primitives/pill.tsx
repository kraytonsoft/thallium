import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import {
  createText,
  createBox,
  useTheme as useRestyleTheme,
  type BaseTheme,
} from '@shopify/restyle';
import {
  resolveColor,
  type PillVariantNameFrom,
  type PillSizeNameFrom,
  type TextVariantNameFrom,
} from '../theme';

export function makePill<const TTheme extends BaseTheme>() {
  const Label = createText<TTheme>();
  const Box = createBox<TTheme>();

  // spacing token key helper
  type SpacingKey = keyof TTheme['spacing'] & string;

  type Props = {
    text: string;
    isActive?: boolean;
    isDisabled?: boolean;
    onPress?: () => void;

    variant?: PillVariantNameFrom<TTheme>;
    size?: PillSizeNameFrom<TTheme>;
    labelVariant?: TextVariantNameFrom<TTheme>;

    /** Overrides */
    borderWidthOverride?: number;

    style?: StyleProp<ViewStyle>;
    hitSlop?:
      | number
      | { top?: number; bottom?: number; left?: number; right?: number };
    testID?: string;
  };

  const Pill: React.FC<Props> = ({
    text,
    isActive = false,
    isDisabled = false,
    onPress,
    variant,
    size,
    labelVariant,
    borderWidthOverride,
    style,
    hitSlop = 6,
    testID,
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const theme = useRestyleTheme<TTheme>() as any;

    const defaults = theme.pills?.defaults ?? {};
    const vKey = (variant ?? defaults.variant ?? 'default') as string;
    const sKey = (size ?? defaults.size ?? 'md') as string;
    const pressedOpacity =
      typeof defaults.pressedOpacity === 'number'
        ? defaults.pressedOpacity
        : 0.85;

    const v = theme.pills?.variants?.[vKey] ?? theme.pills?.variants?.default;
    const s = theme.pills?.sizes?.[sKey] ?? theme.pills?.sizes?.md;

    const bgToken = isActive ? v?.bgActive : v?.bgInactive;
    const textToken = isActive ? v?.textActive : v?.textInactive;
    const borderToken = isActive ? v?.borderActive : v?.borderInactive;

    const backgroundColor = resolveColor(
      theme.colors,
      bgToken ?? 'transparent'
    );
    const borderColor = borderToken
      ? resolveColor(theme.colors, borderToken)
      : 'transparent';

    // radius is a token key in strict mode; resolve to number with fallback
    const borderRadius =
      theme.borderRadii?.[
        (v?.radius ?? ('sm' as keyof TTheme['borderRadii'] & string)) as any
      ] ?? 999;

    // NEW: resolve spacing tokens -> numbers (strict pills use spacing keys)
    const paddingHKey = (s?.paddingH ?? ('md' as SpacingKey)) as SpacingKey;
    const paddingVKey = (s?.paddingV ?? ('sm' as SpacingKey)) as SpacingKey;
    const paddingH = (theme.spacing?.[paddingHKey] as number | undefined) ?? 12;
    const paddingV = (theme.spacing?.[paddingVKey] as number | undefined) ?? 6;

    const minHeight = s?.minHeight as number | undefined;
    const fontSize = s?.fontSize as number | undefined;

    const bw =
      borderWidthOverride ??
      v?.borderWidth ??
      s?.borderWidth ??
      (borderToken ? 1 : 0);

    const resolvedLabelVariant =
      labelVariant ??
      (defaults.labelVariant as any) ??
      ('body' as TextVariantNameFrom<TTheme>);

    return (
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, selected: isActive }}
        disabled={isDisabled}
        onPress={onPress}
        hitSlop={hitSlop as any}
        style={({ pressed }) => [
          { opacity: isDisabled ? 0.6 : pressed ? pressedOpacity : 1 },
          style as any,
        ]}
      >
        <Box
          alignItems="center"
          justifyContent="center"
          style={{
            backgroundColor,
            borderColor,
            borderWidth: bw,
            borderRadius,
            paddingHorizontal: paddingH,
            paddingVertical: paddingV,
            minHeight,
          }}
        >
          <Label
            variant={resolvedLabelVariant as any}
            color={textToken as any}
            style={fontSize ? { fontSize } : undefined}
          >
            {text}
          </Label>
        </Box>
      </Pressable>
    );
  };

  return Pill;
}
