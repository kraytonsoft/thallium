// minimal generic theme contracts + helpers (no app tokens, no components)
export type Expand<T> = { [K in keyof T]: T[K] } & {};

export function deepMerge<T extends object, U extends object>(
  base: T,
  ext: U
): Expand<T & U> {
  const out: any = Array.isArray(base)
    ? [...(base as any)]
    : { ...(base as any) };
  for (const [k, v] of Object.entries(ext as any)) {
    const bv = (base as any)[k];
    if (v && typeof v === 'object' && !Array.isArray(v))
      out[k] = deepMerge(bv ?? {}, v);
    else out[k] = v;
  }
  return out as Expand<T & U>;
}

// color ref can be a token name or a raw string (escape hatch)
export type ColorRef<C extends Record<string, string>> =
  | (keyof C & string)
  | (string & {});

// minimal text variant contract; color validated against the app's color keys
export type AppFont<ColorKey extends string> = {
  fontFamily?: string;
  fontSize: number;
  lineHeight?: number;
  color?: ColorKey | (string & {});
};

// generic theme factory: derives types from whatever you pass
export function defineTheme<
  const C extends Record<string, string>,
  const S extends Record<string, number>,
  const R extends Record<string, number>,
  const TV extends Record<string, AppFont<keyof C & string>>
>(spec: { colors: C; spacing: S; borderRadii: R; textVariants: TV }) {
  return spec;
}

// inference helpers for any concrete theme object
export type ColorNameFrom<T> = T extends { colors: infer C }
  ? keyof C & string
  : never;
export type SpacingKeyFrom<T> = T extends { spacing: infer S }
  ? keyof S & string
  : never;
export type RadiusKeyFrom<T> = T extends { borderRadii: infer R }
  ? keyof R & string
  : never;
export type TextVariantNameFrom<T> = T extends { textVariants: infer TV }
  ? keyof TV & string
  : never;

// resolve token-or-string at runtime
export function resolveColor<C extends Record<string, string>>(
  colors: C,
  value: keyof C | string
) {
  return (value in colors ? (colors as any)[value as any] : value) as string;
}

// extend/override a theme with preserved literal unions
export function extendTheme<Base, Ext>(base: Base, overrides: Ext) {
  return deepMerge(base as any, overrides as any) as Expand<Base & Ext>;
}

// Primitives and Relations
// ── Button tokens (variants + sizes + defaults) ──────────────────────────────
export type ButtonVariantSpec<
  ColorKey extends string,
  RadiusKey extends string
> = {
  bg: ColorKey | (string & {});
  text: ColorKey | (string & {});
  border: ColorKey | (string & {});
  radius: RadiusKey;
  padding?: number; // fallback if size not provided
  borderWidth?: number; // fallback if size not provided
};

export type ButtonSizeSpec = {
  paddingH: number; // horizontal padding
  paddingV: number; // vertical padding
  gap?: number; // space between icon & label
  minHeight?: number; // e.g., 40 / 44 / 48
  icon?: number; // suggested icon size for this button size
  borderWidth?: number; // can override per size if you prefer
};

export type ButtonsBlock<C extends string, R extends string> = {
  variants: Record<string, ButtonVariantSpec<C, R>> & {
    primary: ButtonVariantSpec<C, R>;
    secondary: ButtonVariantSpec<C, R>;
    destructive: ButtonVariantSpec<C, R>;
    outlined: ButtonVariantSpec<C, R>;
    disabled: ButtonVariantSpec<C, R>;
  };
  sizes: Record<string, ButtonSizeSpec> & {
    sm: ButtonSizeSpec;
    md: ButtonSizeSpec;
    lg: ButtonSizeSpec;
  };
  defaults?: {
    variant?: keyof ButtonsBlock<C, R>['variants'] & string;
    size?: keyof ButtonsBlock<C, R>['sizes'] & string;
    pressedOpacity?: number; // default 0.85
  };
};

// Helpers to infer names from a concrete theme object
export type ButtonVariantNameFrom<T> = T extends { buttons: infer B }
  ? B extends { variants: infer V }
    ? keyof V & string
    : never
  : never;

export type ButtonSizeNameFrom<T> = T extends { buttons: infer B }
  ? B extends { sizes: infer S }
    ? keyof S & string
    : never
  : never;

