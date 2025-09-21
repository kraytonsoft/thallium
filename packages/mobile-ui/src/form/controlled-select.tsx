import { ReactNode } from 'react';
import {
  TouchableOpacity,
  type ListRenderItem,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import {
  Control,
  Controller,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { useTheme as useRestyleTheme, type BaseTheme } from '@shopify/restyle';
import { isNil } from 'lodash';

import type { ButtonVariantNameFrom } from '@thallium/mobile-ui/theme';
import { makeBox, makeButton, makeIcon, makeTypography } from '../primitives';
import { BottomSheetProps, makeBottomSheet } from '../composites';
import { useBottomSheetRef } from '../helpers';

export interface OptionValueLabel {
  label: string;
  value: string;
}
export type ControlledSelectProps<
  TTheme extends BaseTheme,
  T extends FieldValues
> = {
  control: Control<T>;
  name: Path<T>;
  options: OptionValueLabel[];
  placeholder?: string;
  label?: string;
  /** If true, `keyExtractor` will use option.label instead of option.value */
  isLabelKey?: boolean;
  style?: StyleProp<ViewStyle>;
  error?: string;
  disabled?: boolean;

  /** Button variant from theme; defaults to 'outlined' if present */
  variant?: ButtonVariantNameFrom<TTheme> | (string & {});

  /** Custom renderers */
  renderSelectedValue?: (option: OptionValueLabel | undefined) => string;
  renderItem?: ListRenderItem<OptionValueLabel>;
  renderHeader?: ReactNode;

  /** FlatList pass-thru */
  contentContainerStyle?: StyleProp<ViewStyle>;

  /** Bottom sheet */
  sheetProps?: Omit<BottomSheetProps<TTheme>, 'ref'>;
};

export function makeControlledSelect<const TTheme extends BaseTheme>() {
  const Box = makeBox<TTheme>();
  const Text = makeTypography<TTheme>();
  const Button = makeButton<TTheme>();
  const BottomSheet = makeBottomSheet<TTheme>();
  const Icon = makeIcon<TTheme>();

  const ControlledSelect = <T extends FieldValues>(
    props: ControlledSelectProps<TTheme, T>
  ) => {
    const {
      control,
      name,
      options,
      placeholder = 'Select an option',
      label,
      error,
      disabled = false,
      variant,
      style,
      isLabelKey,
      renderSelectedValue,
      renderItem,
      contentContainerStyle,
      sheetProps,
      renderHeader,
    } = props;

    const theme = useRestyleTheme<TTheme>();
    const { open, close, ref: bottomSheetRef } = useBottomSheetRef();

    const buttonVariant =
      variant ??
      ('outlined' in (theme.buttons?.variants ?? {}) ? 'outlined' : 'primary');

    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => {
          const selected = options.find((opt) => opt.value === value);

          // final item renderer that adds selection check + onPress handler
          const itemRenderer: ListRenderItem<OptionValueLabel> =
            renderItem ??
            (({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onChange(item.value);
                  close();
                }}
                disabled={disabled}
                style={{ marginBottom: 10 }}
              >
                <Box
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  paddingHorizontal="sm"
                >
                  <Text color={'foreground'}>{item.label}</Text>
                  {value === item.value && (
                    <Icon
                      type="Feather"
                      name="check-circle"
                      size={20}
                      colorToken={'brand'}
                    />
                  )}
                </Box>
              </TouchableOpacity>
            ));

          return (
            <Box rowGap="xs" style={style}>
              {!isNil(label) && <Text variant={'body'}>{label}</Text>}

              <Button
                variant={buttonVariant as ButtonVariantNameFrom<TTheme>}
                onPress={open}
                disabled={disabled}
              >
                <Box
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  style={{ height: 23 }}
                >
                  <Text
                    color={disabled ? 'mutedForeground' : 'foreground'}
                    variant={'body'}
                  >
                    {renderSelectedValue
                      ? renderSelectedValue(selected)
                      : selected?.label || placeholder}
                  </Text>
                  {!disabled && (
                    <Icon
                      type="Feather"
                      name="chevron-down"
                      size={18}
                      colorToken={'muted'}
                    />
                  )}
                </Box>
              </Button>

              <BottomSheet {...sheetProps} ref={bottomSheetRef}>
                {renderHeader}
                <BottomSheetFlatList
                  data={options}
                  keyExtractor={
                    isLabelKey ? (item) => item.label : (item) => item.value
                  }
                  renderItem={itemRenderer}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={[
                    { paddingHorizontal: 16 },
                    contentContainerStyle,
                  ]}
                />
              </BottomSheet>

              {!isNil(error) ? (
                <Text color={'destructive'} variant={'body'}>
                  {error}
                </Text>
              ) : null}
            </Box>
          );
        }}
      />
    );
  };

  return ControlledSelect;
}
