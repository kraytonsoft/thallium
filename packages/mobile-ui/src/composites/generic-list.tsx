import React, { ComponentType } from 'react';
import {
  FlatList,
  type ListRenderItem,
  type StyleProp,
  type ViewStyle,
  type FlatListProps,
} from 'react-native';
import { useTheme as useRestyleTheme, type BaseTheme } from '@shopify/restyle';
import {
  makeBox,
  makeSeparator,
  makeSpinner,
  makeTypography,
} from '../primitives';

export function makeGenericList<const TTheme extends BaseTheme>() {
  const Box = makeBox<TTheme>();
  const Text = makeTypography<TTheme>();
  const Separator = makeSeparator<TTheme>();
  const Spinner = makeSpinner<TTheme>();

  type BoxProps = React.ComponentProps<typeof Box>;
  type TextProps = React.ComponentProps<typeof Text>;

  type Props<T> = {
    data: T[];
    isLoading?: boolean;
    onEndReached?: () => void;
    emptyText?: string;
    renderItem: ListRenderItem<T>;
    style?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
    keyExtractor?: (item: T, index: number) => string;

    paddingBottomKey?: keyof TTheme['spacing'];
    separatorHeight?: number;
    separatorColorToken?: keyof TTheme['colors'] | string;
    loaderColorToken?: keyof TTheme['colors'] | string;

    emptyContainerProps?: BoxProps;
    loaderContainerProps?: BoxProps;
    emptyTextProps?: Omit<TextProps, 'children'>;

    flatListProps?: Omit<
      FlatListProps<T>,
      | 'data'
      | 'renderItem'
      | 'keyExtractor'
      | 'style'
      | 'contentContainerStyle'
      | 'ItemSeparatorComponent'
      | 'onEndReached'
      | 'showsHorizontalScrollIndicator'
      | 'showsVerticalScrollIndicator'
      | 'removeClippedSubviews'
      | 'maxToRenderPerBatch'
      | 'windowSize'
    >;
  };

  function GenericList<T>(props: Props<T>) {
    const {
      emptyText = 'Nothing here yet.',
      style,
      contentContainerStyle,
      onEndReached,
      data,
      renderItem,
      isLoading = false,
      keyExtractor,
      paddingBottomKey,
      separatorHeight = 0,
      separatorColorToken,
      loaderColorToken,
      emptyContainerProps,
      loaderContainerProps,
      emptyTextProps,
      flatListProps,
    } = props;

    const theme = useRestyleTheme<TTheme>();

    const defaultPBKey =
      paddingBottomKey ??
      (('lg' in theme.spacing && 'lg') ||
        ('md' in theme.spacing && 'md') ||
        undefined);
    const paddingBottom =
      (defaultPBKey ? (theme.spacing?.[defaultPBKey] as number) : 20) ?? 20;

    const sepColorToken =
      separatorColorToken ??
      (('border' in theme.colors && 'border') ||
        ('muted' in theme.colors && 'muted') ||
        ('foreground' in theme.colors && 'foreground') ||
        (Object.keys(theme.colors)[0] as string));

    let ItemSeparatorComponent: undefined | ComponentType = undefined;
    if (separatorHeight > 0) {
      ItemSeparatorComponent = () => (
        <Separator
          direction="horizontal"
          thickness={separatorHeight}
          colorToken={sepColorToken}
        />
      );
    }

    if (isLoading) {
      return (
        <Box
          alignItems="center"
          justifyContent="center"
          padding="md"
          style={style}
          {...loaderContainerProps}
        >
          <Spinner color={loaderColorToken} />
        </Box>
      );
    }

    if (!data || data.length === 0) {
      const emptyColorToken =
        ('mutedForeground' in theme.colors && 'mutedForeground') ||
        ('foreground' in theme.colors && 'foreground') ||
        (Object.keys(theme.colors)[0] as string);

      return (
        <Box
          alignItems="center"
          justifyContent="center"
          padding="md"
          style={style}
          {...emptyContainerProps}
        >
          <Text color={emptyColorToken} {...emptyTextProps}>
            {emptyText}
          </Text>
        </Box>
      );
    }

    return (
      <FlatList
        style={style}
        contentContainerStyle={[{ paddingBottom }, contentContainerStyle]}
        keyExtractor={keyExtractor ?? ((_, i) => String(i))}
        data={data}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        removeClippedSubviews
        maxToRenderPerBatch={5}
        windowSize={3}
        {...flatListProps}
      />
    );
  }

  return GenericList;
}