// ── Switch tokens (variants + sizes + defaults) ──────────────────────────────
export type SwitchVariantSpec<
  ColorKey extends string,
  RadiusKey extends string
> = {
  trackOn: ColorKey | (string & {});
  trackOff: ColorKey | (string & {});
  trackDisabled: ColorKey | (string & {});
  thumb: ColorKey | (string & {});
  radius: RadiusKey;
};

export type SwitchSizeSpec = {
  width: number; // total track width
  height: number; // total track height
  padding: number; // inner padding between track edge and thumb
  thumb: number; // thumb diameter
};

export type SwitchesBlock<C extends string, R extends string> = {
  variants: Record<string, SwitchVariantSpec<C, R>> & {
    default: SwitchVariantSpec<C, R>;
  };
  sizes: Record<string, SwitchSizeSpec> & {
    sm: SwitchSizeSpec;
    md: SwitchSizeSpec;
    lg: SwitchSizeSpec;
  };
  defaults?: {
    variant?: keyof SwitchesBlock<C, R>['variants'] & string;
    size?: keyof SwitchesBlock<C, R>['sizes'] & string;
  };
};

export type SwitchVariantNameFrom<T> = T extends { switches: infer B }
  ? B extends { variants: infer V }
    ? keyof V & string
    : never
  : never;

export type SwitchSizeNameFrom<T> = T extends { switches: infer B }
  ? B extends { sizes: infer S }
    ? keyof S & string
    : never
  : never;

// ── TextInput tokens (variants + sizes + defaults) ───────────────────────────
export type InputVariantSpec<
  ColorKey extends string,
  RadiusKey extends string
> = {
  bg: ColorKey | (string & {});
  text: ColorKey | (string & {});
  border: ColorKey | (string & {}); // color token for the border
  placeholder?: ColorKey | (string & {});
  selection?: ColorKey | (string & {});
  disabled: {
    bg: ColorKey | (string & {});
    text: ColorKey | (string & {});
    border: ColorKey | (string & {});
  };
  radius: RadiusKey;
  borderWidth?: number;
};

export type InputSizeSpec = {
  fontSize: number; // text size
  paddingH: number; // horizontal padding
  paddingV: number; // vertical padding
  minHeight?: number; // e.g., 40/44/48
  borderWidth?: number; // default 1
};

export type InputsBlock<C extends string, R extends string> = {
  variants: Record<string, InputVariantSpec<C, R>> & {
    default: InputVariantSpec<C, R>;
  };
  sizes: Record<string, InputSizeSpec> & {
    sm: InputSizeSpec;
    md: InputSizeSpec;
    lg: InputSizeSpec;
  };
  defaults?: {
    variant?: keyof InputsBlock<C, R>['variants'] & string;
    size?: keyof InputsBlock<C, R>['sizes'] & string;
    fontFamily?: string; // optional global family
  };
};

export type InputVariantNameFrom<T> = T extends { inputs: infer B }
  ? B extends { variants: infer V }
    ? keyof V & string
    : never
  : never;

export type InputSizeNameFrom<T> = T extends { inputs: infer B }
  ? B extends { sizes: infer S }
    ? keyof S & string
    : never
  : never;

// ── Checkbox tokens ──────────────────────────────────────────────────────────
export type CheckboxVariantSpec<
  ColorKey extends string,
  RadiusKey extends string
> = {
  boxOn: ColorKey | (string & {});
  boxOff: ColorKey | (string & {});
  borderOn: ColorKey | (string & {});
  borderOff: ColorKey | (string & {});
  check: ColorKey | (string & {});
  radius: RadiusKey;
  borderWidth?: number; // default width for this variant
};

export type CheckboxSizeSpec = {
  box: number; // square size (px)
  gap?: number; // space between box and label
  borderWidth?: number; // size-level default
};

export type CheckboxesBlock<C extends string, R extends string> = {
  variants: Record<string, CheckboxVariantSpec<C, R>> & {
    default: CheckboxVariantSpec<C, R>;
  };
  sizes: Record<string, CheckboxSizeSpec> & {
    sm: CheckboxSizeSpec;
    md: CheckboxSizeSpec;
    lg: CheckboxSizeSpec;
  };
  defaults?: {
    variant?: keyof CheckboxesBlock<C, R>['variants'] & string;
    size?: keyof CheckboxesBlock<C, R>['sizes'] & string;
    pressedOpacity?: number; // default 0.85
  };
};

