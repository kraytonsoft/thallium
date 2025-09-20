import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import {
  Control,
  Controller,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form';
import { useTheme as useRestyleTheme, type BaseTheme } from '@shopify/restyle';
import { makeBox, makeTextInput, makeTypography } from '../primitives';

type ControlledInputProps<
  TextInputProps,
  T extends FieldValues
> = TextInputProps & {
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T>;
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  maxLength?: number;
};

export function makeControlledInput<const TTheme extends BaseTheme>() {
  const Box = makeBox<TTheme>();
  const Text = makeTypography<TTheme>();
  const TextInput = makeTextInput<TTheme>();

  type TextInputProps = React.ComponentProps<typeof TextInput>;

  const ControlledInput = <T extends FieldValues>(
    props: ControlledInputProps<TextInputProps, T>
  ) => {
    const {
      control,
      name,
      rules,
      label,
      error,
      rightIcon,
      containerStyle,
      style,
      ...rest
    } = props;

    useRestyleTheme<TTheme>();

    return (
      <Box rowGap={'xs'} style={containerStyle}>
        {label && <Text variant={'body'}>{label}</Text>}

        <Box position="relative">
          <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                {...rest}
                value={value ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
                style={[{ paddingRight: 30 }, style]}
              />
            )}
          />

          {rightIcon && (
            <Box
              position="absolute"
              right={10}
              top={0}
              bottom={0}
              alignItems="center"
              justifyContent="center"
              pointerEvents="none"
            >
              {rightIcon}
            </Box>
          )}
        </Box>

        {error && (
          <Text color={'destructive'} variant={'body'}>
            {error}
          </Text>
        )}
      </Box>
    );
  };

  return ControlledInput;
}
