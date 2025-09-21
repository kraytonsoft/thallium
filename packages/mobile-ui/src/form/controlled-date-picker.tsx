import { Fragment, useState } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import DatePicker, { type DatePickerProps } from 'react-native-date-picker';
import {
  Control,
  Controller,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form';
import { useTheme as useRestyleTheme, type BaseTheme } from '@shopify/restyle';
import { makeBox, makeButton, makeTypography } from '../primitives';
import { BottomSheetProps, makeBottomSheet } from '../composites';
import { isNil } from 'lodash';
import { format, parseISO } from 'date-fns';
import { useBottomSheetRef } from '../helpers';

type RNDatePickerProps = Omit<
  DatePickerProps,
  'date' | 'onDateChange' | 'mode'
>;

export type ControlledDatePickerProps<
  TTheme extends BaseTheme,
  T extends FieldValues
> = RNDatePickerProps & {
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T>;

  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;

  minDate?: Date;
  maxDate?: Date;

  placeholder?: string;
  snapPoint?: number | string;

  confirmLabel?: string;

  renderTrigger?: (open: () => void, displayValue: string) => void;
  sheetProps?: Omit<BottomSheetProps<TTheme>, 'ref'>;
};

export function makeControlledDatePicker<const TTheme extends BaseTheme>() {
  const Box = makeBox<TTheme>();
  const Text = makeTypography<TTheme>();
  const Button = makeButton<TTheme>();
  const BottomSheet = makeBottomSheet<TTheme>();

  const ControlledDatePicker = <T extends FieldValues>(
    props: ControlledDatePickerProps<TTheme, T>
  ) => {
    const {
      control,
      name,
      rules,
      label,
      error,
      containerStyle,
      minDate,
      maxDate,
      placeholder = 'Select a date',
      snapPoint = 420,
      confirmLabel = 'Confirm',
      renderTrigger,
      sheetProps,
      ...rest
    } = props;
    useRestyleTheme<TTheme>();
    const { ref, open, close } = useBottomSheetRef();
    const [tempDate, setTempDate] = useState<Date>(new Date());
    return (
      <Box rowGap="xs" style={containerStyle}>
        {!isNil(label) && <Text variant={'body'}>{label}</Text>}

        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field: { onChange, onBlur, value } }) => {
            // value is expected to be an ISO date string (yyyy-MM-dd) or undefined/null
            const hasValue = value != null && value !== '';
            const displayValue = hasValue
              ? format(parseISO(String(value)), 'MMM d, yyyy')
              : '';

            const handleOpen = () => {
              // Initialize temp date from current value (if present)
              setTempDate(hasValue ? parseISO(String(value)) : new Date());
              open();
            };

            const handleConfirm = () => {
              // Persist as ISO yyyy-MM-dd
              onChange(format(tempDate, 'yyyy-MM-dd'));
              close();
            };

            return (
              <Fragment>
                {(!isNil(renderTrigger) &&
                  renderTrigger(handleOpen, displayValue || placeholder)) ||
                  null}
                {isNil(renderTrigger) && (
                  <Pressable onPress={handleOpen} onBlur={onBlur}>
                    <Box
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                      borderWidth={1}
                      paddingHorizontal="md"
                      height={40}
                    >
                      <Text color={hasValue ? 'foreground' : 'muted'}>
                        {displayValue || placeholder}
                      </Text>
                    </Box>
                  </Pressable>
                )}

                <BottomSheet ref={ref} {...sheetProps} snapPoints={[snapPoint]}>
                  <Box alignItems="center" padding="md">
                    <DatePicker
                      {...rest}
                      mode="date"
                      date={tempDate}
                      minimumDate={minDate}
                      maximumDate={maxDate}
                      onDateChange={setTempDate}
                    />

                    <Box
                      flexDirection="row"
                      columnGap="md"
                      marginTop="md"
                      paddingHorizontal="lg"
                    >
                      <Button onPress={handleConfirm}>{confirmLabel}</Button>
                    </Box>
                  </Box>
                </BottomSheet>
              </Fragment>
            );
          }}
        />

        {!isNil(error) && (
          <Text color="destructive" variant={'body'}>
            {error}
          </Text>
        )}
      </Box>
    );
  };

  return ControlledDatePicker;
}
