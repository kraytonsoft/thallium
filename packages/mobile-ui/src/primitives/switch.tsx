import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import {
  createBox,
  useTheme as useRestyleTheme,
  type BaseTheme,
} from '@shopify/restyle';
import { type SwitchVariantNameFrom, type SwitchSizeNameFrom } from '../theme';

export function makeSwitch<const TTheme extends BaseTheme>() {
  const Box = createBox<TTheme>();

  type Props = {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    variant?: SwitchVariantNameFrom<TTheme>;
    size?: SwitchSizeNameFrom<TTheme>;
    style?: StyleProp<ViewStyle>;
  };

  const Switch: React.FC<Props> = ({
    checked = false,
    onChange,
    disabled = false,
    variant,
    size,
    style,
  }) => {
    const theme = useRestyleTheme<TTheme>() as any;

    const defaults = theme.switches?.defaults ?? {};
    const vKey = (variant ?? defaults.variant ?? 'default') as string;
    const sKey = (size ?? defaults.size ?? 'md') as string;

    const v =
      theme.switches?.variants?.[vKey] ?? theme.switches?.variants?.default;
    const s = theme.switches?.sizes?.[sKey] ?? theme.switches?.sizes?.md;

    const trackColor = disabled
      ? v?.trackDisabled ?? 'transparent'
      : checked
      ? v?.trackOn ?? 'transparent'
      : v?.trackOff ?? 'transparent';

    const trackRadiusKey = v?.radius ?? ('sm' as any);

    // thumb placement: left (off) or right (on)
    const thumbLeft = checked ? s.width - s.padding - s.thumb : s.padding;

    return (
      <Pressable
        accessibilityRole="switch"
        accessibilityState={{ checked, disabled }}
        onPress={() => !disabled && onChange?.(!checked)}
        disabled={disabled}
        style={style as any}
        hitSlop={8}
      >
        <Box
          width={s.width}
          height={s.height}
          backgroundColor={trackColor}
          borderRadius={trackRadiusKey}
          style={{ padding: s.padding, opacity: disabled ? 0.6 : 1 }}
        >
          <Box
            position="absolute"
            left={thumbLeft}
            top={(s.height - s.thumb) / 2}
            width={s.thumb}
            height={s.thumb}
            backgroundColor={v?.thumb ?? ('foreground' as any)}
            borderRadius={trackRadiusKey}
          />
        </Box>
      </Pressable>
    );
  };

  return Switch;
}
