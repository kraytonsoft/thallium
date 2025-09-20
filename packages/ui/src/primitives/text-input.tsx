import { FC } from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import {
  backgroundColor,
  BackgroundColorProps,
  border,
  BorderProps,
  composeRestyleFunctions,
  spacing,
  SpacingProps,
  useRestyle,
  useTheme as useRestyleTheme,
  type BaseTheme,
} from '@shopify/restyle';
import {
  resolveColor,
  type InputVariantNameFrom,
  type InputSizeNameFrom,
  type TextVariantNameFrom,
} from '../theme';

// Restyle props you can pass through
type RestyleProps<Theme extends BaseTheme> = SpacingProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme>;

// Public props for the component
export type TextInputPropsFor<Theme extends BaseTheme> = RestyleProps<Theme> &
  Pick<
    RNTextInputProps,
    | 'autoCapitalize'
    | 'autoComplete'
    | 'placeholder'
    | 'value'
    | 'onChangeText'
    | 'editable'
    | 'onBlur'
    | 'secureTextEntry'
    | 'style'
    | 'placeholderTextColor'
    | 'selectionColor'
    | 'inputMode'
    | 'onFocus'
    | 'autoFocus'
    | 'keyboardType'
    | 'maxLength'
    | 'returnKeyType'
    | 'onSubmitEditing'
  > & {
    variant?: InputVariantNameFrom<Theme>;
    size?: InputSizeNameFrom<Theme>;
    labelVariant?: TextVariantNameFrom<Theme>; // if you style labels elsewhere
    fontFamilyOverride?: string; // escape hatch
    fontSizeOverride?: number; // escape hatch
    bgColorToken?: keyof Theme['colors'] | string;
    textColorToken?: keyof Theme['colors'] | string;
    borderColorToken?: keyof Theme['colors'] | string;
    placeholderColorToken?: keyof Theme['colors'] | string;
    selectionColorToken?: keyof Theme['colors'] | string;
  };

export function makeTextInput<const TTheme extends BaseTheme>() {
  type Theme = TTheme;

  const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps<Theme>>([
    spacing,
    border,
    backgroundColor,
  ]);

  const TextInput: FC<TextInputPropsFor<Theme>> = (props) => {
    const theme = useRestyleTheme<Theme>();

    const {
      variant,
      size,
      editable = true,
      style,
      placeholderTextColor,
      selectionColor,
      fontFamilyOverride,
      fontSizeOverride,
      bgColorToken,
      textColorToken,
      borderColorToken,
      placeholderColorToken,
      selectionColorToken,
      ...restNative
    } = props;

    const restyleStyle = useRestyle(restyleFunctions, props);

    // Resolve tokens from theme
    const defaults = theme.inputs?.defaults ?? {};
    const vKey = (variant ?? defaults.variant ?? 'default') as string;
    const sKey = (size ?? defaults.size ?? 'md') as string;

    const v = theme.inputs?.variants?.[vKey] ?? theme.inputs?.variants?.default;
    const s = theme.inputs?.sizes?.[sKey] ?? theme.inputs?.sizes?.md;

    const state = editable ? v : v?.disabled;

    const bg = resolveColor(
      theme.colors,
      bgColorToken ?? state?.bg ?? 'transparent'
    );
    const fg = resolveColor(
      theme.colors,
      textColorToken ?? state?.text ?? 'foreground'
    );
    const bd = resolveColor(
      theme.colors,
      borderColorToken ?? state?.border ?? 'transparent'
    );
    const ph = resolveColor(
      theme.colors,
      placeholderTextColor ??
        placeholderColorToken ??
        v?.placeholder ??
        state?.text ??
        'foreground'
    );
    const sel = resolveColor(
      theme.colors,
      selectionColor ??
        selectionColorToken ??
        v?.selection ??
        state?.border ??
        'foreground'
    );

    const borderRadius = theme.borderRadii?.[v?.radius ?? 'sm'] ?? 8;
    const borderWidth = v?.borderWidth ?? s?.borderWidth ?? 1;
    const fontFamily = fontFamilyOverride ?? defaults.fontFamily ?? undefined;
    const fontSize = fontSizeOverride ?? s?.fontSize ?? 16;
    const paddingHorizontal = s?.paddingH ?? 10;
    const paddingVertical = s?.paddingV ?? 8;
    const minHeight = s?.minHeight ?? undefined;

    return (
      <RNTextInput
        selectionColor={sel}
        placeholderTextColor={ph}
        style={[
          styles.base,
          {
            borderWidth,
            borderColor: bd,
            borderRadius,
            color: fg,
            backgroundColor: bg,
            ...(fontFamily ? { fontFamily } : null),
            fontSize,
            paddingHorizontal,
            paddingVertical,
            minHeight,
          },
          // eslint-disable-next-line
          (restyleStyle as any).style,
          style,
        ]}
        editable={editable}
        {...restNative}
      />
    );
  };

  return TextInput;
}

const styles = StyleSheet.create({
  base: {
    fontSize: 16,
  },
});
