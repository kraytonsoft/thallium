import { createBox, type BaseTheme } from '@shopify/restyle';

export function makeBox<const TTheme extends BaseTheme>() {
  return createBox<TTheme>();
}
