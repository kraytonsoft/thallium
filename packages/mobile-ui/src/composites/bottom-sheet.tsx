import {
  forwardRef,
  PropsWithChildren,
  ReactNode,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { Pressable, StyleSheet } from 'react-native';
import {
  BottomSheetModal,
  type BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useTheme as useRestyleTheme, type BaseTheme } from '@shopify/restyle';
import { resolveColor } from '../theme';

export type BottomSheetProps<TTheme extends BaseTheme> = PropsWithChildren<{
  snapPoints?: Array<string | number>;
  onDismiss?: () => void;
  onChange?: (index: number) => void;

  backgroundColorToken?: keyof TTheme['colors'] | string;
  indicatorColorToken?: keyof TTheme['colors'] | string;

  backdropColorToken?: keyof TTheme['colors'] | string;
  backdropOpacity?: number;
  backdropOpacityRange?: [number, number];

  modalProps?: Omit<
    BottomSheetModalProps,
    | 'snapPoints'
    | 'backdropComponent'
    | 'backgroundStyle'
    | 'handleIndicatorStyle'
    | 'children'
  >;

  renderHeader?: (dismiss: () => void) => ReactNode;
}>;

export function makeBottomSheet<const TTheme extends BaseTheme>() {
  const BottomSheet = forwardRef<BottomSheetModal, BottomSheetProps<TTheme>>(
    (props, ref) => {
      const {
        snapPoints,
        onDismiss,
        onChange,
        children,

        backgroundColorToken,
        indicatorColorToken,

        backdropColorToken,
        backdropOpacity = 0.7,
        backdropOpacityRange = [-0.3, 0.3],

        modalProps,

        renderHeader,
      } = props;

      const theme = useRestyleTheme<TTheme>() as any;
      const modalRef = useRef<BottomSheetModal>(null);
      useImperativeHandle(ref, () => modalRef.current!);

      const snaps = useMemo(() => snapPoints ?? ['25%', '50%'], [snapPoints]);

      const bgToken =
        backgroundColorToken ??
        (('popover' in theme.colors && 'popover') as any) ??
        (('background' in theme.colors && 'background') as any);

      const indicatorToken =
        indicatorColorToken ??
        (('popoverForeground' in theme.colors && 'popoverForeground') as any) ??
        (('muted' in theme.colors && 'muted') as any) ??
        (('foreground' in theme.colors && 'foreground') as any);

      const onInternalClose = () => {
        // Keep this, to circumvent render bug
        setTimeout(() => {
          modalRef.current?.dismiss();
          onDismiss?.();
        }, 20);
      };

      // Inline backdrop component (animated + press-to-dismiss)
      const Backdrop = ({
        animatedIndex,
        style,
      }: {
        animatedIndex: { value: number };
        style?: any;
      }) => {
        const bg = resolveColor(
          theme.colors,
          (backdropColorToken ??
            (('overlay' in theme.colors && 'overlay') as any) ??
            (('backdrop' in theme.colors && 'backdrop') as any) ??
            '#000') as any
        );

        const fade = useAnimatedStyle(
          () => ({
            opacity: interpolate(
              animatedIndex.value,
              backdropOpacityRange,
              [0, backdropOpacity],
              Extrapolation.CLAMP
            ),
          }),
          [animatedIndex, backdropOpacity, backdropOpacityRange]
        );

        const containerStyle = useMemo(
          () => [StyleSheet.absoluteFill, { backgroundColor: bg }, style, fade],
          [bg, style, fade]
        );

        return (
          <Pressable
            onPress={() => modalRef.current?.dismiss()}
            style={StyleSheet.absoluteFill}
          >
            <Animated.View pointerEvents="none" style={containerStyle} />
          </Pressable>
        );
      };

      return (
        <BottomSheetModal
          ref={modalRef}
          snapPoints={snaps}
          onDismiss={onDismiss}
          onChange={onChange}
          backgroundStyle={{
            backgroundColor: theme.colors?.[bgToken] ?? bgToken,
          }}
          handleIndicatorStyle={{
            backgroundColor: theme.colors?.[indicatorToken] ?? indicatorToken,
          }}
          backdropComponent={Backdrop}
          style={{ paddingTop: 11 }}
          {...modalProps}
        >
          {renderHeader?.(onInternalClose)}
          {children}
        </BottomSheetModal>
      );
    }
  );

  BottomSheet.displayName = 'BottomSheet';

  return BottomSheet;
}
