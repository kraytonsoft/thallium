import { createTheme } from '@shopify/restyle';

const themeConfig = createTheme({
  colors: {
    background: '#0b0b0c',
    foreground: '#fafafa',
    brand: '#4db723',
    brandOn: '#ffffff',
    mutedForeground: '#656565',
    muted: '#2b2b2b',
    card: '#1a1a1b',
    gray700: '#323234',
    error: '#e5484d',
    errorOn: '#ffffff',
    popover: '#1a1a1b',
    popoverForeground: '#ffffff',
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16 },
  borderRadii: {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    button: 12,
    switch: 999,
  }, // pill radius
  textVariants: {
    body: { fontSize: 16, lineHeight: 22, color: 'foreground' },
    title: { fontSize: 20, lineHeight: 26, color: 'foreground' },
    buttonLabel: { fontSize: 16, lineHeight: 20, color: 'brandOn' },
  },
  buttons: {
    variants: {
      primary: {
        bg: 'brand',
        text: 'brandOn',
        border: 'brand',
        radius: 'button',
      },
      secondary: {
        bg: 'background',
        text: 'foreground',
        border: 'muted',
        radius: 'button',
      },
      destructive: {
        bg: 'error',
        text: 'errorOn',
        border: 'error',
        radius: 'button',
      },
      outlined: {
        bg: 'background',
        text: 'foreground',
        border: 'brand',
        radius: 'button',
      },
      disabled: {
        bg: 'background',
        text: 'foreground',
        border: 'muted',
        radius: 'button',
      },
    },
    sizes: {
      sm: {
        paddingH: 12,
        paddingV: 8,
        gap: 8,
        minHeight: 36,
        icon: 16,
        borderWidth: 1,
      },
      md: {
        paddingH: 14,
        paddingV: 10,
        gap: 8,
        minHeight: 44,
        icon: 18,
        borderWidth: 1,
      },
      lg: {
        paddingH: 18,
        paddingV: 12,
        gap: 10,
        minHeight: 52,
        icon: 20,
        borderWidth: 1,
      },
    },
    defaults: { variant: 'primary', size: 'md', pressedOpacity: 0.85 },
  },
  switches: {
    variants: {
      default: {
        trackOn: 'brand',
        trackOff: 'muted',
        trackDisabled: 'gray700',
        thumb: 'card',
        radius: 'switch',
      },
    },
    sizes: {
      sm: { width: 40, height: 22, padding: 3, thumb: 16 },
      md: { width: 48, height: 26, padding: 3, thumb: 20 },
      lg: { width: 56, height: 30, padding: 4, thumb: 22 },
    },
    defaults: { variant: 'default', size: 'md' },
  },
  inputs: {
    variants: {
      default: {
        bg: 'background',
        text: 'foreground',
        border: 'brandOn',
        placeholder: 'mutedForeground',
        selection: 'brand',
        disabled: { bg: 'muted', text: 'mutedForeground', border: 'muted' },
        radius: 'input',
        borderWidth: 2,
      },
      inverted: {
        bg: 'foreground',
        text: 'background',
        border: 'brandOn',
        disabled: { bg: 'muted', text: 'mutedForeground', border: 'muted' },
        radius: 'input',
        borderWidth: 1,
      },
    },
    sizes: {
      sm: {
        fontSize: 14,
        paddingH: 10,
        paddingV: 6,
        borderWidth: 1,
      },
      xs: {
        fontSize: 14,
        paddingH: 10,
        paddingV: 10,
        borderWidth: 1,
      },
      md: {
        fontSize: 16,
        paddingH: 12,
        paddingV: 8,
        borderWidth: 1,
      },
      lg: {
        fontSize: 18,
        paddingH: 14,
        paddingV: 10,
        borderWidth: 1,
      },
    },
    defaults: { variant: 'default', size: 'md', fontFamily: 'Inter-Regular' },
  },
  checkboxes: {
    variants: {
      default: {
        boxOn: 'brand',
        boxOff: 'muted',
        borderOn: 'brand',
        borderOff: 'brand',
        check: 'brandOn',
        radius: 'xs',
        borderWidth: 1,
      },
    },
    sizes: {
      sm: { box: 16, borderWidth: 1 },
      md: { box: 20, borderWidth: 1 },
      lg: { box: 24, borderWidth: 2 },
    },
    defaults: { size: 'md', variant: 'default', pressedOpacity: 0.85 },
  },
  pills: {
    variants: {
      default: {
        bgActive: 'brand',
        bgInactive: 'muted',
        textActive: 'brandOn',
        textInactive: 'mutedForeground',
        borderActive: 'brand',
        borderInactive: 'muted',
        radius: 'button',
        borderWidth: 1,
      },
      outline: {
        bgActive: 'background',
        bgInactive: 'background',
        textActive: 'brand',
        textInactive: 'foreground',
        borderActive: 'brand',
        borderInactive: 'muted',
        radius: 'button',
        borderWidth: 1,
      },
    },
    sizes: {
      sm: {
        paddingH: 10,
        paddingV: 4,
        fontSize: 13,
        minHeight: 28,
        borderWidth: 1,
      },
      md: {
        paddingH: 12,
        paddingV: 6,
        fontSize: 15,
        minHeight: 32,
        borderWidth: 1,
      },
      lg: {
        paddingH: 16,
        paddingV: 8,
        fontSize: 17,
        minHeight: 40,
        borderWidth: 1,
      },
    },
    defaults: {
      variant: 'default',
      size: 'md',
      pressedOpacity: 0.9,
      labelVariant: 'body',
    },
  },
  cards: {
    variants: {
      default: {
        bg: 'card',
        border: 'gray700',
        radius: 'md',
        borderWidth: 1,
      },
      elevated: {
        bg: 'card',
        border: 'card',
        radius: 'lg',
        borderWidth: 0,
        elevation: 3,
        spinner: 'brand',
      },
      outline: {
        bg: 'background',
        border: 'gray700',
        radius: 'md',
        borderWidth: 1,
      },
      tinted: {
        bg: 'muted',
        border: 'muted',
        radius: 'md',
        borderWidth: 1,
      },
    },
    sizes: {
      sm: { padding: 'sm', borderWidth: 1 },
      md: { padding: 'md' },
      lg: { padding: 'lg', minHeight: 88 },
    },
    defaults: { variant: 'default', size: 'md' },
  },
} as const);

export const theme = createTheme(themeConfig);
export type AppTheme = typeof theme;
