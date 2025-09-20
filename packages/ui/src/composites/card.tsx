import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useTheme as useRestyleTheme, type BaseTheme } from '@shopify/restyle';
import { resolveColor } from '../theme';
import { makeSpinner } from '../primitives';
import { makeBox } from '../primitives';
import { CardSizeNameFrom, CardVariantNameFrom } from '../theme/define-theme';

export function makeCard<const TTheme extends BaseTheme>() {
  const Box = makeBox<TTheme>();
  const Spinner = makeSpinner<TTheme>();

  type Props = React.ComponentProps<typeof Box> & {
    variant?: CardVariantNameFrom<TTheme>;
    size?: CardSizeNameFrom<TTheme>;
    loading?: boolean;
    loader?: React.ReactNode;
    bgToken?: keyof TTheme['colors'] | string;
    borderColor?: keyof TTheme['colors'] | string;
    radiusKey?: keyof TTheme['borderRadii'];
    paddingKey?: keyof TTheme['spacing'];
    borderWidthOverride?: number;
    style?: StyleProp<ViewStyle>;

    // Android
    elevationOverride?: number;
  };

  const Card: React.FC<Props> = ({
    variant,
    size,
    loading,
    loader,
    bgToken,
    borderColor,
    radiusKey,
    paddingKey,
    borderWidthOverride,
    elevationOverride,
    children,
    style,
    ...rest
  }) => {
    const theme = useRestyleTheme<TTheme>();

    const defaultBgKey =
      ('card' in theme.colors && 'card') ||
      ('background' in theme.colors && 'background') ||
      (Object.keys(theme.colors)[0] as string);

    const defaultBorderKey =
      ('border' in theme.colors && 'border') ||
      ('muted' in theme.colors && 'muted');

    const defaultRadiusKey =
      ('card' in (theme.borderRadii || {}) && 'card') ||
      ('cardRadius' in (theme.borderRadii || {}) && 'cardRadius') ||
      ('md' in (theme.borderRadii || {}) && 'md');

    const cardDefaults = theme.cards?.defaults ?? {};
    const vKey = (variant ?? cardDefaults.variant ?? 'default') as string;
    const sKey = (size ?? cardDefaults.size ?? 'md') as string;

    const v =
      theme.cards?.variants?.[vKey] ?? theme.cards?.variants?.default ?? null;
    const s = theme.cards?.sizes?.[sKey] ?? theme.cards?.sizes?.md ?? null;

    const tokenBg = rest.backgroundColor ?? bgToken ?? v?.bg ?? defaultBgKey;

    const tokenBorder =
      (rest as any).borderColor ?? borderColor ?? v?.border ?? defaultBorderKey;

    const tokenRadius =
      rest.borderRadius ??
      radiusKey ??
      s?.radius ??
      v?.radius ??
      defaultRadiusKey;

    const tokenPadding = rest.padding ?? paddingKey ?? s?.padding ?? undefined;

    const tokenPaddingH = rest.paddingHorizontal ?? s?.paddingH ?? undefined;

    const tokenPaddingV = rest.paddingVertical ?? s?.paddingV ?? undefined;

    const borderWidth =
      rest.borderWidth ??
      borderWidthOverride ??
      s?.borderWidth ??
      v?.borderWidth ??
      1;

    const minHeight = s?.minHeight ?? undefined;
    const elevation =
      rest.elevation ??
      elevationOverride ??
      s?.elevation ??
      v?.elevation ??
      undefined;

    const concreteBg = resolveColor(theme.colors, tokenBg);
    const concreteBorder = tokenBorder
      ? resolveColor(theme.colors, tokenBorder)
      : 'transparent';

    const concreteRadius =
      typeof tokenRadius === 'number'
        ? tokenRadius
        : theme.borderRadii?.[tokenRadius ?? ''] ?? 0;

    const spinnerToken =
      v?.spinner ??
      (('foreground' in theme.colors && 'foreground') ||
        tokenBorder ||
        defaultBorderKey);
    const spinnerColor = resolveColor(theme.colors, spinnerToken);

    const Loader = loader ?? <Spinner size="small" color={spinnerColor} />;

    return (
      <Box
        // spread user Restyle props first, then apply our fallbacks
        {...rest}
        borderWidth={borderWidth}
        borderColor={tokenBorder}
        backgroundColor={tokenBg}
        borderRadius={tokenRadius}
        padding={tokenPadding}
        paddingHorizontal={tokenPaddingH}
        paddingVertical={tokenPaddingV}
        overflow="hidden"
        // give concrete values so raw strings still work even if not in theme
        style={[
          {
            backgroundColor: concreteBg,
            borderColor: concreteBorder,
            borderRadius: concreteRadius,
            minHeight,
            // elevation only affects Android; on iOS users can pass shadow props via `style` or Restyle
            ...(typeof elevation === 'number' ? { elevation } : null),
          },
          style,
        ]}
      >
        {loading && (
          <Box
            alignItems="center"
            justifyContent="center"
            minHeight={minHeight ?? 64}
          >
            {Loader}
          </Box>
        )}
        {!loading && children}
      </Box>
    );
  };

  return Card;
}