export type CheckboxVariantNameFrom<T> = T extends { checkboxes: infer B }
  ? B extends { variants: infer V }
    ? keyof V & string
    : never
  : never;

export type CheckboxSizeNameFrom<T> = T extends { checkboxes: infer B }
  ? B extends { sizes: infer S }
    ? keyof S & string
    : never
  : never;

// ── Pill tokens (variants + sizes + defaults) ────────────────────────────────
export type PillVariantSpec<
  ColorKey extends string,
  RadiusKey extends string
> = {
  bgActive: ColorKey | (string & {});
  bgInactive: ColorKey | (string & {});
  textActive: ColorKey | (string & {});
  textInactive: ColorKey | (string & {});
  borderActive?: ColorKey | (string & {});
  borderInactive?: ColorKey | (string & {});
  radius: RadiusKey;
  borderWidth?: number; // default for this variant
};

export type PillSizeSpec<S extends string> = {
  paddingH: S;
  paddingV: S;
  fontSize?: number;
  minHeight?: number;
  borderWidth?: number;
};

export type PillsBlock<C extends string, R extends string, S extends string> = {
  variants: Record<string, PillVariantSpec<C, R>> & {
    default: PillVariantSpec<C, R>;
  };
  sizes: Record<string, PillSizeSpec<S>> & {
    sm: PillSizeSpec<S>;
    md: PillSizeSpec<S>;
    lg: PillSizeSpec<S>;
  };
  defaults?: {
    variant?: keyof PillsBlock<C, R, S>['variants'] & string;
    size?: keyof PillsBlock<C, R, S>['sizes'] & string;
    pressedOpacity?: number;
    labelVariant?: string;
  };
};

export type PillVariantNameFrom<T> = T extends { pills: infer B }
  ? B extends { variants: infer V }
    ? keyof V & string
    : never
  : never;

export type PillSizeNameFrom<T> = T extends { pills: infer B }
  ? B extends { sizes: infer S }
    ? keyof S & string
    : never
  : never;

// ── Add after your other blocks (Buttons, Switches, etc) ─────────────────────

// Utility for spacing/radius token references (or numbers via props)
export type SpacingKeyRef<S extends string> = S; // numbers can still be passed via Box props
export type RadiusKeyRef<R extends string> = R; // numbers can still be passed via Box props

export type CardVariantSpec<
  ColorKey extends string,
  RadiusKey extends string
> = {
  bg: ColorKey | (string & {});
  border?: ColorKey | (string & {});
  radius: RadiusKey;
  borderWidth?: number;
  spinner?: ColorKey | (string & {}); // optional loading spinner color
  elevation?: number; // Android convenience (falls through to style)
};

export type CardSizeSpec<
  SpacingKey extends string,
  RadiusKey extends string
> = {
  // Use spacing/radius tokens here; callers can still pass raw numbers via props
  padding?: SpacingKeyRef<SpacingKey>;
  paddingH?: SpacingKeyRef<SpacingKey>;
  paddingV?: SpacingKeyRef<SpacingKey>;
  radius?: RadiusKeyRef<RadiusKey>; // can override variant radius per size
  borderWidth?: number;
  minHeight?: number;
  elevation?: number;
};

export type CardsBlock<C extends string, R extends string, S extends string> = {
  variants: Record<string, CardVariantSpec<C, R>> & {
    default: CardVariantSpec<C, R>;
  };
  sizes: Record<string, CardSizeSpec<S, R>> & {
    sm: CardSizeSpec<S, R>;
    md: CardSizeSpec<S, R>;
    lg: CardSizeSpec<S, R>;
  };
  defaults?: {
    variant?: keyof CardsBlock<C, R, S>['variants'] & string;
    size?: keyof CardsBlock<C, R, S>['sizes'] & string;
  };
};

// Inference helpers
export type CardVariantNameFrom<T> = T extends { cards: infer B }
  ? B extends { variants: infer V }
    ? keyof V & string
    : never
  : never;

export type CardSizeNameFrom<T> = T extends { cards: infer B }
  ? B extends { sizes: infer S }
    ? keyof S & string
    : never
  : never;
