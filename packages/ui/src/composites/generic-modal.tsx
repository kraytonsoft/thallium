import React from 'react';
import {
  Modal,
  TouchableWithoutFeedback,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme as useRestyleTheme, type BaseTheme } from '@shopify/restyle';
import { makeBox } from '../primitives';
import { resolveColor } from '../theme';
import { makeCard } from './card';

export function makeGenericModal<const TTheme extends BaseTheme>() {
  const Box = makeBox<TTheme>();
  const Card = makeCard<TTheme>();

  type Props = React.PropsWithChildren<{
    visible: boolean;
    onClose?: () => void;

    /** Style overrides */
    modalStyle?: StyleProp<ViewStyle>;
    backdropStyle?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
    cardStyle?: StyleProp<ViewStyle>;

    /** Behavior */
    closeOnBackdropPress?: boolean;
    animationType?: 'none' | 'fade' | 'slide';

    /** Theming knobs (optional; tokens or raw values) */
    backdropColorToken?: keyof TTheme['colors'] | string; // default: black/overlay-ish
    backdropOpacity?: number; // default: 0.5
    cardBgToken?: keyof TTheme['colors'] | string;
    cardBorderColorToken?: keyof TTheme['colors'] | string;
    cardRadiusKey?: keyof TTheme['borderRadii'];
    cardPaddingKey?: keyof TTheme['spacing'];
    cardBorderWidthOverride?: number;
  }>;

  const GenericModal: React.FC<Props> = ({
    visible,
    onClose,
    children,
    modalStyle,
    backdropStyle,
    contentContainerStyle,
    cardStyle,
    closeOnBackdropPress = true,
    animationType = 'fade',
    backdropColorToken,
    backdropOpacity = 0.5,
    cardBgToken,
    cardBorderColorToken,
    cardRadiusKey,
    cardPaddingKey,
    cardBorderWidthOverride,
  }) => {
    const theme = useRestyleTheme<TTheme>() as any;

    // Backdrop color fallback: overlay | black-ish
    const fallbackBackdropToken =
      ('overlay' in theme.colors && 'overlay') ||
      ('backdrop' in theme.colors && 'backdrop') ||
      ('black' in theme.colors && 'black') ||
      (Object.keys(theme.colors).includes('background')
        ? 'background'
        : undefined) ||
      undefined;

    const backdropColor = resolveColor(
      theme.colors,
      (backdropColorToken ?? fallbackBackdropToken ?? '#000') as any
    );

    return (
      <Modal
        transparent
        animationType={animationType}
        visible={visible}
        onRequestClose={onClose}
      >
        <Box
          flex={1}
          position="absolute"
          left={0}
          right={0}
          top={0}
          bottom={0}
          style={modalStyle}
        >
          <TouchableWithoutFeedback
            onPress={closeOnBackdropPress ? onClose : undefined}
          >
            <Box
              style={[
                {
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  top: 0,
                  backgroundColor: backdropColor,
                  opacity: backdropOpacity,
                },
                backdropStyle as any,
              ]}
            />
          </TouchableWithoutFeedback>

          {/* Centered content */}
          <Box
            flex={1}
            alignItems="center"
            justifyContent="center"
            style={contentContainerStyle}
          >
            <Card
              bgToken={cardBgToken}
              borderColor={cardBorderColorToken}
              radiusKey={cardRadiusKey}
              paddingKey={cardPaddingKey}
              borderWidthOverride={cardBorderWidthOverride}
              style={[{ width: '100%' }, cardStyle]}
            >
              {children}
            </Card>
          </Box>
        </Box>
      </Modal>
    );
  };

  return GenericModal;
}
