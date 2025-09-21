import React from 'react';
import { createText, type BaseTheme } from '@shopify/restyle';

export function makeTypography<const TTheme extends BaseTheme>() {
  const Text = createText<TTheme>();
  type BaseProps = React.ComponentProps<typeof Text>;
  type Props = Omit<BaseProps, 'variant'> & {
    variant?: keyof (TTheme['textVariants'] & Record<string, unknown>);
  };

  const Typography: React.FC<Props> = ({
    variant = 'body' as any,
    ...rest
  }) => <Text variant={variant as any} {...rest} />;

  return Typography;
}
