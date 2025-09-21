import React from 'react';
import {
  Pressable,
  StyleProp,
  ViewStyle,
  Text as RNText,
  StyleSheet,
} from 'react-native';
import {
  createBox,
  useTheme as useRestyleTheme,
  type BaseTheme,
} from '@shopify/restyle';
import {
  resolveColor,
  type CheckboxVariantNameFrom,
  type CheckboxSizeNameFrom,
} from '../theme';

export function makeCheckbox<const TTheme extends BaseTheme>() {
  const Box = createBox<TTheme>();

  type Props = {
    checked: boolean;
    onChange?: (value: boolean) => void;
    disabled?: boolean;

    /** Theme variant/size */
    variant?: CheckboxVariantNameFrom<TTheme>;
    size?: CheckboxSizeNameFrom<TTheme>;

    /** Optional custom icon node shown when checked (e.g., your Icon component) */
    icon?: React.ReactNode;

    /** Overrides */
    boxSizeOverride?: number;

    style?: StyleProp<ViewStyle>;
    hitSlop?:
      | number
      | { top?: number; bottom?: number; left?: number; right?: number };
    testID?: string;
  };

  const Checkbox: React.FC<Props> = ({
    checked,
    onChange,
    disabled = false,
    variant,
    size,
    icon,
    boxSizeOverride,
    style,
    hitSlop = 6,
    testID,
  }) => {
    const theme = useRestyleTheme<TTheme>() as any;

    // Resolve tokens from theme
    const defaults = theme.checkboxes?.defaults ?? {};
    const vKey = (variant ?? defaults.variant ?? 'default') as string;
    const sKey = (size ?? defaults.size ?? 'md') as string;
    const pressedOpacity =
      typeof defaults.pressedOpacity === 'number'
        ? defaults.pressedOpacity
        : 0.85;

    const v =
      theme.checkboxes?.variants?.[vKey] ?? theme.checkboxes?.variants?.default;
    const s = theme.checkboxes?.sizes?.[sKey] ?? theme.checkboxes?.sizes?.md;

    // Colors & geometry
    const bgToken = checked ? v?.boxOn : v?.boxOff;
    const borderToken = checked ? v?.borderOn : v?.borderOff;
    const checkToken = v?.check;

    const backgroundColor = resolveColor(
      theme.colors,
      bgToken ?? 'transparent'
    );
    const borderColor = resolveColor(
      theme.colors,
      borderToken ?? 'transparent'
    );
    const checkColor = resolveColor(theme.colors, checkToken ?? 'foreground');

    const borderRadius = theme.borderRadii?.[v?.radius ?? 'sm'] ?? 2;
    const boxSize = boxSizeOverride ?? s?.box ?? 20;

    // Border width precedence:
    let computedBorderWidth = v?.borderWidth ?? s?.borderWidth ?? 1;

    // If user provided style with borderWidth, don't fight it (RN merges later)
    const userStyleBorderWidth = Array.isArray(style)
      ? style.find((s) => s && typeof s === 'object' && 'borderWidth' in s) &&
        style
      : (style as any)?.borderWidth;

    if (typeof userStyleBorderWidth === 'number') {
      computedBorderWidth = userStyleBorderWidth;
    }

    // Simple built-in check glyph if no custom icon is provided
    const defaultCheck = (
      <RNText
        style={[
          styles.check,
          { color: checkColor, fontSize: Math.floor(boxSize * 0.8) },
        ]}
      >
        {'\u2713'}
      </RNText>
    );

    return (
      <Pressable
        testID={testID}
        accessibilityRole="checkbox"
        accessibilityState={{ checked, disabled }}
        onPress={() => !disabled && onChange?.(!checked)}
        disabled={disabled}
        hitSlop={hitSlop as any}
        style={({ pressed }) => [
          { opacity: disabled ? 0.6 : pressed ? pressedOpacity : 1 },
        ]}
      >
        <Box
          width={boxSize}
          height={boxSize}
          alignItems="center"
          justifyContent="center"
          // use style for concrete values so we can pass raw colors & pixel widths
          style={{
            backgroundColor,
            borderColor,
            borderWidth: computedBorderWidth,
            borderRadius,
          }}
        >
          {checked ? icon ?? defaultCheck : null}
        </Box>
      </Pressable>
    );
  };

  return Checkbox;
}

const styles = StyleSheet.create({
  check: {
    lineHeight: undefined, // let RN compute for the glyph
    includeFontPadding: false,
    textAlign: 'center',
  } as any,
});
